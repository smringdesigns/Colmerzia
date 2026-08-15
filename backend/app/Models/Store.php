<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Store extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos permitidos para asignación masiva.
     */
    protected $fillable = [
        'uuid',
        'name',
        'subdomain',
        'custom_domain',
        'email',
        'is_active',
        'is_verified',
        'business_type',
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
     * Generar UUID automáticamente al crear la tienda.
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Relación:
     * Una tienda tiene muchos usuarios.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relación:
     * Una tienda tiene una configuración extendida (Moneda, logo, email, etc).
     */
    public function settings()
    {
        return $this->hasOne(StoreSetting::class);
    }

    /**
     * Relación:
     * Una tienda tiene muchos roles.
     */
    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    /**
     * Categorías de la tienda.
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Relación:
     * Una tienda tiene una suscripción.
     */
    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }
}