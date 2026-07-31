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
use Illuminate\Foundation\Auth\EmailVerificationRequest;

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
    public function verifyEmail(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya está verificado.']);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($request->user()));
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect("{$frontendUrl}/dashboard?verified=1");
    }
}