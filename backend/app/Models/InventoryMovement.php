<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryMovement extends Model
{
    use HasFactory;

    public const TYPE_IN = 'in';
    public const TYPE_OUT = 'out';
    public const TYPE_ADJUSTMENT = 'adjustment';
    public const TYPE_TRANSFER = 'transfer';
    public const TYPE_RETURN = 'return';

    /**
     * Campos asignables masivamente.
     */
    protected $fillable = [
        'inventory_id',
        'user_id',
        'uuid',
        'type',
        'quantity',
        'stock_before',
        'stock_after',
        'reason',
        'reference',
        'metadata',
        'performed_at',
    ];

    /**
     * Conversión automática de tipos.
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'stock_before' => 'integer',
            'stock_after' => 'integer',
            'metadata' => 'array',
            'performed_at' => 'datetime',
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
