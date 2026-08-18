<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Protege las rutas del panel de plataforma ("Todas las tiendas").
 *
 * A propósito NO depende de TenantResolver ni de Tenant::current():
 * estas rutas viven en el dominio central y deben poder listar datos
 * de CUALQUIER tienda, así que resolver un tenant primero sería
 * contradictorio con lo que hacen.
 *
 * Debe ir después de 'auth:sanctum' en la definición de rutas, porque
 * depende de $request->user() ya autenticado.
 */
class EnsureIsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasRole('super-admin')) {
            return response()->json([
                'message' => 'No tienes acceso al panel de plataforma.',
            ], 403);
        }

        return $next($request);
    }
}
