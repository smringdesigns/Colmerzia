<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'product_name' => $this->product?->name,
            'variant_name' => $this->productVariant?->name,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'compare_price' => $this->compare_price,
            'total' => $this->total,
        ];
    }
}
