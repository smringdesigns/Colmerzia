<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Lista paginada de usuarios (staff) de la tienda actual.
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $query = User::with('roles')
            ->where('store_id', $storeId);

        if ($request->filled('search')) {

            $search = $request->query('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
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

        if ($request->filled('role')) {

            $role = $request->query('role');

            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('slug', $role);
            });
        }

        $perPage = min(
            max((int) $request->query('per_page', 15), 1),
            100
        );

        $users = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Crea un usuario staff nuevo dentro de la tienda actual y le
     * asigna los roles indicados. Respeta el límite de usuarios del
     * plan (max_staff_users), igual que el registro público.
     */
    public function store(StoreUserRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $currentCount = User::where('store_id', $storeId)->count();

        $this->abortIfPlanLimitReached('max_staff_users', $currentCount);

        $data = $request->validated();

        $user = DB::transaction(function () use ($data, $storeId) {

            $user = User::create([
                'uuid' => Str::uuid(),
                'store_id' => $storeId,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (!empty($data['role_ids'])) {
                $user->roles()->sync($data['role_ids']);
            }

            return $user;
        });

        return (new UserResource($user->load('roles')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Detalle de un usuario staff.
     */
    public function show(Request $request, int $id)
    {
        $user = User::with('roles')
            ->where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Actualiza un usuario staff: datos básicos, contraseña (opcional),
     * estado activo/inactivo y roles asignados.
     */
    public function update(UpdateUserRequest $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $user = User::where('store_id', $storeId)->findOrFail($id);

        $data = $request->validated();

        // Nadie puede desactivarse a sí mismo desde el panel: evita que
        // un admin se quede sin acceso por error y sin nadie más que
        // pueda reactivarlo.
        if (
            $request->user()->id === $user->id
            && array_key_exists('is_active', $data)
            && $data['is_active'] === false
        ) {
            abort(422, 'No puedes desactivar tu propia cuenta.');
        }

        DB::transaction(function () use ($user, $data) {

            $userData = collect($data)
                ->only(['name', 'email', 'is_active'])
                ->toArray();

            if (!empty($data['password'])) {
                $userData['password'] = $data['password'];
            }

            if (!empty($userData)) {
                $user->update($userData);
            }

            if (array_key_exists('role_ids', $data)) {
                $user->roles()->sync($data['role_ids']);
            }
        });

        return new UserResource($user->fresh()->load('roles'));
    }

    /**
     * Elimina (soft delete) un usuario staff. No permite auto-eliminación.
     */
    public function destroy(Request $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $user = User::where('store_id', $storeId)->findOrFail($id);

        if ($request->user()->id === $user->id) {
            abort(422, 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente.',
        ]);
    }
}
