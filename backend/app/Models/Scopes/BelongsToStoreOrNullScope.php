<?php

namespace App\Models\Scopes;

use App\Support\Tenancy\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Variante de BelongsToStoreScope para modelos donde `store_id` es
 * NULLABLE por diseño, porque algunas filas son globales / del sistema
 * y deben verse desde cualquier tienda (o desde el dominio central):
 *
 *  - Role: los roles de sistema (is_system = true, ej. "super-admin")
 *    tienen store_id NULL y deben ser visibles en cualquier tienda.
 *  - Notification / Setting: pueden existir a nivel plataforma,
 *    aplicables a todas las tiendas.
 *  - AuditLog: acciones hechas desde el panel super-admin no están
 *    atadas a ninguna tienda.
 *
 * Por eso el filtro es "store_id = tienda actual OR store_id IS NULL",
 * en vez de una igualdad estricta. Si tu caso de uso necesita excluir
 * también los registros globales, usa withoutStoreScope() (ver
 * BelongsToStoreScope) y filtra manualmente.
 */
class BelongsToStoreOrNullScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (Tenant::check()) {
            $column = $model->qualifyColumn('store_id');

            $builder->where(function (Builder $query) use ($column) {
                $query->where($column, Tenant::id())
                      ->orWhereNull($column);
            });
        }
    }

    public function extend(Builder $builder): void
    {
        $scopeClass = static::class;

        $builder->macro('withoutStoreScope', function (Builder $builder) use ($scopeClass) {
            return $builder->withoutGlobalScope($scopeClass);
        });
    }
}
