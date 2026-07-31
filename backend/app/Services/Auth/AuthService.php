<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\DTOs\Auth\LoginResponseDTO;
use App\Contracts\Auth\AuthServiceInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class AuthService implements AuthServiceInterface
{
    public function register(
        string $name,
        string $email,
        string $password
    ): LoginResponseDTO
    {
        // El registro solo tiene sentido dentro del contexto de una
        // tienda (el nuevo usuario queda asociado a ella). Sin un
        // tenant resuelto no sabríamos a qué store_id asignarlo.
        if (!Tenant::check()) {
            throw ValidationException::withMessages([
                'email' => 'El registro debe realizarse desde el subdominio de una tienda.',
            ]);
        }

        // La tienda no puede sumar más staff del que su plan permite.
        $subscription = Tenant::subscription();

        if ($subscription && $subscription->hasReachedLimit(
            'max_staff_users',
            User::where('store_id', Tenant::id())->count()
        )) {
            throw ValidationException::withMessages([
                'email' => 'Se alcanzó el límite de usuarios de tu plan actual.',
            ]);
        }

        $user = User::create([
            'uuid' => Str::uuid(),
            'store_id' => Tenant::id(),
            'name' => $name,
            'email' => strtolower(trim($email)),
            'password' => $password,
            'is_active' => true,
        ]);

        // A propósito NO se le asigna ningún rol por defecto: un
        // usuario recién registrado no debe tener permisos hasta que
        // alguien con autoridad en la tienda se los asigne. Con
        // Gate::before() denegando por defecto, esto ya queda cubierto
        // solo con no adjuntar ningún rol.
        $token = $user
            ->createToken('colmerzia')
            ->plainTextToken;

        return new LoginResponseDTO(
            user: $user,
            token: $token
        );
    }

    public function login(
        string $email,
        string $password
    ): LoginResponseDTO
    {
        $user = User::query()
            ->where('email', strtolower(trim($email)))
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new AuthenticationException(
                'Credenciales inválidas.'
            );
        }

        if (!$user->is_active) {
            throw new AuthenticationException(
                'Usuario inactivo.'
            );
        }

        // El usuario debe pertenecer a la tienda resuelta por el
        // subdominio de la petición (si hay una). Sin esta validación,
        // cualquier usuario podría autenticarse desde el subdominio de
        // otra tienda y solo enterarse del desajuste en la siguiente
        // petición, cuando currentStoreId() lo rechace con 403.
        $tenantId = Tenant::id();

        if ($tenantId && $user->store_id !== $tenantId) {
            throw new AuthenticationException(
                'Credenciales inválidas.'
            );
        }

        // Un solo token activo
        $user->tokens()->delete();

        $token = $user
            ->createToken('colmerzia')
            ->plainTextToken;

        $user->update([
            'last_login_at' => now(),
        ]);

        return new LoginResponseDTO(
            user: $user,
            token: $token
        );
    }

    public function logout(User $user): void
    {
        $user
            ->currentAccessToken()
            ?->delete();
    }
}