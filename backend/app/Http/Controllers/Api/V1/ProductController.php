<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductResource;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Inventory;
use App\Models\Product;
use App\Services\Inventory\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {
    }

    /**
     * Lista paginada de productos de la tienda.
     * Soporta búsqueda, filtros y stock disponible.
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $query = Product::with([
                'category:id,name',
                'brand:id,name',
                'variants'
            ])
            ->where('store_id', $storeId);


        /*
        |--------------------------------------------------------------------------
        | Búsqueda por nombre o SKU
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {

                $term = '%' . strtolower($search) . '%';

                $q->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(sku) LIKE ?', [$term]);

            });
        }


        /*
        |--------------------------------------------------------------------------
        | Filtro por estado
        |--------------------------------------------------------------------------
        */

        if ($request->has('is_active')) {

            $isActive = filter_var(
                $request->query('is_active'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Filtro por categoría
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category_id')) {

            $categoryId = filter_var(
                $request->query('category_id'),
                FILTER_VALIDATE_INT
            );

            if ($categoryId !== false && $categoryId > 0) {
                $query->where('category_id', $categoryId);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Paginación
        |--------------------------------------------------------------------------
        */

        $perPage = min(
            max((int) $request->query('per_page', 15), 1),
            100
        );


        $products = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);



        /*
        |--------------------------------------------------------------------------
        | Agregar stock disponible
        |--------------------------------------------------------------------------
        */

        foreach ($products as $product) {

            if (!$product->has_variants) {

                $product->available_stock =
                    $this->inventoryService->availableStock(
                        $storeId,
                        $product->id,
                        null
                    );

            } else {

                foreach ($product->variants as $variant) {

                    $variant->available_stock =
                        $this->inventoryService->availableStock(
                            $storeId,
                            $product->id,
                            $variant->id
                        );
                }
            }
        }


        return ProductResource::collection($products);
    }



    /**
     * Crea un producto nuevo.
     */
    public function store(StoreProductRequest $request)
    {
        $storeId = $this->currentStoreId($request);


        /*
        |--------------------------------------------------------------------------
        | Validar límite del plan
        |--------------------------------------------------------------------------
        */

        $this->abortIfPlanLimitReached(
            'max_products',
            Product::where('store_id', $storeId)->count()
        );


        $data = $request->validated();



        /*
        |--------------------------------------------------------------------------
        | Stock inicial
        |--------------------------------------------------------------------------
        */

        $initialStock = (int) ($data['stock'] ?? 0);

        unset($data['stock']);



        /*
        |--------------------------------------------------------------------------
        | Datos internos
        |--------------------------------------------------------------------------
        */

        $data['store_id'] = $storeId;
        $data['uuid'] = Str::uuid();
        $data['slug'] = Str::slug($data['name']);



        /*
        |--------------------------------------------------------------------------
        | Evitar slug duplicado
        |--------------------------------------------------------------------------
        */

        $baseSlug = $data['slug'];
        $count = 1;


        while (
            Product::where('store_id', $storeId)
                ->where('slug', $data['slug'])
                ->exists()
        ) {

            $data['slug'] = "{$baseSlug}-{$count}";
            $count++;
        }



        $product = Product::create($data);



        /*
        |--------------------------------------------------------------------------
        | Crear stock inicial
        |--------------------------------------------------------------------------
        */

        if (!$product->has_variants) {

            $warehouse =
                $this->inventoryService->defaultWarehouse($storeId);


            $this->inventoryService->setQuantity(
                $warehouse,
                $product->id,
                null,
                $initialStock,
                $request->user(),
                'Stock inicial'
            );


            $product->available_stock = $initialStock;
            $product->stock = $initialStock;
        }



        return response()->json($product, 201);
    }



    /**
     * Detalle de producto.
     */
    public function show(Request $request, int $id)
    {
        $storeId = $this->currentStoreId($request);


        $product = Product::with([
                'category:id,name',
                'brand:id,name',
                'variants'
            ])
            ->where('store_id', $storeId)
            ->findOrFail($id);



        if (!$product->has_variants) {

            $product->available_stock =
                $this->inventoryService->availableStock(
                    $storeId,
                    $product->id,
                    null
                );
            $product->stock = $product->available_stock;

        } else {

            foreach ($product->variants as $variant) {

                $variant->available_stock =
                    $this->inventoryService->availableStock(
                        $storeId,
                        $product->id,
                        $variant->id
                    );
            }
        }


        return response()->json($product);
    }



    /**
     * Actualiza producto existente.
     */
    public function update(
        UpdateProductRequest $request,
        int $id
    ) {

        $storeId = $this->currentStoreId($request);


        $product = Product::where('store_id', $storeId)
            ->findOrFail($id);



        $data = $request->validated();



        /*
        |--------------------------------------------------------------------------
        | Regenerar slug si cambia nombre
        |--------------------------------------------------------------------------
        */

        if (
            isset($data['name']) &&
            $data['name'] !== $product->name
        ) {


            $baseSlug = Str::slug($data['name']);

            $data['slug'] = $baseSlug;

            $count = 1;


            while (
                Product::where('store_id', $storeId)
                    ->where('slug', $data['slug'])
                    ->where('id', '!=', $product->id)
                    ->exists()
            ) {

                $data['slug'] =
                    "{$baseSlug}-{$count}";

                $count++;
            }
        }



        /*
        |--------------------------------------------------------------------------
        | Actualización de stock
        |--------------------------------------------------------------------------
        */

        $newStock = null;


        if (array_key_exists('stock', $data)) {

            $newStock = (int) $data['stock'];

            unset($data['stock']);
        }



        $product->update($data);



        if (
            $newStock !== null &&
            !$product->has_variants
        ) {


            $warehouse =
                $this->inventoryService
                    ->defaultWarehouse($storeId);



            $this->inventoryService->setQuantity(
                $warehouse,
                $product->id,
                null,
                $newStock,
                $request->user(),
                'Ajuste desde edición de producto'
            );
        }



        if (!$product->has_variants) {

            $product->available_stock =
                $this->inventoryService->availableStock(
                    $storeId,
                    $product->id,
                    null
                );
            $product->stock = $product->available_stock;
        }



        return response()->json($product);
    }




    /**
     * Eliminación lógica del producto.
     */
    public function destroy(
        Request $request,
        int $id
    ) {

        $product = Product::where(
                'store_id',
                $this->currentStoreId($request)
            )
            ->findOrFail($id);



        $product->delete();



        return response()->json([
            'message' => 'Producto eliminado correctamente.'
        ]);
    }
}
