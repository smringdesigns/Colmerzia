<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'cart_id',
        'product_variant_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    /**
     * El item pertenece a un carrito.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * El item pertenece a una variante.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}