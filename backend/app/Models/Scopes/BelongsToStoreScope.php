<?php

namespace App\Models\Scopes;

use App\Support\Tenancy\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Filtra automáticamente cualquier query de un modelo "tenant-scoped"
 * para que solo devuelva filas de la tienda actual (Tenant::current()).
 *
 * Esto es una segunda capa de defensa además del filtrado manual en los
 * controllers (currentStoreId()): si algún controller, job o comando
 * nuevo se olvida de aplicar el where('store_id', ...), este scope
 * sigue protegiendo el aislamiento entre tiendas.
 *
 * Si no hay tenant resuelto (por ejemplo, comandos de artisan, colas,
 * tests, o el panel super-admin en el dominio central), el scope NO
 * restringe nada: esos contextos legítimamente necesitan ver datos de
 * cualquier tienda. La restricción "real" para peticiones HTTP normales
 * ya está garantizada porque ResolveTenantBySubdomain siempre setea el
 * tenant antes de llegar a un controller de negocio.
 */
class BelongsToStoreScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (Tenant::check()) {
            $builder->where(
                $model->qualifyColumn('store_id'),
                Tenant::id()
            );
        }
    }

    /**
     * Permite construir queries explícitamente sin el scope, para los
     * pocos casos legítimos que sí necesitan cruzar tiendas (por
     * ejemplo, el panel super-admin): Product::withoutStoreScope()...
     */
    public function extend(Builder $builder): void
    {
        // Nota: Builder::macro() re-vincula $this al Builder cuando el
        // macro se invoca, así que no podemos depender de $this aquí
        // para referirnos a la clase del scope; la capturamos antes.
        $scopeClass = static::class;

        $builder->macro('withoutStoreScope', function (Builder $builder) use ($scopeClass) {
            return $builder->withoutGlobalScope($scopeClass);
        });
    }
}
