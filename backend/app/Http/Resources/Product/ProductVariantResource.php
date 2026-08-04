<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'product_id' => $this->product_id,

            'uuid' => $this->uuid,

            'sku' => $this->sku,

            'name' => $this->name,

            'attributes' => $this->attributes,

            'price' => $this->price,

            'compare_price' => $this->compare_price,

            'cost_price' => $this->cost_price,


            /*
             * Legacy
             */
            'stock' => $this->stock,


            /*
             * Stock disponible real
             */
            'available_stock' => $this->calculateAvailableStock(),


            'min_stock' => $this->min_stock,

            'weight' => $this->weight,

            'is_active' => $this->is_active,


            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

            'deleted_at' => $this->deleted_at,
        ];
    }


    private function calculateAvailableStock(): int
    {
        if ($this->relationLoaded('inventories')) {

            return (int) $this->inventories
                ->sum(function ($inventory) {
                    return $inventory->quantity - $inventory->reserved;
                });

        }


        return $this->stock;
    }
}