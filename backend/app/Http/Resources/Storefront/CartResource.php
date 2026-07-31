<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public static $wrap = null;

    public function __construct($resource, private readonly string $guestToken)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'guest_token' => $this->guestToken,
            'status' => $this->status,
            'items' => CartItemResource::collection($this->whenLoaded('items') ?: $this->items),
            'coupon_code' => $this->coupon?->code,
            // Formateamos como string de dos decimales para la respuesta HTTP
            'subtotal' => number_format((float) $this->subtotal, 2, '.', ''),
            'discount' => number_format((float) $this->discount, 2, '.', ''),
            'tax' => number_format((float) $this->tax, 2, '.', ''),
            'shipping' => number_format((float) $this->shipping, 2, '.', ''),
            'total' => number_format((float) $this->total, 2, '.', ''),
        ];
    }
}