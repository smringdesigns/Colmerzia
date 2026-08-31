<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $query = User::query()
            ->with('roles')
            ->where('store_id', $storeId);

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));

            $query->where(function ($q) use ($search): void {
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
            $role = strtolower(trim((string) $request->query('role')));

            $query->whereHas('roles', function ($q) use ($role): void {
                $q->whereRaw('LOWER(BTRIM(slug)) = ?', [$role]);
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        return UserResource::collection(
            $query->latest()->paginate($perPage)
        );
    }

    public function store(StoreUserRequest $request)
    {
        $storeId = $this->currentStoreId($request);
        $data = $request->validated();
        $roleIds = $this->validatedStoreRoleIds($data['role_ids'] ?? [], $storeId);
        $email = strtolower(trim((string) $data['email']));

        $this->abortIfPlanLimitReached(
            'max_staff_users',
            User::where('store_id', $storeId)->count()
        );

        $user = DB::transaction(function () use ($data, $email, $roleIds, $storeId): User {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'store_id' => $storeId,
                'name' => $data['name'],
                'email' => $email,
                'password' => $data['password'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $user->roles()->sync($roleIds);

            return $user;
        });

        return (new UserResource($user->load('roles')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, int $id)
    {
        $user = User::query()
            ->with('roles')
            ->where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $storeId = $this->currentStoreId($request);
        $user = User::where('store_id', $storeId)->findOrFail($id);
        $data = $request->validated();

        if (
            $request->user()->id === $user->id
            && array_key_exists('is_active', $data)
            && $data['is_active'] === false
        ) {
            abort(422, 'No puedes desactivar tu propia cuenta.');
        }

        $roleIds = array_key_exists('role_ids', $data)
            ? $this->validatedStoreRoleIds($data['role_ids'], $storeId)
            : null;

        DB::transaction(function () use ($data, $roleIds, $user): void {
            $userData = collect($data)
                ->only(['name', 'is_active'])
                ->toArray();

            if (array_key_exists('email', $data)) {
                $userData['email'] = strtolower(trim((string) $data['email']));
            }

            if (!empty($data['password'])) {
                $userData['password'] = $data['password'];
                $userData['remember_token'] = null;
                $user->tokens()->delete();
            }

            if ($userData !== []) {
                $user->update($userData);
            }

            if ($roleIds !== null) {
                $user->roles()->sync($roleIds);
            }
        });

        return new UserResource($user->fresh()->load('roles'));
    }

    public function destroy(Request $request, int $id)
    {
        $user = User::where('store_id', $this->currentStoreId($request))
            ->findOrFail($id);

        if ($request->user()->id === $user->id) {
            abort(422, 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente.',
        ]);
    }

    /**
     * Defense in depth: solo permite roles pertenecientes a la tienda actual.
     * Nunca permite que un endpoint tenant asigne roles globales como super-admin.
     */
    private function validatedStoreRoleIds(array $roleIds, int $storeId): array
    {
        $roleIds = array_values(array_unique(array_map('intval', $roleIds)));

        if ($roleIds === []) {
            return [];
        }

        $validCount = Role::query()
            ->withoutGlobalScopes()
            ->whereIn('id', $roleIds)
            ->where('store_id', $storeId)
            ->whereNull('deleted_at')
            ->count();

        if ($validCount !== count($roleIds)) {
            throw ValidationException::withMessages([
                'role_ids' => 'Solo puedes asignar roles de la tienda actual.',
            ]);
        }

        return $roleIds;
    }
}
