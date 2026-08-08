<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\Role\RoleResource;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    /**
     * Lista los roles visibles para la tienda actual: los propios
     * (store_id = tienda actual) y los roles de sistema (store_id
     * NULL), gracias al scope de Role.
     */
    public function index(Request $request)
    {
        $roles = Role::withCount('users')
            ->with('permissions')
            ->orderByDesc('is_system')
            ->orderBy('name')
            ->get();

        return RoleResource::collection($roles);
    }

    /**
     * Crea un rol personalizado (no de sistema) para la tienda actual.
     */
    public function store(StoreRoleRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $data = $request->validated();

        $role = DB::transaction(function () use ($data, $storeId) {

            $role = Role::create([
                'store_id' => $storeId,
                'uuid' => Str::uuid(),
                'name' => $data['name'],
                'slug' => Str::slug($data['name']) . '-' . Str::random(6),
                'description' => $data['description'] ?? null,
                'is_system' => false,
            ]);

            if (!empty($data['permission_ids'])) {
                $role->permissions()->sync($data['permission_ids']);
            }

            return $role;
        });

        return (new RoleResource($role->load('permissions')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Detalle de un rol con sus permisos.
     */
    public function show(Request $request, int $id)
    {
        $role = Role::withCount('users')
            ->with('permissions')
            ->findOrFail($id);

        return new RoleResource($role);
    }

    /**
     * Actualiza un rol personalizado. Los roles de sistema
     * (super-admin, admin, employee) no se pueden modificar: son la
     * base mínima garantizada de permisos de la plataforma.
     */
    public function update(UpdateRoleRequest $request, int $id)
    {
        $role = Role::findOrFail($id);

        if ($role->is_system) {
            abort(422, 'Los roles del sistema no se pueden modificar.');
        }

        $data = $request->validated();

        DB::transaction(function () use ($role, $data) {

            $roleData = collect($data)
                ->only(['name', 'description'])
                ->toArray();

            if (!empty($roleData)) {
                $role->update($roleData);
            }

            if (array_key_exists('permission_ids', $data)) {
                $role->permissions()->sync($data['permission_ids']);
            }
        });

        return new RoleResource($role->fresh()->load('permissions'));
    }

    /**
     * Elimina un rol personalizado. Bloqueado para roles de sistema y
     * para roles que todavía tengan usuarios asignados (hay que
     * reasignarlos primero, para no dejar a nadie sin rol por accidente).
     */
    public function destroy(Request $request, int $id)
    {
        $role = Role::withCount('users')->findOrFail($id);

        if ($role->is_system) {
            abort(422, 'Los roles del sistema no se pueden eliminar.');
        }

        if ($role->users_count > 0) {
            abort(422, 'No se puede eliminar un rol con usuarios asignados. Reasígnalos primero.');
        }

        $role->delete();

        return response()->json([
            'message' => 'Rol eliminado correctamente.',
        ]);
    }
}
