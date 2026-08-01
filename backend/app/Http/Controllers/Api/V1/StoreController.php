<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreController extends Controller
{
    /**
     * POST /api/v1/stores (Onboarding - Crear Empresa)
     */
    public function store(Request $request)
    {
        // Validar los datos que envía React
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'subdomain' => 'required|string|max:50|unique:stores,subdomain|regex:/^[a-zA-Z0-9\-]+$/'
        ]);

        try {
            DB::beginTransaction();

            // 1. Crear la empresa
            $store = Store::create([
                'name' => $validated['name'],
                'subdomain' => strtolower($validated['subdomain']),
            ]);

            // 2. Crear la configuración por defecto de la empresa
            $store->settings()->create([
                'currency' => 'USD',
                'timezone' => 'UTC',
            ]);

            // 3. Vincular el usuario creador a la tienda (Asegúrate de que la tabla users tenga la columna store_id)
            $user = $request->user();
            $user->store_id = $store->id;
            $user->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empresa creada exitosamente.',
                'data' => $store->load('settings')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al crear la empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/v1/stores/me (Obtener datos de la tienda actual)
     */
    public function me()
    {
        // Traemos la tienda que fue resuelta e inyectada por el TenantResolver
        $store = app('tenant');

        return response()->json([
            'success' => true,
            'data' => $store->load('settings')
        ]);
    }
}