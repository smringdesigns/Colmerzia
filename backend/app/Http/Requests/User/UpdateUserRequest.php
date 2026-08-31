<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator;

class UpdateUserRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->sanitizeString($this->name),
            'email' => $this->email !== null
                ? $this->sanitizeEmail($this->email)
                : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
            'email' => ['sometimes', 'required', 'email:rfc', 'max:255'],
            'password' => [
                'sometimes',
                'nullable',
                'confirmed',
                Password::defaults(),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => [
                'integer',
                Rule::exists('roles', 'id')->where(
                    fn ($query) => $query
                        ->where('store_id', Tenant::id())
                        ->whereNull('deleted_at')
                ),
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $email = strtolower(trim((string) $this->input('email')));
            $userId = $this->route('user');

            if ($email === '') {
                return;
            }

            $exists = User::withTrashed()
                ->whereRaw('LOWER(BTRIM(email)) = ?', [$email])
                ->when($userId, fn ($query) => $query->where($query->getModel()->getKeyName(), '<>', $userId))
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'email',
                    'Este correo ya está registrado.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Ingrese un correo válido.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'role_ids.*.exists' => 'El rol no pertenece a la tienda actual.',
        ];
    }
}
