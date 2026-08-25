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
        'social_links',
    ];

    /**
     * Conversión automática de tipos (Casts).
     */
    protected function casts(): array
    {
        return [
            // Convierte automáticamente el JSON de la base de datos
            // a un Array de PHP y viceversa.
            'theme_colors' => 'array',

            // Redes sociales de la tienda.
            'social_links' => 'array',
        ];
    }

    /**
     * Atributo calculado, no una columna: se agrega siempre al JSON
     * de este modelo para que el frontend (admin o storefront) nunca
     * tenga que armar la URL del logo a mano a partir de logo_path
     * (que es una ruta relativa tipo "stores/3/logo/xyz.png", no
     * usable directo en un <img src>).
     */
    protected $appends = ['logo_url'];

    protected function logoUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->logo_path
                ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->logo_path)
                : null,
        );
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