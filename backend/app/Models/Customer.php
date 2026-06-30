<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'store_id',
        'uuid',
        'first_name',
        'last_name',
        'email',
        'phone',
        'document_type',
        'document_number',
        'company',
        'birth_date',
        'notes',
        'is_active',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_active'  => 'boolean',
        ];
    }

    /**
     * El cliente pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Direcciones del cliente.
     */
    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    /**
     * Carritos del cliente.
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Pedidos del cliente.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Nombre completo.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
