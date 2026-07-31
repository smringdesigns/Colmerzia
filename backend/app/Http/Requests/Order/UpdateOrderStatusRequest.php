<?php

namespace App\Http\Requests\Order;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'status' => [
                'sometimes',
                Rule::in(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
            ],
            'payment_status' => [
                'sometimes',
                Rule::in(['pending', 'paid', 'failed', 'refunded']),
            ],
            'shipping_status' => [
                'sometimes',
                Rule::in(['pending', 'preparing', 'shipped', 'delivered']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Estado de orden inválido.',
            'payment_status.in' => 'Estado de pago inválido.',
            'shipping_status.in' => 'Estado de envío inválido.',
        ];
    }
}
