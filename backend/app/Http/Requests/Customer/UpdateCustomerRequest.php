<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $storeId    = $this->user()->store_id;
        $customerId = $this->route('customer');

        return [
            'first_name'      => ['required', 'string', 'max:100'],
            'last_name'       => ['nullable', 'string', 'max:100'],
            'email'           => ['required', 'email', "unique:customers,email,{$customerId},id,store_id,{$storeId}"],
            'phone'           => ['nullable', 'string', 'max:50'],
            'document_type'   => ['nullable', 'string', 'in:CC,CE,NIT,PPN,TI'],
            'document_number' => ['nullable', 'string', 'max:50'],
            'company'         => ['nullable', 'string', 'max:150'],
            'birth_date'      => ['nullable', 'date', 'before:today'],
            'notes'           => ['nullable', 'string'],
            'is_active'       => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El nombre es obligatorio.',
            'email.required'      => 'El correo es obligatorio.',
            'email.email'         => 'Ingresa un correo válido.',
            'email.unique'        => 'Este correo ya está registrado en la tienda.',
            'birth_date.before'   => 'La fecha de nacimiento debe ser anterior a hoy.',
        ];
    }
}
