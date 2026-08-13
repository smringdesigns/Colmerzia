<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 1. Importamos el trait
use App\Models\Concerns\BelongsToStore;

class Cart extends Model
{
    use HasFactory, BelongsToStore, HasUuids; // 2. Usamos el trait en la clase

    /**
     * Estados del carrito.
     */
    public const STATUS_ACTIVE = 'active';
    public const STATUS_ABANDONED = 'abandoned';
    public const STATUS_CONVERTED = 'converted';

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'customer_id',
        'guest_token',      // <-- Agregado para que se pueda guardar
        'status',
        'coupon_id',        // <-- Agregado para que se puedan guardar cupones
        'subtotal',         // <-- Agregado para guardar el subtotal
        'discount',         // <-- Agregado para guardar descuentos
        'tax',              // <-- Agregado
        'shipping',         // <-- Agregado
        'total',            // <-- Agregado para guardar el total final
        'last_activity_at', // <-- Agregado
        'expires_at',
    ];

    /**
     * Define las columnas que deben generar un UUID automáticamente.
     */
    public function uniqueIds(): array // 3. Le indicamos a Laravel qué columna llevará el UUID
    {
        return ['uuid'];
    }

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'expires_at'       => 'datetime',
            'last_activity_at' => 'datetime',
            'subtotal'         => 'decimal:2', // <-- Forzamos a decimal
            'discount'         => 'decimal:2', // <-- Forzamos a decimal
            'tax'              => 'decimal:2', // <-- Forzamos a decimal
            'shipping'         => 'decimal:2', // <-- Forzamos a decimal
            'total'            => 'decimal:2', // <-- Forzamos a decimal
        ];
    }

    /**
     * El carrito pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * El carrito pertenece a un cliente.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Productos agregados al carrito.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * El cupón aplicado al carrito (si existe).
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
}
