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
     *
     * Important:
     *
     * - Normal users must resolve a valid tenant.
     * - Super Admin can operate at platform level without a tenant.
     * - Super Admin can also explicitly select any tenant through
     *   X-Tenant.
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        /*
         * -------------------------------------------------------------
         * Current authenticated user
         * -------------------------------------------------------------
         */
        $user = $request->user();

        /*
         * -------------------------------------------------------------
         * 1. Try X-Tenant header
         * -------------------------------------------------------------
         *
         * Used mainly by the authenticated administration panel.
         *
         * Example:
         *
         * X-Tenant: colmerzia
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
         * This is primarily used by the public storefront.
         *
         * Example:
         *
         * colmerzia.localhost
         * -> colmerzia
         */
        if (!$subdomain) {
            $host = strtolower($request->getHost());

            /*
             * ---------------------------------------------------------
             * Local development:
             *
             * colmerzia.localhost
             * -> colmerzia
             * ---------------------------------------------------------
             */
            if (str_ends_with($host, '.localhost')) {
                $subdomain = substr(
                    $host,
                    0,
                    -strlen('.localhost')
                );
            }

            /*
             * ---------------------------------------------------------
             * Optional IP-based local development:
             *
             * colmerzia.127.0.0.1
             * -> colmerzia
             * ---------------------------------------------------------
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
         * 3. No tenant could be resolved
         * -------------------------------------------------------------
         *
         * A Super Admin is allowed to continue without a tenant.
         *
         * This is required for platform-level routes such as:
         *
         * GET /api/v1/admin/stores
         *
         * where the Super Admin needs to see/select stores before
         * selecting a tenant.
         *
         * Normal users are not allowed to continue without tenant.
         */
        if (!$subdomain) {
            if (
                $user &&
                $user->hasRole('super-admin')
            ) {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se ha especificado un espacio de trabajo válido.',
            ], 400);
        }

        /*
         * -------------------------------------------------------------
         * 4. Find store
         * -------------------------------------------------------------
         */
        $store = Store::query()
            ->where('subdomain', $subdomain)
            ->first();

        /*
         * -------------------------------------------------------------
         * Store does not exist
         * -------------------------------------------------------------
         */
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
         *
         * Even a Super Admin must resolve a real store when explicitly
         * selecting one through X-Tenant.
         *
         * Platform-level access without tenant is handled above.
         */
        if (!$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo se encuentra temporalmente inactivo.',
            ], 403);
        }

        /*
         * -------------------------------------------------------------
         * 6. Register current tenant
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
         * -------------------------------------------------------------
         * 7. Register tenant in Laravel's service container
         * -------------------------------------------------------------
         *
         * Some parts of the application access the tenant through:
         *
         * app('tenant')
         */
        app()->instance('tenant', $store);

        /*
         * -------------------------------------------------------------
         * 8. Expose tenant through current request
         * -------------------------------------------------------------
         */
        $request->attributes->set(
            'tenant',
            $store
        );

        /*
         * -------------------------------------------------------------
         * 9. Continue middleware pipeline
         * -------------------------------------------------------------
         */
        return $next($request);
    }
}