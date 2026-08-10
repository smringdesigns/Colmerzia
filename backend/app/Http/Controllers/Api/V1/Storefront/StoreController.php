<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * GET /api/v1/storefront/store
     *
     * Datos públicos de la tienda para el Header/Footer del
     * storefront: nombre, logo y contacto. A propósito NO expone
     * nada interno (suscripción, moneda de facturación, ids de
     * usuarios, etc.) — esta ruta la ve cualquier visitante anónimo.
     */
    public function show(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $store = \App\Models\Store::with('settings')->findOrFail($storeId);

        return response()->json([
            'success' => true,
            'data' => [
                'name' => $store->name,
                'subdomain' => $store->subdomain,
                'logo_path' => $store->settings?->logo_path,
                'contact_email' => $store->settings?->contact_email,
                'contact_phone' => $store->settings?->contact_phone,
                'currency' => $store->settings?->currency ?? 'COP',
            ],
        ]);
    }
}
