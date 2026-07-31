<?php

namespace App\Models;

use App\Models\Role;
use App\Models\Store;
use Illuminate\Contracts\Auth\MustVerifyEmail; // <-- ADICIÓN 1: Importación de la interfaz
use Illuminate\Auth\Notifications\ResetPassword;
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
class User extends Authenticatable implements MustVerifyEmail // <-- ADICIÓN 2: Implementación en la clase
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
     * Envía el enlace de recuperación de contraseña al frontend React.
     *
     * Laravel genera el token de recuperación, pero el enlace
     * apunta a la pantalla correspondiente del frontend.
     */
    public function sendPasswordResetNotification($token): void
    {
        $frontendUrl = rtrim(
            config('app.frontend_url', 'http://localhost:5173'),
            '/'
        );

        $resetUrl = $frontendUrl
            . '/reset-password'
            . '?token=' . urlencode($token)
            . '&email=' . urlencode($this->email);

        $this->notify(
            new ResetPassword($resetUrl)
        );
    }
}