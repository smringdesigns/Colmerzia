<?php

namespace App\Http\Requests\Store;

use App\Http\Requests\BaseRequest;

class UpdateStoreRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([

            'name' => $this->sanitizeString($this->name),

            'contact_email' => $this->sanitizeEmail($this->contact_email),

            'contact_phone' => $this->sanitizePhone($this->contact_phone),
        ]);
    }

    public function rules(): array
    {
        return [

            // Datos generales de la tienda
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            // Configuración extendida (store_settings)
            'contact_email' => [
                'sometimes',
                'nullable',
                'email:rfc',
                'max:255',
            ],

            'contact_phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:30',
            ],

            'currency' => [
                'sometimes',
                'required',
                'string',
                'size:3',
            ],

            'timezone' => [
                'sometimes',
                'required',
                'string',
                'max:64',
            ],

            'logo_path' => [
                'sometimes',
                'nullable',
                'string',
                'max:2048',
            ],

            'theme_colors' => [
                'sometimes',
                'nullable',
                'array',
            ],

            'theme_colors.*' => [
                'string',
                'max:32',
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'El nombre de la tienda es obligatorio.',

            'contact_email.email' => 'Ingrese un correo de contacto válido.',

            'currency.size' => 'La moneda debe ser un código ISO de 3 letras (ej: USD, COP, MXN).',

        ];
    }
}
