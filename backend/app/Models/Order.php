<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Concerns\BelongsToStore;

class Order extends Model
{
    use HasFactory, BelongsToStore, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'customer_id',
        'cart_id',
        'uuid',
        'order_number',
        'status',
        'payment_status',
        'shipping_status',
        'subtotal',
        'discount',
        'tax',
        'shipping',
        'total',
        'customer_snapshot',
        'shipping_address',
        'notes',
        'paid_at',
        'shipped_at',
        'delivered_at',
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
            'customer_snapshot' => 'array',
            'shipping_address' => 'array',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
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
