<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    /**
     * Determina dinámicamente la conexión para evitar conflictos en los tests (SQLite vs PostgreSQL).
     */
    public function getConnectionName()
    {
        // Si estamos ejecutando tests con SQLite en memoria, usa la conexión por defecto del test
        if (config('database.default') === 'sqlite') {
            return null; 
        }

        // En producción / desarrollo normal, usa PostgreSQL central
        return 'pgsql';
    }
}