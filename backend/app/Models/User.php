<?php

namespace App\Models;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'store_id',
    'uuid',
    'name',
    'email',
    'password',
    'avatar',
    'is_active',
    'last_login_at',
])]
#[Hidden([
    'password',
    'remember_token',
])]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(string $role): bool
    {
        $role = strtolower(trim($role));

        return $this->roles()
            ->whereRaw('LOWER(BTRIM(slug)) = ?', [$role])
            ->exists();
    }

    public function hasPermission(string $permission): bool
    {
        $permission = strtolower(trim($permission));

        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permission): void {
                $query->whereRaw('LOWER(BTRIM(slug)) = ?', [$permission]);
            })
            ->exists();
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function sendEmailVerificationNotification(): void
    {
        VerifyEmail::toMailUsing(function ($notifiable, $url): MailMessage {
            $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
            $frontendVerifyUrl = $frontendUrl
                . '/verify-email?verify_url='
                . urlencode($url);

            return (new MailMessage)
                ->subject('Verifica tu cuenta en Colmerzia')
                ->line('Tu cuenta fue creada correctamente.')
                ->line('Confirma tu correo electrónico haciendo clic en el siguiente botón:')
                ->action('Verificar mi correo', $frontendVerifyUrl)
                ->line('Si no creaste esta cuenta, puedes ignorar este mensaje.');
        });

        $this->notify(new VerifyEmail);
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPassword($token));
    }
}
