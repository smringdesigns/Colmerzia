<?php

namespace App\Http\Requests\Store;

use App\Http\Requests\BaseRequest;

class UploadStoreLogoRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'logo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp,svg',
                'max:2048', // KB (2 MB)
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'logo.required' => 'Selecciona una imagen para el logo.',
            'logo.image' => 'El archivo debe ser una imagen.',
            'logo.mimes' => 'Formatos permitidos: JPG, PNG, WEBP o SVG.',
            'logo.max' => 'El logo no puede pesar más de 2 MB.',
        ];
    }
}
