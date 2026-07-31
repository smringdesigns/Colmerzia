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
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthServiceInterface $authService
    ) {
    }

    public function register(RegisterRequest $request)
    {
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
        return new LoginResource(
            $this->authService->login(
                $request->email,
                $request->password
            )
        );
    }

    public function me(Request $request): UserResource
    {
        return new UserResource(
            $request->user()
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

        // Por seguridad y buenas prácticas de API, si el usuario no existe 
        // respondemos con éxito genérico para no revelar qué correos están registrados.
        if (!$user) {
            return response()->json([
                'message' => 'Si el correo existe en nuestro sistema, te hemos enviado las instrucciones.'
            ]);
        }

        // Creamos el token de recuperación directamente usando el broker de Password
        $token = Password::broker()->createToken($user);

        // Personalizamos la URL de reseteo para que apunte directamente a tu Frontend en React
        ResetPasswordNotification::createUrlUsing(function ($notifiable, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($notifiable->getEmailForPasswordReset());
        });

        // Enviamos la notificación al usuario
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
}