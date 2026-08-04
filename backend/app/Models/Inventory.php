<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'warehouse_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'reserved',
        'minimum',
        'maximum',
        'last_movement_at',
    ];


    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'reserved' => 'integer',
            'minimum' => 'integer',
            'maximum' => 'integer',
            'last_movement_at' => 'datetime',
        ];
    }


    /**
     * La existencia pertenece a una bodega.
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }


    /**
     * La existencia pertenece a un producto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }


    /**
     * La existencia pertenece a una variante.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }


    /**
     * Movimientos del inventario.
     */
    public function movements()
    {
        return $this->hasMany(InventoryMovement::class);
    }


    /**
     * Stock disponible.
     */
    public function available(): int
    {
        return max(
            0,
            $this->quantity - $this->reserved
        );
    }
}