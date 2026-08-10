<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
     * Resolve the current tenant/store.
     *
     * Supported sources:
     *
     * 1. X-Tenant header
     *    Used by the authenticated dashboard/API.
     *
     * 2. Subdomain
     *    Example:
     *    colmerzia.localhost
     *    -> colmerzia
     *
     * If no tenant is provided, the request can continue
     * without a tenant. This is required for platform-level
     * routes used by the Super Admin.
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        /*
         * -------------------------------------------------------------
         * 1. Try X-Tenant header
         * -------------------------------------------------------------
         */
        $subdomain = $request->header('X-Tenant');

        if (is_string($subdomain)) {
            $subdomain = strtolower(trim($subdomain));
        }

        /*
         * -------------------------------------------------------------
         * 2. Resolve from hostname if X-Tenant is not present
         * -------------------------------------------------------------
         *
         * Example:
         *
         * colmerzia.localhost
         * -> colmerzia
         */
        if (!$subdomain) {
            $host = strtolower($request->getHost());

            if (str_ends_with($host, '.localhost')) {
                $subdomain = substr(
                    $host,
                    0,
                    -strlen('.localhost')
                );
            } elseif (str_ends_with($host, '.127.0.0.1')) {
                $subdomain = substr(
                    $host,
                    0,
                    -strlen('.127.0.0.1')
                );
            }
        }

        /*
         * -------------------------------------------------------------
         * 3. No tenant
         * -------------------------------------------------------------
         *
         * This is allowed for platform-level routes.
         *
         * Example:
         * Super Admin global panel.
         */
        if (!$subdomain) {
            return $next($request);
        }

        /*
         * -------------------------------------------------------------
         * 4. Find store
         * -------------------------------------------------------------
         */
        $store = Store::query()
            ->where('subdomain', $subdomain)
            ->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe.',
            ], 404);
        }

        /*
         * -------------------------------------------------------------
         * 5. Validate store status
         * -------------------------------------------------------------
         */
        if (!$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo se encuentra temporalmente inactivo.',
            ], 404);
        }

        /*
         * -------------------------------------------------------------
         * 6. Register current tenant
         * -------------------------------------------------------------
         */
        Tenant::set($store);

        /*
         * Also expose the tenant through Laravel's service container.
         */
        app()->instance('tenant', $store);

        /*
         * Also expose it through the current request.
         */
        $request->attributes->set('tenant', $store);

        /*
         * -------------------------------------------------------------
         * 7. Continue middleware pipeline
         * -------------------------------------------------------------
         */
        return $next($request);
    }
}