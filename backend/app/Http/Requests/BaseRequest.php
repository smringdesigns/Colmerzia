<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class BaseRequest extends FormRequest
{
    /**
     * Todos los Request están autorizados por defecto.
     * Los que necesiten permisos especiales sobrescribirán este método.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Limpia un texto.
     */
    protected function sanitizeString(?string $value): ?string
    {
        return $value !== null
            ? trim($value)
            : null;
    }

    /**
     * Limpia un email.
     */
    protected function sanitizeEmail(?string $value): ?string
    {
        return $value !== null
            ? strtolower(trim($value))
            : null;
    }

    /**
     * Limpia un teléfono.
     */
    protected function sanitizePhone(?string $value): ?string
    {
        return $value !== null
            ? preg_replace('/\s+/', '', trim($value))
            : null;
    }
}