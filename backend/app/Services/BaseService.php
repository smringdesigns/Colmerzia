<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

abstract class BaseService
{
    /**
     * Ejecuta una transacción de base de datos.
     */
    protected function transaction(callable $callback): mixed
    {
        return DB::transaction($callback);
    }
}