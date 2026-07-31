<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 1. Importamos el trait

class CartItem extends Model
{
    use HasFactory, HasUuids; // 2. Usamos el trait en la clase

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'cart_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'unit_price',
        'total',
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

    /**
     * El item pertenece a un producto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}