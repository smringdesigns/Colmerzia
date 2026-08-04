<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\AdjustInventoryRequest;
use App\Models\Inventory;
use App\Models\Warehouse;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {
    }

    /**
     * Lista el inventario de una bodega (o de la bodega por defecto
     * si no se indica ?warehouse_id=). Incluye nombre/SKU de producto
     * y variante para no obligar al frontend a cruzarlo aparte.
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $warehouse = $request->filled('warehouse_id')
            ? Warehouse::where('store_id', $storeId)->findOrFail($request->query('warehouse_id'))
            : $this->inventoryService->defaultWarehouse($storeId);

        $query = Inventory::where('warehouse_id', $warehouse->id)
            ->with(['product:id,name,sku', 'productVariant:id,name,sku']);

        if ($request->filled('search')) {
            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->whereHas('product', fn ($p) => $p->where('name', 'ilike', "%{$search}%")
                    ->orWhere('sku', 'ilike', "%{$search}%"))
                  ->orWhereHas('productVariant', fn ($v) => $v->where('sku', 'ilike', "%{$search}%"));
            });
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('quantity', '<=', 'minimum');
        }

        $perPage = min((int) $request->query('per_page', 20), 100);

        $inventory = $query->orderBy('quantity')->paginate($perPage);

        $inventory->through(function (Inventory $row) {
            return [
                'id' => $row->id,
                'warehouse_id' => $row->warehouse_id,
                'product_id' => $row->product_id,
                'product_variant_id' => $row->product_variant_id,
                'product_name' => $row->product?->name,
                'product_sku' => $row->productVariant?->sku ?? $row->product?->sku,
                'variant_name' => $row->productVariant?->name,
                'quantity' => $row->quantity,
                'reserved' => $row->reserved,
                'available' => $row->available(),
                'minimum' => $row->minimum,
                'is_low_stock' => $row->quantity <= $row->minimum,
                'last_movement_at' => $row->last_movement_at,
            ];
        });

        return response()->json([
            'warehouse' => $warehouse->only(['id', 'name', 'code', 'is_default']),
            'data' => $inventory->items(),
            'current_page' => $inventory->currentPage(),
            'last_page' => $inventory->lastPage(),
            'per_page' => $inventory->perPage(),
            'total' => $inventory->total(),
        ]);
    }

    public function adjust(AdjustInventoryRequest $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $inventory = Inventory::whereHas(
            'warehouse',
            fn ($q) => $q->where('store_id', $storeId)
        )->findOrFail($id);

        $updated = $this->inventoryService->setQuantity(
            $inventory->warehouse,
            $inventory->product_id,
            $inventory->product_variant_id,
            $request->integer('quantity'),
            $request->user(),
            $request->input('reason')
        );

        return response()->json([
            'id' => $updated->id,
            'quantity' => $updated->quantity,
            'reserved' => $updated->reserved,
            'available' => $updated->available(),
        ]);
    }

    public function movements(Request $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $inventory = Inventory::whereHas(
            'warehouse',
            fn ($q) => $q->where('store_id', $storeId)
        )->findOrFail($id);

        $movements = $inventory->movements()
            ->with('user:id,name')
            ->orderByDesc('performed_at')
            ->limit(50)
            ->get()
            ->map(fn ($movement) => [
                'id' => $movement->id,
                'type' => $movement->type,
                'quantity' => $movement->quantity,
                'stock_before' => $movement->stock_before,
                'stock_after' => $movement->stock_after,
                'reason' => $movement->reason,
                'reference' => $movement->reference,
                'user' => $movement->user?->name,
                'performed_at' => $movement->performed_at,
            ]);

        return response()->json($movements);
    }
}
