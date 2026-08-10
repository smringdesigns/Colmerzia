<?php

namespace App\Http\Requests\Role;

use App\Http\Requests\BaseRequest;
use App\Support\Tenancy\Tenant;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([

            'name' => $this->sanitizeString($this->name),

            'description' => $this->sanitizeString($this->description),
        ]);
    }

    public function rules(): array
    {
        $roleId = $this->route('role');

        return [

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')
                    ->where(fn ($query) => $query->where('store_id', Tenant::id()))
                    ->ignore($roleId),
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'permission_ids' => [
                'sometimes',
                'array',
            ],

            'permission_ids.*' => [
                'integer',
                'exists:permissions,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'El nombre del rol es obligatorio.',
            'name.unique' => 'Ya existe un rol con ese nombre en tu tienda.',

            'permission_ids.*.exists' => 'Uno de los permisos seleccionados no es válido.',
        ];
    }
}
