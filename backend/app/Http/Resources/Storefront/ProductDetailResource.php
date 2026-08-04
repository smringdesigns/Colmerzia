<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'has_variants' => $this->has_variants,
            'stock' => $this->has_variants ? null : $this->computed_stock,
            'in_stock' => $this->has_variants
                ? $this->variants->contains(fn ($v) => $v->is_active && $v->computed_stock > 0)
                : $this->computed_stock > 0,

            'images' => $this->images
                ->sortBy('sort_order')
                ->values()
                ->map(fn ($image) => [
                    'id' => $image->id,
                    'path' => $image->path,
                    'alt' => $image->alt,
                    'is_primary' => $image->is_primary,
                ]),

            'variants' => $this->when($this->has_variants, fn () => $this->variants
                ->where('is_active', true)
                ->values()
                ->map(fn ($variant) => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'sku' => $variant->sku,
                    'attributes' => $variant->attributes,
                    'price' => $variant->price ?? $this->price,
                    'compare_price' => $variant->compare_price ?? $this->compare_price,
                    'in_stock' => $variant->computed_stock > 0,
                ])),

            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,

            'brand' => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
            ] : null,
        ];
    }
}
