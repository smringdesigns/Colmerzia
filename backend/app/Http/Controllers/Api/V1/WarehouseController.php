<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warehouse\WarehouseRequest;
use App\Models\Warehouse;
use App\Services\Inventory\InventoryService;
use App\Support\Tenancy\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WarehouseController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {
    }

    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        // Asegura que exista al menos la bodega por defecto (stores
        // creadas antes de este sistema).
        $this->inventoryService->defaultWarehouse($storeId);

        $warehouses = Warehouse::where('store_id', $storeId)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get();

        return response()->json($warehouses);
    }

    public function store(WarehouseRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $currentCount = Warehouse::where('store_id', $storeId)->count();

        $this->abortIfPlanLimitReached('max_warehouses', $currentCount);

        // La primera bodega (la por defecto) siempre se puede crear,
        // sin importar el plan -- toda tienda necesita al menos un
        // lugar donde guardar stock. Multi-bodega de verdad (una
        // SEGUNDA en adelante) sí requiere el feature del plan.
        if ($currentCount >= 1) {
            $subscription = Tenant::subscription();

            if ($subscription && !$subscription->hasFeature('multi_warehouse')) {
                abort(403, 'Tu plan actual no incluye múltiples bodegas. Actualiza tu plan para agregar más.');
            }
        }

        $data = $request->validated();
        $data['store_id'] = $storeId;
        $data['uuid'] = Str::uuid();
        $data['is_default'] = $currentCount === 0; // la primera es la por defecto

        $warehouse = Warehouse::create($data);

        return response()->json($warehouse, 201);
    }

    public function show(Request $request, int $id)
    {
        $warehouse = Warehouse::where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        return response()->json($warehouse);
    }

    public function update(WarehouseRequest $request, int $id)
    {
        $warehouse = Warehouse::where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        $warehouse->update($request->validated());

        return response()->json($warehouse);
    }

    /**
     * Marca esta bodega como la bodega por defecto de la tienda (la
     * única que usan Cart/Checkout para vender). Desmarca cualquier
     * otra que lo fuera antes.
     */
    public function makeDefault(Request $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $warehouse = Warehouse::where('store_id', $storeId)->findOrFail($id);

        if (!$warehouse->is_active) {
            abort(422, 'No se puede poner como bodega por defecto una bodega inactiva.');
        }

        DB::transaction(function () use ($storeId, $warehouse) {
            Warehouse::where('store_id', $storeId)->update(['is_default' => false]);
            $warehouse->update(['is_default' => true]);
        });

        return response()->json($warehouse->fresh());
    }

    public function destroy(Request $request, int $id)
    {
        $warehouse = Warehouse::where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        if ($warehouse->is_default) {
            abort(422, 'No se puede eliminar la bodega por defecto. Marca otra como bodega por defecto primero.');
        }

        $warehouse->delete();

        return response()->json(['message' => 'Bodega eliminada correctamente.']);
    }
}
