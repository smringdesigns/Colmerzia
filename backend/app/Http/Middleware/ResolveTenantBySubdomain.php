<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lee el Host de la petición (ej: "tienda-demo.colmerzia.test") y
 * resuelve a qué Store corresponde el subdominio ("tienda-demo").
 *
 * - Si el Host es un dominio central (config/tenancy.php), la petición
 *   sigue sin tienda asociada (ej: marketing, panel super-admin).
 * - Si el Host tiene un subdominio pero no existe ninguna tienda con
 *   ese subdominio, respondemos 404 antes de tocar nada más.
 * - Si existe, guardamos la tienda en Tenant::set() para que el resto
 *   de la petición (controladores, AuthService, otros middlewares)
 *   pueda usarla.
 */
class ResolveTenantBySubdomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        $centralDomains = config('tenancy.central_domains', []);

        // Dominio central: sin tienda, seguimos de largo.
        if (in_array($host, $centralDomains, true)) {
            return $next($request);
        }

        $subdomain = $this->extractSubdomain($host, $centralDomains);

        if (!$subdomain) {
            return response()->json([
                'message' => 'No se pudo determinar la tienda a partir del dominio.',
            ], 404);
        }

        $store = Store::where('subdomain', $subdomain)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Tienda no encontrada.',
            ], 404);
        }

        Tenant::set($store);
        $request->attributes->set('store', $store);

        return $next($request);
    }

    /**
     * Devuelve el subdominio (ej. "tienda-demo") si el host termina
     * en ".{dominio-central}". Si no coincide con ningún dominio
     * central conocido, devuelve null.
     */
    private function extractSubdomain(string $host, array $centralDomains): ?string
    {
        foreach ($centralDomains as $central) {
            $suffix = '.' . $central;

            if (str_ends_with($host, $suffix)) {
                return substr($host, 0, -strlen($suffix));
            }
        }

        return null;
    }
}
