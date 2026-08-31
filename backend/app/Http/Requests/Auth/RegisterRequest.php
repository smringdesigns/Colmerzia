<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator;

class RegisterRequest extends BaseRequest
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
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $email = strtolower(trim((string) $this->input('email')));

            if ($email !== '' && User::withTrashed()
                ->whereRaw('LOWER(BTRIM(email)) = ?', [$email])
                ->exists()) {
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
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo válido.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}
