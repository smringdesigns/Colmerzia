<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Brand\StoreBrandRequest;
use App\Http\Requests\Brand\UpdateBrandRequest;
use App\Http\Resources\Brand\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $brands = Brand::withCount('products')
            ->where('store_id', $storeId)
            ->orderBy('name')
            ->get()
            ->map(fn ($brand) => (new BrandResource($brand))->resolve());

        return response()->json($brands);
    }

    public function store(StoreBrandRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $data = $request->validated();
        $data['store_id'] = $storeId;
        $data['uuid'] = Str::uuid();
        $data['slug'] = $this->uniqueSlug($storeId, $data['name']);
        $data['is_active'] = $data['is_active'] ?? true;

        $brand = Brand::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Marca creada correctamente.',
            'data' => (new BrandResource($brand))->resolve(),
        ], 201);
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $this->authorizeStoreOwnership($request, $brand);

        $data = $request->validated();

        if (isset($data['name']) && $data['name'] !== $brand->name) {
            $data['slug'] = $this->uniqueSlug($brand->store_id, $data['name'], $brand->id);
        }

        $brand->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Marca actualizada correctamente.',
            'data' => (new BrandResource($brand->fresh()))->resolve(),
        ]);
    }

    public function destroy(Request $request, Brand $brand)
    {
        $this->authorizeStoreOwnership($request, $brand);

        // Mismo criterio que categorías: no dejamos borrar una marca
        // que todavía tiene productos asignados.
        $productsCount = $brand->products()->count();

        if ($productsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "No se puede eliminar: tiene {$productsCount} producto(s) asignado(s). Reasigná esos productos primero.",
            ], 422);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Marca eliminada correctamente.',
        ]);
    }

    private function uniqueSlug(int $storeId, string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $count = 1;

        while (
            Brand::where('store_id', $storeId)
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    private function authorizeStoreOwnership(Request $request, Brand $brand): void
    {
        abort_unless(
            $brand->store_id === $this->currentStoreId($request),
            404
        );
    }
}
