<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'customer_id',
        'status',
        'expires_at',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
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
}