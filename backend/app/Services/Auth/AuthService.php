<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\DTOs\Auth\LoginResponseDTO;
use App\Contracts\Auth\AuthServiceInterface;
use Illuminate\Auth\AuthenticationException;

class AuthService implements AuthServiceInterface
{
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