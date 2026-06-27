<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerAddress extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'customer_id',
        'name',
        'recipient',
        'phone',
        'country',
        'state',
        'city',
        'address',
        'postal_code',
        'reference',
        'is_default',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    /**
     * La dirección pertenece a un cliente.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}