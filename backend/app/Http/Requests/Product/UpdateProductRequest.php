<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Al editar ignoramos el SKU del propio producto
        $productId = $this->route('product');

        return [
            'name'              => ['required', 'string', 'max:255'],
            'sku'               => ['required', 'string', 'max:100', "unique:products,sku,{$productId}"],
            'price'             => ['required', 'numeric', 'min:0'],
            'compare_price'     => ['nullable', 'numeric', 'min:0'],
            'cost_price'        => ['nullable', 'numeric', 'min:0'],
            'stock'             => ['nullable', 'integer', 'min:0'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description'       => ['nullable', 'string'],
            'category_id'       => ['nullable', 'exists:categories,id'],
            'brand_id'          => ['nullable', 'exists:brands,id'],
            'featured'          => ['boolean'],
            'is_active'         => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'El nombre del producto es obligatorio.',
            'sku.required'   => 'El SKU es obligatorio.',
            'sku.unique'     => 'Este SKU ya está en uso.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric'  => 'El precio debe ser un número.',
            'price.min'      => 'El precio no puede ser negativo.',
        ];
    }
}
