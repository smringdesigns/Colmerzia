<?php

namespace App\Http\Requests\Storefront;

use App\Http\Requests\BaseRequest;

class UpdateCartItemRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            // 0 = quitar el item del carrito.
            'quantity' => ['required', 'integer', 'min:0'],
        ];
    }
}
