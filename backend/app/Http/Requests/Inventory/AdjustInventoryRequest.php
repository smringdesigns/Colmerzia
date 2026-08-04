<?php

namespace App\Http\Requests\Inventory;

use App\Http\Requests\BaseRequest;

class AdjustInventoryRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}
