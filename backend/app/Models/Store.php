<?php

namespace App\Models;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos permitidos para asignación masiva.
     */
    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'email',
        'phone',
        'logo',
        'favicon',
        'subdomain',
        'country',
        'currency',
        'timezone',
        'is_active',
        'is_verified',
        'plan',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Relación:
     * Una tienda tiene muchos usuarios.
     *
     * stores.id -> users.store_id
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relación:
     * Una tienda tiene muchos roles.
     *
     * stores.id -> roles.store_id
     */
    public function roles()
    {
        return $this->hasMany(Role::class);
    }
}