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
        'is_active',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
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
     * Una tienda tiene muchos roles (Para cuando integremos Spatie).
     */
    public function roles()
    {
        // Deberás asegurarte de tener importado el modelo Role cuando lleguemos a ese módulo
        // return $this->hasMany(Role::class); 
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