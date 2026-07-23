<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Debe ejecutarse DESPUÉS de ResolveTenantBySubdomain. Bloquea la
 * petición si la tienda resuelta está desactivada (por ejemplo,
 * suspendida por falta de pago o por el admin de Colmerzia).
 *
 * En rutas de dominio central (sin tienda, como el panel super-admin)
 * simplemente deja pasar, porque ahí no aplica el concepto de "tienda
 * activa".
 */
class EnsureStoreIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $store = Tenant::current();

        if (!$store) {
            return $next($request);
        }

        if (!$store->is_active) {
            return response()->json([
                'message' => 'Esta tienda está desactivada temporalmente.',
            ], 403);
        }

        return $next($request);
    }
}
