<?php
 
namespace App\Http\Controllers\Api\V1;
 
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
 
class ProductController extends Controller
{
    /**
     * Lista paginada de productos de la tienda.
     * Soporta búsqueda por nombre o SKU y filtros.
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);
 
        $query = Product::with([
                'category:id,name',
                'brand:id,name'
            ])
            ->where('store_id', $storeId);
 
        /*
        |--------------------------------------------------------------------------
        | Búsqueda
        |--------------------------------------------------------------------------
        */
 
        if ($request->filled('search')) {
 
            $search = $request->query('search');
 
            $query->where(function ($q) use ($search) {
 
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%");
 
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
 
        return response()->json($products);
    }
 
    /**
     * Crea un producto nuevo en la tienda del usuario autenticado.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
 
        $data['store_id'] = $this->currentStoreId($request);
        $data['uuid'] = Str::uuid();
        $data['slug'] = Str::slug($data['name']);
 
        $baseSlug = $data['slug'];
        $count = 1;
 
        while (
            Product::where('store_id', $data['store_id'])
                ->where('slug', $data['slug'])
                ->exists()
        ) {
            $data['slug'] = "{$baseSlug}-{$count}";
            $count++;
        }
 
        $product = Product::create($data);
 
        return response()->json($product, 201);
    }
 
    /**
     * Detalle de un producto por ID.
     */
    public function show(Request $request, int $id)
    {
        $product = Product::with([
                'category:id,name',
                'brand:id,name'
            ])
            ->where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);
 
        return response()->json($product);
    }
 
    /**
     * Actualiza un producto existente.
     */
    public function update(
        UpdateProductRequest $request,
        int $id
    ) {
        $product = Product::where(
                'store_id',
                $this->currentStoreId($request)
            )
            ->findOrFail($id);
 
        $data = $request->validated();
 
        if (
            isset($data['name']) &&
            $data['name'] !== $product->name
        ) {
            $baseSlug = Str::slug($data['name']);
            $data['slug'] = $baseSlug;
            $count = 1;
 
            while (
                Product::where('store_id', $product->store_id)
                    ->where('slug', $data['slug'])
                    ->where('id', '!=', $product->id)
                    ->exists()
            ) {
                $data['slug'] = "{$baseSlug}-{$count}";
                $count++;
            }
        }
 
        $product->update($data);
 
        return response()->json($product);
    }
 
    /**
     * Elimina (soft delete) un producto.
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