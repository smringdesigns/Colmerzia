<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Resources\Platform\StorePlatformResource;
use App\Http\Resources\User\UserResource;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Endpoints de plataforma.
 *
 * Estos endpoints trabajan a nivel global de la plataforma,
 * por lo que NO utilizan el tenant actual.
 *
 * La protección principal de estas rutas es el middleware
 * "super-admin".
 */
class PlatformController extends Controller
{
    /**
     * Lista todas las tiendas de la plataforma.
     *
     * Incluye:
     * - cantidad de usuarios
     * - cantidad de productos
     * - cantidad de categorías
     * - suscripción
     */
    public function stores(Request $request)
    {
        $query = Store::withCount([
            'users',
            'products',
            'categories',
        ])->with('subscription');

        // Buscar por nombre, subdominio o correo.
        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('subdomain', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // Filtrar por tipo de negocio.
        if ($request->filled('business_type')) {
            $query->where(
                'business_type',
                $request->query('business_type')
            );
        }

        // Filtrar por estado activo/inactivo.
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

        // Limitar cantidad de resultados por página.
        $perPage = min(
            max(
                (int) $request->query('per_page', 20),
                1
            ),
            100
        );

        $stores = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return StorePlatformResource::collection($stores);
    }


    /**
     * Mostrar información detallada de una tienda.
     *
     * No necesita resolver el tenant porque el super-admin
     * puede consultar cualquier tienda de la plataforma.
     */
    public function showStore(int $id)
    {
        $store = Store::withCount([
            'users',
            'products',
            'categories',
        ])
            ->with([
                'subscription',
                'settings',
            ])
            ->findOrFail($id);

        return new StorePlatformResource($store);
    }


    /**
     * Eliminar permanentemente una tienda.
     *
     * Esta operación solamente está disponible para super-admin.
     *
     * La base de datos de Colmerzia tiene varias relaciones con
     * cascadeOnDelete(), por lo que al eliminar físicamente la tienda
     * PostgreSQL eliminará automáticamente los registros dependientes
     * correspondientes.
     *
     * Los audit_logs utilizan nullOnDelete(), por lo que los registros
     * de auditoría pueden conservarse aunque la tienda desaparezca.
     */
    public function destroyStore(Request $request, int $id)
    {
        $store = Store::withTrashed()->findOrFail($id);

        /*
         * Evitar eliminar una tienda que ya fue eliminada.
         *
         * Esto permite devolver una respuesta clara en lugar de
         * intentar ejecutar nuevamente forceDelete().
         */
        if ($store->trashed()) {
            return response()->json([
                'message' => 'La tienda ya fue eliminada.',
            ], 410);
        }

        /*
         * Obtener el usuario que está ejecutando la operación.
         */
        $user = $request->user();

        /*
         * Protección adicional:
         *
         * Si el super-admin tiene asociada esta tienda, no permitimos
         * eliminarla desde esta operación para evitar dejar la sesión
         * administrativa en un estado inconsistente.
         */
        if ($user && (int) $user->store_id === (int) $store->id) {
            abort(
                422,
                'No puedes eliminar la tienda asociada a tu propia cuenta desde acá.'
            );
        }

        /*
         * Eliminación permanente.
         *
         * Las foreign keys configuradas con cascadeOnDelete()
         * se encargan de eliminar las relaciones dependientes.
         */
        $store->forceDelete();

        return response()->json([
            'message' => 'Tienda eliminada permanentemente.',
        ]);
    }


    /**
     * Lista todos los usuarios de la plataforma.
     *
     * A diferencia del panel administrativo normal,
     * aquí no se filtra por una tienda concreta.
     */
    public function users(Request $request)
    {
        $query = User::query()
            ->with([
                'store:id,name,subdomain',
                'roles',
            ]);

        // Buscar por nombre o correo.
        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // Filtrar usuarios de una tienda concreta.
        if ($request->filled('store_id')) {
            $query->where(
                'store_id',
                $request->query('store_id')
            );
        }

        // Limitar resultados por página.
        $perPage = min(
            max(
                (int) $request->query('per_page', 20),
                1
            ),
            100
        );

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserResource::collection($users);
    }


    /**
     * Eliminar permanentemente un usuario desde la plataforma.
     *
     * Esta operación solamente está disponible para super-admin.
     */
    public function destroyUser(Request $request, int $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        /*
         * No permitir que un super-admin elimine su propia cuenta
         * desde este endpoint.
         */
        if ($request->user()->id === $user->id) {
            abort(
                422,
                'No puedes eliminar tu propia cuenta desde acá.'
            );
        }

        /*
         * No permitir eliminar al último super-admin.
         *
         * Esto evita dejar la plataforma sin ninguna cuenta
         * administrativa con acceso global.
         */
        if ($user->hasRole('super-admin')) {

            $remainingSuperAdmins = User::whereHas(
                'roles',
                fn ($q) => $q->where('slug', 'super-admin')
            )
                ->where('id', '!=', $user->id)
                ->count();

            if ($remainingSuperAdmins === 0) {
                abort(
                    422,
                    'No puedes eliminar al último super-admin de la plataforma.'
                );
            }
        }

        /*
         * Primero eliminamos las relaciones de roles.
         */
        $user->roles()->detach();

        /*
         * Eliminación física.
         */
        $user->forceDelete();

        return response()->json([
            'message' => 'Usuario eliminado permanentemente.',
        ]);
    }
}