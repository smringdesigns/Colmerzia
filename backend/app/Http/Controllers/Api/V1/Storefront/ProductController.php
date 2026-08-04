<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\ProductDetailResource;
use App\Http\Resources\Storefront\ProductListResource;
use App\Models\Inventory;
use App\Models\Product;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;

/**
 * Catálogo público de productos (storefront). Sin auth:sanctum: lo
 * consume cualquier visitante. Solo expone productos activos.
 */
class ProductController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {
    }

    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $query = Product::where('store_id', $storeId)
            ->where('is_active', true)
            ->with(['images', 'category', 'variants'])
            ->orderByDesc('featured')
            ->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%' . $request->query('search') . '%');
        }

        $perPage = min((int) $request->query('per_page', 20), 60);

        $products = $query->paginate($perPage);

        $this->attachStock($storeId, $products->getCollection());

        $products->through(fn ($product) => (new ProductListResource($product))->resolve());

        return response()->json($products);
    }

    public function show(Request $request, string $slug)
    {
        $storeId = $this->currentStoreId($request);

        $product = Product::where('store_id', $storeId)
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['images', 'category', 'brand', 'variants'])
            ->firstOrFail();

        $this->attachStock($storeId, collect([$product]));

        return response()->json((new ProductDetailResource($product))->resolve());
    }

    /**
     * Calcula el stock real (vía InventoryService, bodega por
     * defecto) para cada producto/variante de la colección y lo deja
     * en una propiedad dinámica `computed_stock`, que los Resources
     * usan en vez de la columna legacy `stock`. Se hace en lote (no
     * una consulta por producto) para no generar N+1 en el listado.
     */
    private function attachStock(int $storeId, $products): void
    {
        $warehouse = $this->inventoryService->defaultWarehouse($storeId);

        $simpleProductIds = $products->where('has_variants', false)->pluck('id');
        $variantIds = $products->flatMap(fn ($p) => $p->has_variants ? $p->variants->pluck('id') : collect());

        $productStock = Inventory::where('warehouse_id', $warehouse->id)
            ->whereNull('product_variant_id')
            ->whereIn('product_id', $simpleProductIds)
            ->get()
            ->keyBy('product_id');

        $variantStock = Inventory::where('warehouse_id', $warehouse->id)
            ->whereIn('product_variant_id', $variantIds)
            ->get()
            ->keyBy('product_variant_id');

        foreach ($products as $product) {
            if ($product->has_variants) {
                foreach ($product->variants as $variant) {
                    $variant->computed_stock = $variantStock->get($variant->id)?->available() ?? 0;
                }
                continue;
            }

            $product->computed_stock = $productStock->get($product->id)?->available() ?? 0;
        }
    }
}
