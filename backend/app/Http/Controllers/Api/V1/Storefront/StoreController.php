<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Support\BusinessTypes\BusinessTypeRegistry;
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
     *
     * También expone `storefront_layout`: qué variante de home debe
     * renderizar el storefront según el tipo de negocio de la tienda
     * (ver config/business_types.php). Así el mismo storefront React
     * puede mostrar un layout de catálogo, de menú, o de servicios,
     * sin tener que hardcodear la decisión.
     */
    public function show(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $store = \App\Models\Store::with('settings')->findOrFail($storeId);

        $storefrontLayout = $store->business_type
            && BusinessTypeRegistry::exists($store->business_type)
                ? BusinessTypeRegistry::storefrontLayout(
                    $store->business_type
                )
                : 'catalog';

        return response()->json([
            'success' => true,
            'data' => [
                'name' => $store->name,
                'subdomain' => $store->subdomain,
                'business_type' => $store->business_type,
                'storefront_layout' => $storefrontLayout,

                'logo_path' => $store->settings?->logo_path,

                'contact_email' => $store->settings?->contact_email,
                'contact_phone' => $store->settings?->contact_phone,

                'currency' => $store->settings?->currency ?? 'COP',

                /*
                 * Redes sociales públicas de la tienda.
                 *
                 * Cada tienda puede tener sus propias redes.
                 * Si no existen, se devuelve un array vacío.
                 */
                'social_links' => $store->settings?->social_links ?? [],
            ],
        ]);
    }
}