<?php

namespace App\Http\Requests\Storefront;

use App\Http\Requests\BaseRequest;
use App\Models\Customer;

class CheckoutRequest extends BaseRequest
{
    public function rules(): array
    {
        $isAuthenticatedCustomer = $this->user('sanctum') instanceof Customer;

        return [
            // Solo obligatorio para invitados — un cliente logueado
            // ya tiene nombre/email/teléfono en su propia cuenta,
            // no se le vuelve a pedir.
            'customer.name' => [
                $isAuthenticatedCustomer ? 'sometimes' : 'required',
                'string',
                'max:255',
            ],
            'customer.email' => [
                $isAuthenticatedCustomer ? 'sometimes' : 'required',
                'email',
                'max:255',
            ],
            'customer.phone' => ['nullable', 'string', 'max:30'],

            // Un cliente logueado puede mandar shipping_address_id
            // (una dirección ya guardada) EN VEZ DE escribir todo el
            // bloque shipping_address de nuevo.
            'shipping_address_id' => [
                $isAuthenticatedCustomer ? 'nullable' : 'prohibited',
                'integer',
            ],

            'shipping_address.line1' => [
                $isAuthenticatedCustomer && $this->filled('shipping_address_id')
                    ? 'sometimes'
                    : 'required',
                'string',
                'max:255',
            ],
            'shipping_address.line2' => ['nullable', 'string', 'max:255'],
            'shipping_address.city' => [
                $isAuthenticatedCustomer && $this->filled('shipping_address_id')
                    ? 'sometimes'
                    : 'required',
                'string',
                'max:120',
            ],
            'shipping_address.state' => ['nullable', 'string', 'max:120'],
            'shipping_address.country' => [
                $isAuthenticatedCustomer && $this->filled('shipping_address_id')
                    ? 'sometimes'
                    : 'required',
                'string',
                'max:120',
            ],
            'shipping_address.postal_code' => ['nullable', 'string', 'max:20'],

            // 'cash'/'transfer' con la pasarela manual de hoy;
            // cuando se integre PSE/Wompi, sus métodos también pasan
            // por acá (la validación real de "cuáles están
            // soportados" vive en CheckoutService, contra la
            // pasarela activa — este campo solo exige que venga algo).
            'payment_method' => ['required', 'string', 'max:30'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer.name.required' => 'Ingresa tu nombre.',
            'customer.email.required' => 'Ingresa tu correo electrónico.',
            'shipping_address.line1.required' => 'Ingresa la dirección de envío.',
            'shipping_address.city.required' => 'Ingresa la ciudad de envío.',
            'shipping_address.country.required' => 'Ingresa el país de envío.',
            'shipping_address_id.prohibited' => 'Inicia sesión para usar una dirección guardada.',
            'payment_method.required' => 'Selecciona un método de pago.',
        ];
    }
}

