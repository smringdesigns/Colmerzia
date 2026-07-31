<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Concerns\BelongsToStoreOrNull;

class Setting extends Model
{
    use HasFactory, BelongsToStoreOrNull;

    protected $fillable = [
        'store_id',
        'key',
        'value',
        'group',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    /**
     * La configuración pertenece a una tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}