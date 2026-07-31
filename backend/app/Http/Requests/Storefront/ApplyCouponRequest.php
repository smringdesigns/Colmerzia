<?php

namespace App\Http\Requests\Storefront;

use App\Http\Requests\BaseRequest;

class ApplyCouponRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => $this->code ? trim($this->code) : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
        ];
    }
}
