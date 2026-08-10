<?php

namespace App\Http\Controllers;

use App\Support\Tenancy\Tenant;
use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * ID de la tienda a la que debe restringirse la consulta actual.
     *
     * Cruza dos fuentes de verdad:
     *
     *  - el tenant de la petición (Tenant::id(), puesto por
     *    TenantResolver)
     *  - la tienda del usuario autenticado (Sanctum token)
     *
     * Usuarios normales:
     *
     * Si ambas existen y no coinciden, alguien está usando un token
     * válido de la Tienda A contra el tenant de la Tienda B.
     * Se corta con un 403.
     *
     * Super Admin:
     *
     * Puede seleccionar cualquier tienda mediante X-Tenant.
     * En ese caso el tenant explícito tiene prioridad sobre
     * user.store_id.
     *
     * Si un Super Admin está operando a nivel plataforma y no existe
     * tenant, esta función no debe utilizarse para consultas que
     * necesiten una tienda.
     */
    protected function currentStoreId(Request $request): int
    {
        $tenantId = Tenant::id();

        $user = $request->user();

        $userStoreId = $user?->store_id;

        /*
         * -------------------------------------------------------------
         * Super Admin
         * -------------------------------------------------------------
         *
         * El Super Admin puede seleccionar cualquier tienda mediante
         * X-Tenant.
         *
         * Ejemplo:
         *
         * X-Tenant: tienda-b
         *
         * Aunque el usuario tenga:
         *
         * store_id = 1
         *
         * si Tenant::id() corresponde a la tienda 2, trabajará sobre
         * la tienda 2.
         */
        if (
            $user &&
            $user->hasRole('super-admin') &&
            $tenantId
        ) {
            return $tenantId;
        }

        /*
         * -------------------------------------------------------------
         * Usuarios normales
         * -------------------------------------------------------------
         *
         * El tenant de la petición debe coincidir con la tienda
         * asociada al usuario autenticado.
         */
        if (
            $tenantId &&
            $userStoreId &&
            $tenantId !== $userStoreId
        ) {
            abort(
                403,
                'No tienes acceso a esta tienda.'
            );
        }

        /*
         * -------------------------------------------------------------
         * Resolver tienda
         * -------------------------------------------------------------
         *
         * Prioridad:
         *
         * 1. Tenant explícito/resuelto.
         * 2. Tienda asociada al usuario.
         */
        $storeId = $tenantId ?? $userStoreId;

        /*
         * -------------------------------------------------------------
         * No existe tienda
         * -------------------------------------------------------------
         */
        if (!$storeId) {
            abort(
                404,
                'No se pudo determinar la tienda.'
            );
        }

        return (int) $storeId;
    }

    /**
     * Corta con 403 si crear un registro más superaría el límite
     * del plan actual para $limitKey.
     *
     * $currentCount es el conteo de registros existentes ANTES
     * de crear el nuevo.
     *
     * Si no hay suscripción resuelta, no bloquea.
     *
     * Esto mantiene el mismo criterio que el resto de los middlewares
     * de plan: preferir no bloquear ante un dato faltante y no castigar
     * al usuario por un problema interno.
     */
    protected function abortIfPlanLimitReached(
        string $limitKey,
        int $currentCount
    ): void {
        $subscription = Tenant::subscription();

        if (
            $subscription &&
            $subscription->hasReachedLimit(
                $limitKey,
                $currentCount
            )
        ) {
            abort(
                403,
                'Alcanzaste el límite de tu plan actual. ' .
                'Actualiza tu plan para agregar más.'
            );
        }
    }
}