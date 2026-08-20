<?php

namespace App\Http\Requests\Storefront\Auth;

use App\Http\Requests\BaseRequest;

class LoginCustomerRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => $this->sanitizeEmail($this->input('email')),
        ]);
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Ingresa tu correo electrónico.',
            'password.required' => 'Ingresa tu contraseña.',
        ];
    }
}
