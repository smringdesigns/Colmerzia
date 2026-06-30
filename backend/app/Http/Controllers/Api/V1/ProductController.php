<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller
{
    /**
     * Lista paginada de productos de la tienda.
     * Soporta búsqueda por nombre o SKU y filtro por estado.
     */
    public function index(Request $request)
    {
        $storeId = $request->user()->store_id;

        $query = Product::with(['category:id,name', 'brand:id,name'])
            ->where('store_id', $storeId);

        // Búsqueda por nombre o SKU
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%");
            });
        }

        // Filtro por estado activo
        if ($request->has('is_active')) {
            $query->where(
                'is_active',
                filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN)
            );
        }

        // Filtro por categoría
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $products = $query
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json($products);
    }

    /**
     * Crea un producto nuevo en la tienda del usuario autenticado.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        $data['store_id'] = $request->user()->store_id;
        $data['uuid']     = Str::uuid();
        $data['slug']     = Str::slug($data['name']);

        // Si el slug ya existe en la tienda, le agrega un sufijo único
        $baseSlug = $data['slug'];
        $count    = 1;

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
        $product = Product::with(['category:id,name', 'brand:id,name'])
            ->where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        return response()->json($product);
    }

    /**
     * Actualiza un producto existente.
     */
    public function update(UpdateProductRequest $request, int $id)
    {
        $product = Product::where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        $data = $request->validated();

        // Regenera el slug solo si cambió el nombre
        if ($data['name'] !== $product->name) {
            $baseSlug     = Str::slug($data['name']);
            $data['slug'] = $baseSlug;
            $count        = 1;

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
    public function destroy(Request $request, int $id)
    {
        $product = Product::where('store_id', $request->user()->store_id)
            ->findOrFail($id);

        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente.'
        ]);
    }
}
