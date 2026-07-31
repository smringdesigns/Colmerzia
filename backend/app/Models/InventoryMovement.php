<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryMovement extends Model
{
    use HasFactory;

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'inventory_id',
        'user_id',
        'type',
        'quantity',
        'previous_stock',
        'new_stock',
        'reference',
        'notes',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'previous_stock' => 'integer',
            'new_stock' => 'integer',
        ];
    }

    /**
     * El movimiento pertenece a un inventario.
     */
    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    /**
     * Usuario que realizó el movimiento.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}