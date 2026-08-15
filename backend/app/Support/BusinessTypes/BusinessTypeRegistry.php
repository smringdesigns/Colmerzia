<?php

namespace App\Support\BusinessTypes;

use InvalidArgumentException;

/**
 * Único punto de lectura de config/business_types.php. Nada en el
 * resto del código debería hacer config('business_types...')
 * directamente — todo pasa por acá, para que el día que esto se
 * mueva a base de datos solo haya que cambiar esta clase.
 */
class BusinessTypeRegistry
{
    public static function all(): array
    {
        return config('business_types', []);
    }

    public static function slugs(): array
    {
        return array_keys(self::all());
    }

    public static function exists(string $slug): bool
    {
        return array_key_exists($slug, self::all());
    }

    public static function get(string $slug): array
    {
        $type = self::all()[$slug] ?? null;

        if (!$type) {
            throw new InvalidArgumentException("El tipo de negocio [{$slug}] no existe.");
        }

        return $type;
    }

    public static function name(string $slug): string
    {
        return self::get($slug)['name'] ?? $slug;
    }

    public static function usesInventory(string $slug): bool
    {
        return (bool) (self::get($slug)['uses_inventory'] ?? true);
    }

    public static function storefrontLayout(string $slug): string
    {
        return self::get($slug)['storefront_layout'] ?? 'catalog';
    }

    /**
     * @return string[]
     */
    public static function defaultCategories(string $slug): array
    {
        return self::get($slug)['default_categories'] ?? [];
    }

    /**
     * Lista apta para poblar un <select> en el frontend: [{slug, name}, ...]
     */
    public static function options(): array
    {
        return collect(self::all())
            ->map(fn (array $type, string $slug) => [
                'slug' => $slug,
                'name' => $type['name'],
            ])
            ->values()
            ->all();
    }
}
