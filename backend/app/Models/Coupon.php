<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'uuid',
        'code',
        'type',
        'value',
        'minimum_amount',
        'usage_limit',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'value'          => 'decimal:2',
            'minimum_amount' => 'decimal:2',
            'usage_limit'    => 'integer',
            'used_count'     => 'integer',
            'is_active'      => 'boolean',
            'starts_at'      => 'datetime',
            'expires_at'     => 'datetime',
        ];
    }

    /**
     * El cupón pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}