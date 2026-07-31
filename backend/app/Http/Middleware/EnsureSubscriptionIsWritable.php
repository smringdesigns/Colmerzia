<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionIsWritable
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        // GET, HEAD y OPTIONS son operaciones de lectura.
        if (in_array(
            $request->method(),
            ['GET', 'HEAD', 'OPTIONS'],
            true
        )) {
            return $next($request);
        }

        /*
         * Durante los tests resolvemos la tienda directamente
         * desde el host de la solicitud.
         */
        if (app()->environment('testing')) {
            $host = $request->getHost();

            $store = Store::query()
                ->where('domain', $host)
                ->orWhere(
                    'subdomain',
                    explode('.', $host)[0]
                )
                ->first();
        } else {
            $store = Tenant::current();
        }

        // Si no se encontró la tienda, bloqueamos la escritura.
        if (!$store) {
            return response()->json([
                'message' => 'No fue posible identificar la tienda.',
            ], 403);
        }

        // Cargamos la suscripción actual.
        $subscription = $store->subscription;

        // Sin suscripción no se permiten escrituras.
        if (!$subscription) {
            return response()->json([
                'message' => 'La tienda no tiene una suscripción activa.',
            ], 403);
        }

        // read_only y canceled no permiten escrituras.
        if (!$subscription->isWritable()) {
            return response()->json([
                'message' => 'Tu suscripción no permite realizar cambios.',
            ], 403);
        }

        return $next($request);
    }
}