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
     *  - el subdominio de la petición (Tenant::id(), puesto por
     *    ResolveTenantBySubdomain)
     *  - la tienda del usuario autenticado (Sanctum token)
     *
     * Si ambas existen y no coinciden, alguien está usando un token
     * válido de la Tienda A contra el subdominio de la Tienda B: se
     * corta ahí con un 403 en vez de dejar pasar la petición.
     */
    protected function currentStoreId(Request $request): int
    {
        $tenantId = Tenant::id();
        $userStoreId = $request->user()?->store_id;

        if ($tenantId && $userStoreId && $tenantId !== $userStoreId) {
            abort(403, 'No tienes acceso a esta tienda.');
        }

        $storeId = $tenantId ?? $userStoreId;

        if (!$storeId) {
            abort(404, 'No se pudo determinar la tienda.');
        }

        return $storeId;
    }
}
