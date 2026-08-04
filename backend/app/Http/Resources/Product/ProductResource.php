<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform product response.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'store_id' => $this->store_id,

            'category_id' => $this->category_id,

            'brand_id' => $this->brand_id,


            'uuid' => $this->uuid,

            'name' => $this->name,

            'slug' => $this->slug,

            'sku' => $this->sku,


            'short_description' => $this->short_description,

            'description' => $this->description,


            'price' => $this->price,

            'compare_price' => $this->compare_price,

            'cost_price' => $this->cost_price,


            /*
            |--------------------------------------------------------------------------
            | Stock
            |--------------------------------------------------------------------------
            |
            | stock es legacy.
            | La fuente real es InventoryService.
            |
            */

            'stock' => $this->stock,

            'available_stock' => $this->when(
                isset($this->available_stock),
                (int) $this->available_stock
            ),


            'min_stock' => $this->min_stock,


            'weight' => $this->weight,

            'length' => $this->length,

            'width' => $this->width,

            'height' => $this->height,


            'featured' => $this->featured,

            'is_active' => $this->is_active,

            'has_variants' => $this->has_variants,


            'meta_title' => $this->meta_title,

            'meta_description' => $this->meta_description,


            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

            'deleted_at' => $this->deleted_at,


            /*
            |--------------------------------------------------------------------------
            | Relaciones
            |--------------------------------------------------------------------------
            */

            'category' => $this->whenLoaded('category'),

            'brand' => $this->whenLoaded('brand'),

            'variants' => ProductVariantResource::collection(
                $this->whenLoaded('variants')
            ),
        ];
    }
}