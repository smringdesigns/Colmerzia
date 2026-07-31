<?php

namespace App\Support\Tenancy;

use App\Models\Store;

/**
 * Guarda la tienda (Store) resuelta a partir del subdominio de la
 * petición actual, para que cualquier parte de la app (controladores,
 * servicios, policies) pueda preguntar "¿en qué tienda estamos?" sin
 * tener que pasarse el Store manualmente por todos lados.
 *
 * Se resetea automáticamente en cada request porque el contenedor de
 * Laravel se reconstruye en cada petición (no hay estado compartido
 * entre usuarios, como sí pasaría con una variable estática en un
 * proceso de larga duración).
 */
class Tenant
{
    protected static ?Store $current = null;

    public static function set(Store $store): void
    {
        static::$current = $store;
    }

    public static function current(): ?Store
    {
        return static::$current;
    }

    public static function id(): ?int
    {
        return static::$current?->id;
    }

    public static function check(): bool
    {
        return static::$current !== null;
    }

    /**
     * Útil sobre todo en tests, para limpiar el estado entre casos.
     */
    public static function clear(): void
    {
        static::$current = null;
    }
}
