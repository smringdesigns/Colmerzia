<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::first();

        $roles = [
            'super-admin',
            'admin',
            'employee',
        ];

        foreach ($roles as $role) {
            Role::create([
                'store_id' => $store->id,
                'uuid' => Str::uuid(),
                'name' => ucfirst($role),
                'slug' => $role,
                'is_system' => true,
            ]);
        }
    }
}