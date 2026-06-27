<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    /**
     * La auditoría pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Usuario que realizó la acción.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}