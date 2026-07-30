<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Uso en rutas: ->middleware('feature:coupons')
 *
 * Bloquea el acceso si el plan actual de la tienda no incluye esa
 * función (ver config/plans.php). Independiente del sistema de
 * permisos (can:...): acá la pregunta es "¿el PLAN de la tienda
 * incluye esto?", no "¿este usuario en particular puede?".
 */
class EnsureFeatureAvailable
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $subscription = Tenant::subscription();

        if ($subscription && $subscription->hasFeature($feature)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Tu plan actual no incluye esta función. Actualiza tu plan para acceder a ella.',
        ], 403);
    }
}
