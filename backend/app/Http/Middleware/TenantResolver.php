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
     * Resuelve la tienda/tenant actual.
     *
     * El tenant puede resolverse desde:
     *
     * 1. Header X-Tenant
     *    Utilizado principalmente por el panel administrativo.
     *
     * 2. Subdominio de la tienda
     *
     *    Desarrollo:
     *      colmerzia.localhost
     *      -> colmerzia
     *
     *    Producción:
     *      colmerzia.colmerzia.com
     *      -> colmerzia
     *
     * Los dominios centrales se configuran en:
     *
     * config/tenancy.php
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        /*
         * -------------------------------------------------------------
         * Usuario autenticado actual
         * -------------------------------------------------------------
         */
        $user = $request->user();

        /*
         * -------------------------------------------------------------
         * 1. Intentar resolver mediante X-Tenant
         * -------------------------------------------------------------
         *
         * Utilizado principalmente por el panel administrativo.
         *
         * Ejemplo:
         *
         * X-Tenant: colmerzia
         */
        $subdominio = $request->header('X-Tenant');

        if (is_string($subdominio)) {
            $subdominio = strtolower(trim($subdominio));
        }

        /*
         * -------------------------------------------------------------
         * 2. Resolver tenant mediante el dominio
         * -------------------------------------------------------------
         *
         * Ejemplos:
         *
         * Desarrollo:
         *
         *   colmerzia.localhost
         *   -> colmerzia
         *
         *   lecmarc.localhost
         *   -> lecmarc
         *
         * Producción:
         *
         *   colmerzia.colmerzia.com
         *   -> colmerzia
         *
         *   lecmarc.colmerzia.com
         *   -> lecmarc
         *
         * Los dominios centrales se obtienen de:
         *
         * config('tenancy.central_domains')
         */
        if (!$subdominio) {
            $host = strtolower($request->getHost());

            $dominiosCentrales = config(
                'tenancy.central_domains',
                []
            );

            foreach ($dominiosCentrales as $dominioCentral) {
                $dominioCentral = strtolower(
                    trim($dominioCentral)
                );

                if (!$dominioCentral) {
                    continue;
                }

                /*
                 * -----------------------------------------------------
                 * El dominio central por sí mismo
                 * -----------------------------------------------------
                 *
                 * Ejemplos:
                 *
                 * localhost
                 * colmerzia.com
                 *
                 * Estos dominios no representan una tienda.
                 */
                if ($host === $dominioCentral) {
                    break;
                }

                /*
                 * -----------------------------------------------------
                 * Resolver subdominio de una tienda
                 * -----------------------------------------------------
                 *
                 * Ejemplo:
                 *
                 * colmerzia.localhost
                 *
                 * Se convierte en:
                 *
                 * colmerzia
                 *
                 * Ejemplo en producción:
                 *
                 * lecmarc.colmerzia.com
                 *
                 * Se convierte en:
                 *
                 * lecmarc
                 */
                $sufijo = '.' . $dominioCentral;

                if (str_ends_with($host, $sufijo)) {
                    $candidato = substr(
                        $host,
                        0,
                        -strlen($sufijo)
                    );

                    /*
                     * Solo permitimos un nivel de subdominio.
                     *
                     * Esto evita aceptar:
                     *
                     * colmerzia.otra.localhost
                     *
                     * como un tenant válido.
                     */
                    if (
                        $candidato !== '' &&
                        !str_contains($candidato, '.')
                    ) {
                        $subdominio = $candidato;
                    }

                    break;
                }
            }
        }

        /*
         * -------------------------------------------------------------
         * 3. No se pudo resolver ningún tenant
         * -------------------------------------------------------------
         *
         * El Super Admin puede trabajar a nivel de plataforma
         * sin seleccionar una tienda.
         *
         * Los usuarios normales necesitan un tenant.
         */
        if (!$subdominio) {
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
         * 4. Buscar la tienda
         * -------------------------------------------------------------
         */
        $store = Store::query()
            ->where('subdomain', $subdominio)
            ->first();

        /*
         * -------------------------------------------------------------
         * 5. La tienda no existe
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
         * 6. Validar estado de la tienda
         * -------------------------------------------------------------
         */
        if (!$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo se encuentra temporalmente inactivo.',
            ], 403);
        }

        /*
         * -------------------------------------------------------------
         * 7. Registrar el tenant actual
         * -------------------------------------------------------------
         */
        Tenant::set($store);

        /*
         * -------------------------------------------------------------
         * 8. Registrar el tenant en el contenedor de Laravel
         * -------------------------------------------------------------
         *
         * Permite acceder mediante:
         *
         * app('tenant')
         */
        app()->instance('tenant', $store);

        /*
         * -------------------------------------------------------------
         * 9. Exponer el tenant en la petición actual
         * -------------------------------------------------------------
         */
        $request->attributes->set(
            'tenant',
            $store
        );

        /*
         * -------------------------------------------------------------
         * 10. Continuar con la ejecución de la petición
         * -------------------------------------------------------------
         */
        return $next($request);
    }
}