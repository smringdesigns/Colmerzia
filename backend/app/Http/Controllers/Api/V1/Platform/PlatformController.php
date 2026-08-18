<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Resources\Platform\StorePlatformResource;
use App\Http\Resources\User\UserResource;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Endpoints de plataforma: cruzan todas las tiendas a la vez.
 *
 * A diferencia del resto del panel (StoreController, UserController,
 * etc.), estos NO pasan por currentStoreId() ni requieren tenant
 * resuelto — son exactamente el caso legítimo que
 * BelongsToStoreScope documenta como excepción. La protección acá
 * es el middleware 'super-admin', no el aislamiento por tienda.
 */
class PlatformController extends Controller
{
    /**
     * Lista todas las tiendas de la plataforma, con conteos básicos
     * y el estado de su suscripción.
     */
    public function stores(Request $request)
    {
        $query = Store::withCount(['users', 'products', 'categories'])
            ->with('subscription');

        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('subdomain', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('business_type')) {
            $query->where('business_type', $request->query('business_type'));
        }

        if ($request->has('is_active')) {

            $isActive = filter_var(
                $request->query('is_active'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }
        }

        $perPage = min(
            max((int) $request->query('per_page', 20), 1),
            100
        );

        $stores = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return StorePlatformResource::collection($stores);
    }

    /**
     * Resumen de una tienda puntual (para el detalle en el panel de
     * plataforma), sin necesidad de resolver esa tienda como tenant.
     */
    public function showStore(int $id)
    {
        $store = Store::withCount(['users', 'products', 'categories'])
            ->with(['subscription', 'settings'])
            ->findOrFail($id);

        return new StorePlatformResource($store);
    }

    /**
     * Lista todos los usuarios de la plataforma, de cualquier tienda,
     * con el nombre/subdominio de la tienda a la que pertenecen y
     * sus roles.
     *
     * Nota: User no tiene BelongsToStoreScope aplicado (no usa el
     * trait BelongsToStore, a diferencia de Product/Category/Role/
     * etc.) — el resto del panel lo filtra manualmente vía
     * currentStoreId(). Acá, precisamente, no queremos ese filtro.
     */
    public function users(Request $request)
    {
        $query = User::query()
            ->with(['store:id,name,subdomain', 'roles']);

        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->query('store_id'));
        }

        $perPage = min(
            max((int) $request->query('per_page', 20), 1),
            100
        );

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Elimina un usuario de forma PERMANENTE (forceDelete), sin
     * importar a qué tienda pertenezca.
     *
     * A diferencia de UserController::destroy() (soft delete, dentro
     * de la propia tienda), esto es a propósito destructivo: existe
     * para que un super-admin pueda revertir errores de verdad —
     * ej. una tienda de prueba creada con el subdominio o el correo
     * mal escrito — liberando el email (columna única en toda la
     * plataforma) y el subdominio para poder reintentar.
     *
     * Protecciones:
     * - Nadie puede eliminarse a sí mismo por esta vía.
     * - No se puede eliminar al último usuario con rol 'super-admin'
     *   restante (te dejaría sin forma de volver a entrar aquí).
     */
    public function destroyUser(Request $request, int $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if ($request->user()->id === $user->id) {
            abort(422, 'No puedes eliminar tu propia cuenta desde acá.');
        }

        if ($user->hasRole('super-admin')) {

            $remainingSuperAdmins = User::whereHas(
                'roles',
                fn ($q) => $q->where('slug', 'super-admin')
            )->where('id', '!=', $user->id)->count();

            if ($remainingSuperAdmins === 0) {
                abort(422, 'No puedes eliminar al último super-admin de la plataforma.');
            }
        }

        $user->roles()->detach();
        $user->forceDelete();

        return response()->json([
            'message' => 'Usuario eliminado permanentemente.',
        ]);
    }
}
