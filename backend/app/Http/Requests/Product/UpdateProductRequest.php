<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $storeId = $this->user()->store_id;

        /*
        |--------------------------------------------------------------------------
        | Obtenemos el ID del producto desde la ruta
        |--------------------------------------------------------------------------
        |
        | La ruta es:
        |
        | PUT/PATCH /api/v1/products/{product}
        |
        */

        $productId = $this->route('product');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'sku' => [
                'required',
                'string',
                'max:100',

                Rule::unique('products', 'sku')
                    ->ignore($productId),
            ],

            'price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'compare_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'cost_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'stock' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'min_stock' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'short_description' => [
                'nullable',
                'string',
                'max:500',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where('store_id', $storeId),
            ],

            'brand_id' => [
                'nullable',
                Rule::exists('brands', 'id')
                    ->where('store_id', $storeId),
            ],

            'weight' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'length' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'width' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'height' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'featured' => [
                'sometimes',
                'boolean',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'has_variants' => [
                'sometimes',
                'boolean',
            ],

            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],

            'meta_description' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',

            'sku.required' => 'El SKU es obligatorio.',
            'sku.unique' => 'Este SKU ya está en uso.',

            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser negativo.',

            'compare_price.numeric' => 'El precio de comparación debe ser un número.',
            'compare_price.min' => 'El precio de comparación no puede ser negativo.',

            'cost_price.numeric' => 'El precio de costo debe ser un número.',
            'cost_price.min' => 'El precio de costo no puede ser negativo.',

            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',

            'min_stock.integer' => 'El stock mínimo debe ser un número entero.',
            'min_stock.min' => 'El stock mínimo no puede ser negativo.',

            'category_id.exists' => 'La categoría no existe o no pertenece a esta tienda.',
            'brand_id.exists' => 'La marca no existe o no pertenece a esta tienda.',

            'weight.min' => 'El peso no puede ser negativo.',
            'length.min' => 'El largo no puede ser negativo.',
            'width.min' => 'El ancho no puede ser negativo.',
            'height.min' => 'La altura no puede ser negativa.',
        ];
    }
}