<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables.
     */
    protected $fillable = [
        'store_id',
        'uuid',
        'name',
        'slug',
        'logo',
        'description',
        'is_active',
    ];

    /**
     * Conversión automática.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * La marca pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * La marca tiene muchos productos.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}