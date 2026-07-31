<?php

namespace App\Http\Requests\Storefront;

use App\Http\Requests\BaseRequest;

class AddCartItemRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer'],
            'product_variant_id' => ['nullable', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
