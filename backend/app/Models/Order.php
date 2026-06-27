<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'customer_id',
        'number',
        'status',
        'subtotal',
        'tax',
        'discount',
        'shipping',
        'total',
        'paid_at',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'discount' => 'decimal:2',
            'shipping' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * El pedido pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * El pedido pertenece a un cliente.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Productos del pedido.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Pagos del pedido.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}