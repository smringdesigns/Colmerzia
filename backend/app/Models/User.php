<?php

namespace App\Models;

use App\Models\Role;
use App\Models\Store;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
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

    /**
     * Relación con la tienda a la que pertenece el usuario.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Roles asignados al usuario.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Verifica si el usuario tiene un rol específico.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()
            ->where('slug', $role)
            ->exists();
    }

    /**
     * Verifica si el usuario tiene un permiso específico.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();
    }

    /**
     * Conversión automática de atributos.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Envía el enlace de verificación de correo al frontend con el subdominio dinámico.
     */
    public function sendEmailVerificationNotification(): void
    {
        $store = $this->store;
        $subdomain = $store ? $store->subdomain : 'localhost';

        VerifyEmail::toMailUsing(function ($notifiable, $url) use ($subdomain) {
            $frontendVerifyUrl = "http://{$subdomain}.localhost:5174/verify-email?verify_url=" . urlencode($url);

            return (new MailMessage)
                ->subject('Verifica tu cuenta en Colmerzia')
                ->line('¡Hemos creado tu tienda exitosamente!')
                ->line('Para comenzar a usar tu panel y confirmar tus credenciales, haz clic en el siguiente botón:')
                ->action('Verificar mi correo', $frontendVerifyUrl)
                ->line('Si no creaste una cuenta, puedes ignorar este mensaje.');
        });

        $this->notify(new VerifyEmail);
    }

    /**
     * Envía el enlace de recuperación de contraseña al frontend React.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPassword($token));
    }
}