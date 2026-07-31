<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class LoginRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => $this->sanitizeEmail($this->email),
        ]);
    }

    public function rules(): array
    {
        return [

            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
            ],

            'password' => [
                'required',
                'string',
                'max:255',
            ],

        ];
    }

    public function messages(): array
    {
        return [

            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo electrónico válido.',

            'password.required' => 'La contraseña es obligatoria.',

        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}