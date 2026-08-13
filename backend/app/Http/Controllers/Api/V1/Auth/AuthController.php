<?php

namespace App\Http\Controllers\Api\V1\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Contracts\Auth\AuthServiceInterface;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\LoginResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthServiceInterface $authService
    ) {
    }

    public function register(RegisterRequest $request)
    {
        $this->resolvePublicTenant($request);

        $data = new LoginResource(
            $this->authService->register(
                $request->name,
                $request->email,
                $request->password
            )
        );

        return $data->response()->setStatusCode(201);
    }

    public function login(LoginRequest $request): LoginResource
    {
        // 1. Ejecutamos el servicio intacto como lo tenías
        $this->resolvePublicTenant($request);

        $result = $this->authService->login(
            $request->email,
            $request->password
        );

        // 2. Validación "antifallos" para inyectar relaciones sin romper nada,
        // evaluando dinámicamente el tipo de dato que devuelve el servicio.
        if ($result instanceof User) {
            $result->load(['store', 'roles']);
        } elseif (is_array($result) && isset($result['user']) && $result['user'] instanceof User) {
            $result['user']->load(['store', 'roles']);
        } elseif (is_object($result) && isset($result->user) && $result->user instanceof User) {
            $result->user->load(['store', 'roles']);
        }

        // 3. Retornamos el recurso igual que antes
        return new LoginResource($result);
    }

    public function me(Request $request): UserResource
    {
        // Cargamos las relaciones directamente del usuario autenticado en la petición
        return new UserResource(
            $request->user()->load(['store', 'roles'])
        );
    }

    public function logout(Request $request)
    {
        $this->authService->logout(
            $request->user()
        );

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    /**
     * Enviar correo de recuperación de contraseña adaptado para API SPA.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones.'
            ]);
        }

        $token = Password::broker()->createToken($user);

        ResetPasswordNotification::createUrlUsing(function ($notifiable, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($notifiable->getEmailForPasswordReset());
        });

        $user->sendPasswordResetNotification($token);

        return response()->json([
            'message' => 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones para restablecer tu contraseña.'
        ]);
    }

    /**
     * Restablecer la contraseña usando el token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    /**
     * Reenviar el enlace de verificación de correo.
     */
    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya ha sido verificado.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => '¡Enlace de verificación enviado con éxito!']);
    }

    /**
     * Confirmar la verificación del correo mediante enlace firmado.
     */
    public function verifyEmail(Request $request, int $id, string $hash)
    {
        $user = User::findOrFail($id);
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'El enlace de verificacion no es valido.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect("{$frontendUrl}/dashboard?verified=1");
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return redirect("{$frontendUrl}/dashboard?verified=1");
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
            $centralDomains = config('tenancy.central_domains', []);

            if (!in_array($host, $centralDomains, true)) {
                if (str_ends_with($host, '.localhost')) {
                    $subdomain = substr($host, 0, -strlen('.localhost'));
                } elseif (str_ends_with($host, '.127.0.0.1')) {
                    $subdomain = substr($host, 0, -strlen('.127.0.0.1'));
                } else {
                    $subdomain = explode('.', $host)[0] ?? null;
                }
            }
        }

        if (!$subdomain) {
            return;
        }

        $store = Store::where('subdomain', $subdomain)->first();

        if (!$store) {
            return;
        }

        Tenant::set($store);
        app()->instance('tenant', $store);
        $request->attributes->set('tenant', $store);
    }
}
