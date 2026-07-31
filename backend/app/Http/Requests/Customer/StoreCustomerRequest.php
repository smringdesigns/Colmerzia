<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $storeId = $this->user()->store_id;

        return [
            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                Rule::unique('customers', 'email')
                    ->where('store_id', $storeId),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'document_type' => [
                'nullable',
                'string',
                'in:CC,CE,NIT,PPN,TI',
            ],

            'document_number' => [
                'nullable',
                'string',
                'max:50',
            ],

            'company' => [
                'nullable',
                'string',
                'max:150',
            ],

            'birth_date' => [
                'nullable',
                'date',
                'before:today',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El nombre es obligatorio.',

            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'Ingresa un correo válido.',
            'email.unique' => 'Este correo ya está registrado en la tienda.',

            'document_type.in' =>
                'El tipo de documento seleccionado no es válido.',

            'birth_date.before' =>
                'La fecha de nacimiento debe ser anterior a hoy.',
        ];
    }
}