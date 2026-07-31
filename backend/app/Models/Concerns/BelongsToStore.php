<?php

namespace App\Models\Concerns;

use App\Models\Scopes\BelongsToStoreScope;
use App\Models\Store;
use App\Support\Tenancy\Tenant;

/**
 * Añadir este trait a cualquier modelo con columna `store_id` para que:
 *
 *  1. Todas sus queries se filtren automáticamente por la tienda actual
 *     (BelongsToStoreScope), como red de seguridad además del filtrado
 *     manual que ya hacen los controllers.
 *  2. Al crear un registro nuevo sin `store_id` explícito, se rellene
 *     solo con la tienda del tenant actual (evita otro punto donde
 *     alguien podría olvidarse de asignarlo).
 *
 * Uso:
 *
 *   class Product extends Model
 *   {
 *       use BelongsToStore;
 *       ...
 *   }
 */
trait BelongsToStore
{
    public static function bootBelongsToStore(): void
    {
        static::addGlobalScope(new BelongsToStoreScope());

        static::creating(function ($model) {
            if (!$model->store_id && Tenant::check()) {
                $model->store_id = Tenant::id();
            }
        });
    }

    /** La tienda a la que pertenece este registro. */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
