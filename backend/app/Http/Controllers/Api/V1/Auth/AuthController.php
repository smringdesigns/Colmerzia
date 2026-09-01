<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Contracts\Auth\AuthServiceInterface;
use App\DTOs\Auth\LoginResponseDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\LoginResource;
use App\Http\Resources\User\UserResource;
use App\Models\Store;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthServiceInterface $authService
    ) {
    }

    public function register(RegisterRequest $request)
    {
        $this->resolvePublicTenant($request);

        $result = $this->authService->register(
            $request->name,
            $request->email,
            $request->password
        );

        // Sin este load(), 'store' viene vacío en la respuesta
        // (whenLoaded('store') omite la clave si la relación no fue
        // cargada) -- el usuario recién registrado no vería el
        // nombre/subdominio de su tienda hasta el próximo /me.
        if ($result instanceof LoginResponseDTO) {
            $result->user->load(['store', 'roles.permissions']);
        }

        return (new LoginResource($result))
            ->response()
            ->setStatusCode(201);
    }

    public function login(LoginRequest $request): LoginResource
    {
        $this->resolvePublicTenant($request);

        $result = $this->authService->login(
            $request->email,
            $request->password
        );

        if ($result instanceof LoginResponseDTO) {
            // roles.permissions (no solo roles): sin el nested-load,
            // UserResource::toArray() dispara una query POR CADA rol
            // que tenga el usuario al armar el array de "permissions"
            // ($role->permissions dentro de un flatMap) -- un N+1
            // silencioso en el endpoint que se llama en cada login.
            $result->user->load(['store', 'roles.permissions']);
        }

        return new LoginResource($result);
    }

    public function me(Request $request): UserResource
    {
        // Mismo motivo que en login(): roles.permissions, no solo
        // roles -- este endpoint lo llama el frontend en CADA carga
        // de página (bootstrap de sesión), así que el N+1 acá pega
        // más seguido todavía que en login.
        return new UserResource(
            $request->user()->load(['store', 'roles.permissions'])
        );
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
        ]);

        $email = strtolower(trim($data['email']));
        $user = User::query()->where('email', $email)->first();

        // Respuesta uniforme para no revelar si el correo existe.
        if (!$user) {
            return response()->json([
                'message' => 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones.',
            ]);
        }

        ResetPasswordNotification::createUrlUsing(
            function ($notifiable, string $token): string {
                $frontendUrl = rtrim((string) config('app.frontend_url'), '/');

                return $frontendUrl
                    . '/reset-password?token='
                    . urlencode($token)
                    . '&email='
                    . urlencode($notifiable->getEmailForPasswordReset());
            }
        );

        Password::broker()->sendResetLink(['email' => $email]);

        return response()->json([
            'message' => 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones para restablecer tu contraseña.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            [
                'email' => strtolower(trim($data['email'])),
                'password' => $data['password'],
                'password_confirmation' => $data['password_confirmation'],
                'token' => $data['token'],
            ],
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Invalida tokens Bearer después de cambiar la contraseña.
                $user->tokens()->delete();
                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'El correo ya ha sido verificado.',
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => '¡Enlace de verificación enviado con éxito!',
        ]);
    }

    public function verifyEmail(Request $request, int $id, string $hash)
    {
        $user = User::query()->findOrFail($id);
        $frontendUrl = rtrim((string) config('app.frontend_url'), '/');

        abort_unless(
            hash_equals($hash, sha1($user->getEmailForVerification())),
            403,
            'El enlace de verificación no es válido.'
        );

        if (!$user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return redirect($frontendUrl . '/dashboard?verified=1');
    }

    private function resolvePublicTenant(Request $request): void
    {
        Tenant::clear();

        $subdomain = $request->header('X-Tenant');

        if (is_string($subdomain)) {
            $subdomain = strtolower(trim($subdomain));
        }

        if (!$subdomain) {
            $host = strtolower($request->getHost());
            $centralDomains = array_map(
                static fn (string $domain): string => strtolower(trim($domain)),
                config('tenancy.central_domains', [])
            );

            if (!in_array($host, $centralDomains, true)) {
                foreach ($centralDomains as $domain) {
                    $suffix = '.' . $domain;

                    if (str_ends_with($host, $suffix)) {
                        $candidate = substr($host, 0, -strlen($suffix));

                        if ($candidate !== '' && !str_contains($candidate, '.')) {
                            $subdomain = $candidate;
                        }

                        break;
                    }
                }
            }
        }

        if (!$subdomain) {
            return;
        }

        $store = Store::query()
            ->whereRaw('LOWER(BTRIM(subdomain)) = ?', [$subdomain])
            ->where('is_active', true)
            ->first();

        if ($store) {
            Tenant::set($store);
            app()->instance('tenant', $store);
            $request->attributes->set('tenant', $store);
        }
    }
}
