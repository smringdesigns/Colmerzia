<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailPasswordFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_signed_email_verification_marks_the_user_as_verified(): void
    {
        config(['app.frontend_url' => 'http://localhost:5173']);

        $user = User::factory()->unverified()->create([
            'email' => 'nuevo.usuario@gmail.com',
        ]);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );

        $response = $this->get($url);

        $response->assertRedirect('http://localhost:5173/dashboard?verified=1');
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_forgot_password_sends_a_frontend_reset_link_with_the_real_token(): void
    {
        Notification::fake();
        config(['app.frontend_url' => 'http://localhost:5173']);

        $user = User::factory()->create([
            'email' => 'reset.usuario@gmail.com',
        ]);

        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertOk();

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
            $mail = $notification->toMail($user);
            $actionUrl = $mail->actionUrl ?? '';

            return str_starts_with($actionUrl, 'http://localhost:5173/reset-password?')
                && str_contains($actionUrl, 'email=reset.usuario%40gmail.com')
                && str_contains($actionUrl, 'token=')
                && !str_contains($actionUrl, 'http%3A%2F%2Flocalhost%3A5173%2Freset-password');
        });
    }
}
