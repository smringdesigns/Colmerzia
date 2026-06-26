<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Role;
use App\Models\Store;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Relación:
     * Un usuario pertenece a una tienda.
     *
     * Tabla:
     * users.store_id -> stores.id
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relación:
     * Un usuario puede tener múltiples roles.
     *
     * Tabla pivote:
     * role_user
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Verifica si el usuario posee un rol específico.
     *
     * Ejemplo:
     * $user->hasRole('admin');
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()
            ->where('slug', $role)
            ->exists();
    }

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'is_active'         => 'boolean',
            'password'          => 'hashed',
        ];
    }
}