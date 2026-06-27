<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountRule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'store_id',
        'uuid',
        'name',
        'type',
        'value',
        'conditions',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value'      => 'decimal:2',
            'conditions' => 'array',
            'is_active'  => 'boolean',
            'starts_at'  => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * La regla pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}