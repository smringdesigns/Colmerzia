<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'uuid',
        'name',
        'code',
        'address',
        'city',
        'country',
        'is_active',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * La bodega pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Inventarios almacenados en esta bodega.
     */
    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }
}