<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use App\Support\Tenancy\Tenant;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends BaseRequest
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
        $userId = $this->route('user');

        return [

            'name' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'email' => [
                'sometimes',
                'required',
                'email:rfc',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            // Solo se valida/actualiza la contraseña si se envía.
            'password' => [
                'sometimes',
                'nullable',
                'confirmed',
                Password::defaults(),
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

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

            'email.email' => 'Ingrese un correo válido.',
            'email.unique' => 'Este correo ya está registrado.',

            'password.confirmed' => 'Las contraseñas no coinciden.',

            'role_ids.*.exists' => 'Uno de los roles seleccionados no es válido.',
        ];
    }
}
