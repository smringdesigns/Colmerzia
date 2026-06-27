<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'title',
        'message',
        'type',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    /**
     * La notificación pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * La notificación pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}