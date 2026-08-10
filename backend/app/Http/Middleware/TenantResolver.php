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
     * This allows the same middleware to work for both
     * the administration panel and the public storefront.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /*
         * -------------------------------------------------------------
         * Super Admin
         * -------------------------------------------------------------
         */
        $user = $request->user();

        if ($user && $user->hasRole('super-admin')) {
            return $next($request);
        }

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
         */
        if (!$subdomain) {
            $host = strtolower($request->getHost());

            /*
             * Local development:
             *
             * colmerzia.localhost
             * -> colmerzia
             */
            if (str_ends_with($host, '.localhost')) {
                $subdomain = substr(
                    $host,
                    0,
                    -strlen('.localhost')
                );
            }

            /*
             * Optional IP-based local development:
             *
             * colmerzia.127.0.0.1
             * -> colmerzia
             */
            elseif (str_ends_with($host, '.127.0.0.1')) {
                $subdomain = substr(
                    $host,
                    0,
                    -strlen('.127.0.0.1')
                );
            }
        }

        /*
         * -------------------------------------------------------------
         * No tenant could be resolved
         * -------------------------------------------------------------
         */
        if (!$subdomain) {
            return response()->json([
                'success' => false,
                'message' => 'No se ha especificado un espacio de trabajo válido.',
            ], 400);
        }

        /*
         * -------------------------------------------------------------
         * Find store
         * -------------------------------------------------------------
         */
        $store = Store::where('subdomain', $subdomain)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe.',
            ], 404);
        }

        /*
         * -------------------------------------------------------------
         * Validate store status
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
         * Register current tenant
         * -------------------------------------------------------------
         *
         * Tenant is the canonical tenant context used by:
         *
         * - Controllers
         * - Services
         * - Middleware
         * - Policies
         * - Models
         * - Global scopes
         */
        Tenant::set($store);

        /*
         * Also make the tenant available through Laravel's
         * service container.
         */
        app()->instance('tenant', $store);

        /*
         * Also expose it through the current request.
         */
        $request->attributes->set('tenant', $store);

        /*
         * Continue the middleware pipeline.
         */
        return $next($request);
    }
}