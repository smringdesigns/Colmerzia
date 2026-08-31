<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = Permission::query()->get();

        $role = Role::query()
            ->withoutGlobalScopes()
            ->withTrashed()
            ->firstOrCreate(
                [
                    'store_id' => null,
                    'slug' => 'super-admin',
                ],
                [
                    'uuid' => (string) Str::uuid(),
                    'name' => 'Super-admin',
                    'is_system' => true,
                ]
            );

        if ($role->trashed()) {
            $role->restore();
        }

        $role->forceFill([
            'store_id' => null,
            'slug' => 'super-admin',
            'name' => 'Super-admin',
            'is_system' => true,
        ])->save();

        $role->permissions()->sync($permissions->modelKeys());
    }
}
