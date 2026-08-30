<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $storeId = $this->user()->store_id;

        // route('category') puede venir como el modelo ya resuelto
        // (route model binding) o como el ID crudo -- cubrimos los
        // dos casos para no adivinar mal el "no puede ser su propio
        // padre".
        $routeCategory = $this->route('category');
        $categoryId = $routeCategory instanceof \App\Models\Category
            ? $routeCategory->id
            : $routeCategory;

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'parent_id' => [
                'nullable',
                'integer',
                // No puede ser ella misma -- evita que una categoría
                // termine siendo su propio padre.
                Rule::notIn([$categoryId]),
                Rule::exists('categories', 'id')
                    ->where('store_id', $storeId),
            ],

            'image' => [
                'nullable',
                'string',
            ],

            'is_active' => [
                'boolean',
            ],

            'sort_order' => [
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'parent_id.exists' => 'La categoría padre no existe o no pertenece a esta tienda.',
            'parent_id.not_in' => 'Una categoría no puede ser su propia categoría padre.',
        ];
    }
}
