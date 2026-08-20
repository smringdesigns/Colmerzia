<?php

namespace App\Http\Requests\Storefront;

use App\Http\Requests\BaseRequest;

class SaveCustomerAddressRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:60'],
            'recipient_name' => ['required', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:10'],
            'state' => ['nullable', 'string', 'max:120'],
            'city' => ['required', 'string', 'max:120'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'is_shipping' => ['boolean'],
            'is_billing' => ['boolean'],
            'is_default' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'recipient_name.required' => 'Indica quién recibe en esta dirección.',
            'address_line_1.required' => 'Ingresa la dirección.',
            'city.required' => 'Ingresa la ciudad.',
        ];
    }
}
