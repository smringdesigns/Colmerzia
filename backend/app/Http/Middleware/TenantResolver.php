<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
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
     */
    public function handle(Request $request, Closure $next): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        |
        | El super admin pertenece al nivel plataforma.
        | No necesita seleccionar una tienda para entrar.
        |
        */
        $user = $request->user();

        if ($user && $user->hasRole('super-admin')) {
            return $next($request);
        }


        /*
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
            return response()->json([
                'success' => false,
                'message' => 'No se ha especificado un espacio de trabajo válido. Si el problema persiste, intenta iniciar sesión nuevamente.'
            ], 400);
        }

        $hostSubdomain = $this->extractSubdomain($host, $centralDomains);

        if (!$hostSubdomain) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo determinar la tienda a partir del dominio.'
            ], 404);
        }

        $store = Store::where('subdomain', $hostSubdomain)->first();

        if (!$store || !$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe o se encuentra temporalmente inactivo.'
            ], 404);
        }

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