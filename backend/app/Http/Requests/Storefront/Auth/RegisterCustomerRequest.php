<?php

namespace App\Http\Requests\Storefront\Auth;

use App\Http\Requests\BaseRequest;
use App\Support\Tenancy\Tenant;
use Illuminate\Validation\Rule;

class RegisterCustomerRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => $this->sanitizeEmail($this->input('email')),
            'phone' => $this->sanitizePhone($this->input('phone')),
        ]);
    }

    public function rules(): array
    {
        // El email es único por TIENDA (no en toda la plataforma,
        // a diferencia de los usuarios del panel) — la misma persona
        // puede tener cuenta de cliente en varias tiendas de
        // Colmerzia con el mismo correo.
        $storeId = Tenant::current()?->id;

        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['nullable', 'string', 'max:120'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('customers', 'email')->where('store_id', $storeId),
            ],

            'phone' => ['nullable', 'string', 'max:30'],

            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Ingresa tu nombre.',
            'email.required' => 'Ingresa tu correo electrónico.',
            'email.email' => 'Ingresa un correo válido.',
            'email.unique' => 'Ya existe una cuenta con este correo en esta tienda.',
            'password.required' => 'Ingresa una contraseña.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];
    }
}
