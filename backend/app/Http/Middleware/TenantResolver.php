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
                'message' => 'No se ha especificado un espacio de trabajo válido. Si el problema persiste, intenta iniciar sesión nuevamente.'
            ], 400);
        }

        // 2. Buscar la tienda en la base de datos
        $store = Store::where('subdomain', $subdomain)->first();

        // 3. Validar que exista y esté activa
        if (!$store || !$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe o se encuentra temporalmente inactivo.'
            ], 404);
        }

        // 4. Inyectar la tienda globalmente para que cualquier parte de Laravel sepa en qué tienda estamos
        app()->instance('tenant', $store);

        return $next($request);
    }
}