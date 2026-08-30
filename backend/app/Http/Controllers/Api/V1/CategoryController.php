<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Lista todas las categorías de la tienda (sin paginar -- una
     * tienda normalmente tiene unas pocas decenas de categorías
     * como mucho, no miles como los productos).
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $categories = Category::with('parent:id,name')
            ->withCount('products')
            ->where('store_id', $storeId)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => (new CategoryResource($category))->resolve());

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $data = $request->validated();
        $data['store_id'] = $storeId;
        $data['uuid'] = Str::uuid();
        $data['slug'] = $this->uniqueSlug($storeId, $data['name']);
        $data['is_active'] = $data['is_active'] ?? true;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada correctamente.',
            'data' => (new CategoryResource($category))->resolve(),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorizeStoreOwnership($request, $category);

        $data = $request->validated();

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = $this->uniqueSlug(
                $category->store_id,
                $data['name'],
                $category->id
            );
        }

        $category->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada correctamente.',
            'data' => (new CategoryResource($category->fresh()))->resolve(),
        ]);
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorizeStoreOwnership($request, $category);

        // No dejamos borrar una categoría con productos adentro --
        // esos productos se quedarían "huérfanos" (category_id
        // apuntando a un registro borrado) o, peor, con SoftDeletes
        // el borrado ni siquiera falla visiblemente y el problema
        // aparece después, en el storefront, mostrando productos sin
        // categoría de la nada.
        $productsCount = $category->products()->count();

        if ($productsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "No se puede eliminar: tiene {$productsCount} producto(s) asignado(s). Reasigná esos productos a otra categoría primero.",
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada correctamente.',
        ]);
    }

    /**
     * Genera un slug único dentro de la tienda, con sufijo
     * incremental si hay choque -- mismo patrón que ProductController.
     */
    private function uniqueSlug(int $storeId, string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $count = 1;

        while (
            Category::where('store_id', $storeId)
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    /**
     * Blindaje extra: aunque BelongsToStoreScope ya filtra las
     * queries de Category por tienda, el route model binding
     * resuelve por ID global sin ese filtro -- sin esto, un usuario
     * de la tienda A podría editar/borrar una categoría con el ID de
     * la tienda B con solo cambiar el número en la URL.
     */
    private function authorizeStoreOwnership(Request $request, Category $category): void
    {
        abort_unless(
            $category->store_id === $this->currentStoreId($request),
            404
        );
    }
}
