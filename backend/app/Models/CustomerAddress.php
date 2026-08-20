<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * OJO: este modelo se reescribió porque el $fillable anterior usaba
 * nombres de columna que no existen en la tabla ('name', 'recipient',
 * 'address', 'reference') — la migración real usa 'label',
 * 'recipient_name', 'address_line_1'/'address_line_2', 'notes'.
 * Crear un registro con los nombres viejos habría fallado con un
 * error SQL de columna inexistente; nunca se llegó a usar.
 */
class CustomerAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'uuid',
        'label',
        'recipient_name',
        'phone',
        'address_line_1',
        'address_line_2',
        'country',
        'state',
        'city',
        'postal_code',
        'latitude',
        'longitude',
        'is_shipping',
        'is_billing',
        'is_default',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_shipping' => 'boolean',
            'is_billing' => 'boolean',
            'is_default' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
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
