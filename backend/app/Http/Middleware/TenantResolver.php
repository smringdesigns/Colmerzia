<?php

namespace App\Http\Middleware;

use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
<<<<<<< HEAD
=======
use App\Models\Store;
use App\Support\Tenancy\Tenant;
>>>>>>> 1d3ee6edc0ea943b83bf54de12a274e682f5256f
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
<<<<<<< HEAD
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
=======
     * Handle an incoming request.
     *
     * Resuelve la tienda actual por dos vías posibles, y deja el
     * resultado sincronizado en AMBOS mecanismos que el resto del
     * código consulta indistintamente:
     *
     * - app('tenant')   -> usado por StoreController (Settings)
     * - Tenant::current() -> usado por EnsureStoreIsActive,
     *   EnsureFeatureAvailable, AuthService, Controller::currentStoreId(),
     *   etc.
     *
     * Vías de resolución, en orden:
     *
     * 1. Header X-Tenant (panel admin: un solo origen, subdominio
     *    guardado en localStorage tras el login y reenviado en cada
     *    petición).
     * 2. Subdominio real del Host (storefront público: el comprador
     *    entra directo a tienda-x.dominio.com, sin sesión donde
     *    guardar nada).
>>>>>>> 1d3ee6edc0ea943b83bf54de12a274e682f5256f
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
<<<<<<< HEAD
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
=======
        |--------------------------------------------------------------------------
        | 1. Header X-Tenant (panel admin)
        |--------------------------------------------------------------------------
        */
        $subdomain = $request->header('X-Tenant');

        if ($subdomain) {

            $store = Store::where('subdomain', $subdomain)->first();

            if (!$store || !$store->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'El espacio de trabajo al que intentas acceder no existe o se encuentra temporalmente inactivo.'
                ], 404);
            }

            return $this->bindTenant($request, $next, $store);
        }


        /*
        |--------------------------------------------------------------------------
        | 2. Subdominio real del Host (storefront público)
        |--------------------------------------------------------------------------
        */
        $host = $request->getHost();

        $centralDomains = config('tenancy.central_domains', []);

        if (in_array($host, $centralDomains, true)) {
            // Dominio central (localhost, panel admin) sin X-Tenant:
            // no hay forma de saber a qué tienda pertenece esta
            // petición.
>>>>>>> 1d3ee6edc0ea943b83bf54de12a274e682f5256f
            return response()->json([
                'success' => false,
                'message' => 'No se ha especificado un espacio de trabajo válido.',
            ], 400);
        }

<<<<<<< HEAD
        /*
         * -------------------------------------------------------------
         * Find store
         * -------------------------------------------------------------
         */
        $store = Store::where('subdomain', $subdomain)->first();

        if (!$store) {
=======
        $hostSubdomain = $this->extractSubdomain($host, $centralDomains);

        if (!$hostSubdomain) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo determinar la tienda a partir del dominio.'
            ], 404);
        }

        $store = Store::where('subdomain', $hostSubdomain)->first();

        if (!$store || !$store->is_active) {
>>>>>>> 1d3ee6edc0ea943b83bf54de12a274e682f5256f
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe.',
            ], 404);
        }

<<<<<<< HEAD
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
=======
        return $this->bindTenant($request, $next, $store);
    }

    /**
     * Deja la tienda resuelta disponible para el resto de la
     * petición, por las dos vías que el código consulta.
     */
    private function bindTenant(Request $request, Closure $next, Store $store): Response
    {
        app()->instance('tenant', $store);

        Tenant::set($store);

        $request->attributes->set('store', $store);
>>>>>>> 1d3ee6edc0ea943b83bf54de12a274e682f5256f

        /*
         * Continue the middleware pipeline.
         */
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