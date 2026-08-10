<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use App\Support\Tenancy\Tenant;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([

            'name' => $this->sanitizeString($this->name),

            'email' => $this->sanitizeEmail($this->email),
        ]);
    }

    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'email' => [
                'required',
                'email:rfc',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'confirmed',
                Password::defaults(),
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            // Roles a asignar al usuario nuevo (opcional al crear).
            'role_ids' => [
                'sometimes',
                'array',
            ],

            'role_ids.*' => [
                'integer',
                Rule::exists('roles', 'id')->where(function ($query) {
                    $query->where(function ($q) {
                        $q->where('store_id', Tenant::id())
                          ->orWhereNull('store_id');
                    });
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'El nombre es obligatorio.',

            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo válido.',
            'email.unique' => 'Este correo ya está registrado.',

            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',

            'role_ids.*.exists' => 'Uno de los roles seleccionados no es válido.',
        ];
    }
}
