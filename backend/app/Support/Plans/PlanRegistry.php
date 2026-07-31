<?php

namespace App\Support\Plans;

use InvalidArgumentException;

/**
 * Único punto de lectura de config/plans.php. Nada en el resto del
 * código debería hacer config('plans...') directamente — todo pasa
 * por acá, para que el día que esto se mueva a base de datos solo
 * haya que cambiar esta clase.
 */
class PlanRegistry
{
    public static function all(): array
    {
        return config('plans', []);
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
        $plan = self::all()[$slug] ?? null;

        if (!$plan) {
            throw new InvalidArgumentException("El plan [{$slug}] no existe.");
        }

        return $plan;
    }

    public static function trialDays(string $slug): ?int
    {
        return self::get($slug)['trial_days'] ?? null;
    }

    public static function limit(string $slug, string $key): ?int
    {
        return self::get($slug)['limits'][$key] ?? null;
    }

    public static function hasFeature(string $slug, string $feature): bool
    {
        return (bool) (self::get($slug)['features'][$feature] ?? false);
    }
}
