<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    /**
     * Incluye metadatos comunes cuando sea necesario.
     */
    protected function meta(): array
    {
        return [];
    }

    /**
     * Respuesta estándar para todas las APIs.
     */
    public function with(Request $request): array
    {
        return [

            'success' => true,

            'meta' => $this->meta(),

        ];
    }
}