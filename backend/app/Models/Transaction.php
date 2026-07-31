<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'provider',
        'transaction_id',
        'status',
        'amount',
        'response',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'response' => 'array',
        ];
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}