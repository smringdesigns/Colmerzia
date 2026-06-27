<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables.
     */
    protected $fillable = [
        'store_id',
        'category_id',
        'brand_id',
        'uuid',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'compare_price',
        'cost',
        'status',
        'is_featured',
    ];

    /**
     * Conversión automática.
     */
    protected function casts(): array
    {
        return [
            'price'         => 'decimal:2',
            'compare_price' => 'decimal:2',
            'cost'          => 'decimal:2',
            'is_featured'   => 'boolean',
        ];
    }

    /**
     * El producto pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * El producto pertenece a una categoría.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * El producto pertenece a una marca.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Variantes del producto.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Imágenes del producto.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}