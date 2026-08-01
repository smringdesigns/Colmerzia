<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    use HasFactory;

    /**
     * Campos permitidos para asignación masiva.
     */
    protected $fillable = [
        'store_id',
        'contact_email',
        'contact_phone',
        'currency',
        'timezone',
        'logo_path',
        'theme_colors',
    ];

    /**
     * Conversión automática de tipos (Casts).
     */
    protected function casts(): array
    {
        return [
            // Convierte automáticamente el JSON de la base de datos a un Array de PHP y viceversa
            'theme_colors' => 'array', 
        ];
    }

    /**
     * Relación Inversa:
     * Esta configuración pertenece a una única tienda.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}