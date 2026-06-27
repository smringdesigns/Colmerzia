<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'warehouse_id',
        'product_variant_id',
        'stock',
        'reserved_stock',
        'minimum_stock',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'reserved_stock' => 'integer',
            'minimum_stock' => 'integer',
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
}