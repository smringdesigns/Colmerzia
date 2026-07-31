<?php

namespace App\Http\Requests\Onboarding;

use App\Http\Requests\BaseRequest;
use App\Support\Plans\PlanRegistry;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreOnboardingRequest extends BaseRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'business_name' => $this->sanitizeString($this->business_name),
            'subdomain' => $this->subdomain
                ? strtolower(trim($this->subdomain))
                : null,
            'owner_name' => $this->sanitizeString($this->owner_name),
            'email' => $this->sanitizeEmail($this->email),
        ]);
    }

    public function rules(): array
    {
        // Un subdominio nunca puede coincidir con uno de los dominios
        // centrales (localhost, el dominio de marketing, el panel
        // super-admin, etc.) porque ahí es donde vive este mismo
        // endpoint de onboarding.
        $centralDomains = config('tenancy.central_domains', []);

        return [

            'business_name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],

            'subdomain' => [
                'required',
                'string',
                'min:3',
                'max:63',
                'regex:/^[a-z0-9]([a-z0-9\-]*[a-z0-9])?$/',
                'unique:stores,subdomain',
                Rule::notIn($centralDomains),
            ],

            'owner_name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'confirmed',
                Password::defaults(),
            ],

            'plan_slug' => [
                'required',
                'string',
                Rule::in(PlanRegistry::slugs()),
            ],

        ];
    }

    public function messages(): array
    {
        return [
            'business_name.required' => 'El nombre del negocio es obligatorio.',

            'subdomain.required' => 'El subdominio es obligatorio.',
            'subdomain.regex' => 'El subdominio solo puede tener letras minúsculas, números y guiones.',
            'subdomain.unique' => 'Ese subdominio ya está en uso.',
            'subdomain.not_in' => 'Ese subdominio está reservado.',

            'owner_name.required' => 'El nombre del dueño de la tienda es obligatorio.',

            'email.required' => 'El correo electrónico es obligatorio.',
            'email.unique' => 'Este correo ya está registrado.',

            'password.confirmed' => 'Las contraseñas no coinciden.',

            'plan_slug.in' => 'El plan seleccionado no es válido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'business_name' => 'nombre del negocio',
            'subdomain' => 'subdominio',
            'owner_name' => 'nombre del dueño',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
            'plan_slug' => 'plan',
        ];
    }
}
