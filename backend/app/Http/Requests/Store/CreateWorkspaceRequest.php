<?php

namespace App\Http\Requests\Store;

use App\Http\Requests\BaseRequest;
use App\Support\BusinessTypes\BusinessTypeRegistry;
use Illuminate\Validation\Rule;

class CreateWorkspaceRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([

            'name' => $this->sanitizeString($this->name),

            'subdomain' => $this->subdomain
                ? strtolower(trim($this->subdomain))
                : $this->subdomain,
        ]);
    }

    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'subdomain' => [
                'required',
                'string',
                'max:50',
                'unique:stores,subdomain',
                'regex:/^[a-z0-9\-]+$/',
            ],

            'business_type' => [
                'required',
                'string',
                Rule::in(BusinessTypeRegistry::slugs()),
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'El nombre de la tienda es obligatorio.',

            'subdomain.required' => 'El subdominio es obligatorio.',
            'subdomain.unique' => 'Ese subdominio ya está en uso.',
            'subdomain.regex' => 'El subdominio solo puede tener letras minúsculas, números y guiones.',

            'business_type.required' => 'Selecciona el tipo de negocio.',
            'business_type.in' => 'El tipo de negocio seleccionado no es válido.',

        ];
    }
}
