<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Leer el subdominio desde el Header que enviará React
        $subdomain = $request->header('X-Tenant');

        if (!$subdomain) {
            return response()->json([
                'success' => false,
                'message' => 'Falta el identificador de la tienda (Header X-Tenant).'
            ], 400);
        }

        // 2. Buscar la tienda en la base de datos
        $store = Store::where('subdomain', $subdomain)->first();

        // 3. Validar que exista y esté activa
        if (!$store || !$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'La tienda no existe o se encuentra inactiva.'
            ], 404);
        }

        // 4. Inyectar la tienda globalmente para que cualquier parte de Laravel sepa en qué tienda estamos
        app()->instance('tenant', $store);

        return $next($request);
    }
}