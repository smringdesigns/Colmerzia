<?php

namespace App\Models\Concerns;

use App\Models\Scopes\BelongsToStoreOrNullScope;
use App\Models\Store;

/**
 * Igual que BelongsToStore, pero para modelos cuyo `store_id` es
 * NULLABLE porque algunas filas son globales / del sistema (roles de
 * sistema, notificaciones o settings de plataforma, logs generados
 * fuera del contexto de una tienda).
 *
 * A diferencia de BelongsToStore, este trait NO auto-rellena store_id
 * al crear: aquí un store_id vacío suele ser una decisión intencional
 * (registro global), no un olvido.
 *
 * Uso:
 *
 *   class Role extends Model
 *   {
 *       use BelongsToStoreOrNull;
 *       ...
 *   }
 */
trait BelongsToStoreOrNull
{
    public static function bootBelongsToStoreOrNull(): void
    {
        static::addGlobalScope(new BelongsToStoreOrNullScope());
    }

    /** La tienda a la que pertenece este registro (null = global). */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
