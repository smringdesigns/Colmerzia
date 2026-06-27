<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'uuid',
        'sku',
        'name',
        'attributes',
        'price',
        'compare_price',
        'cost_price',
        'stock',
        'min_stock',
        'weight',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'attributes'    => 'array',
            'price'         => 'decimal:2',
            'compare_price' => 'decimal:2',
            'cost_price'    => 'decimal:2',
            'weight'        => 'decimal:2',
            'is_active'     => 'boolean',
        ];
    }

    /**
     * La variante pertenece a un producto.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}