<?php

namespace Tests\Concerns;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Helper para tests de endpoints: crea un usuario de una tienda dada,
 * con un rol propio que tiene exactamente los permisos indicados.
 *
 * No usa roles de sistema (super-admin) a propósito: la idea es probar
 * el camino "normal" de permisos, no el bypass de Gate::before().
 */
trait CreatesStoreUsers
{
    protected function createUserWithPermissions(Store $store, array $permissionSlugs): User
    {
        Subscription::firstOrCreate(
            ['store_id' => $store->id],
            [
                'plan_slug' => 'free',
                'status' => Subscription::STATUS_TRIALING,
                'trial_ends_at' => now()->addDays(60),
            ]
        );

        $user = User::factory()->create([
            'store_id' => $store->id,
            'is_active' => true,
        ]);

        $role = Role::create([
            'store_id' => $store->id,
            'uuid' => Str::uuid(),
            'name' => 'Rol de prueba',
            'slug' => 'test-role-' . Str::random(8),
            'is_system' => false,
        ]);

        foreach ($permissionSlugs as $slug) {
            $permission = Permission::firstOrCreate(
                ['slug' => $slug],
                ['uuid' => Str::uuid(), 'name' => $slug]
            );

            $role->permissions()->attach($permission->id);
        }

        $role->users()->attach($user->id);

        return $user;
    }
}
