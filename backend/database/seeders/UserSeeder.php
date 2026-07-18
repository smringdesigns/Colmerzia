<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::first();

        $role = Role::where('slug', 'super-admin')->firstOrFail();

        $user = User::create([
            'store_id' => $store->id,
            'uuid' => Str::uuid(),
            'name' => 'Super Administrador',
            'email' => 'elmusdevops@gmail.com',
            'password' => bcrypt('Root123'),
            'is_active' => true,
        ]);

        $user->roles()->attach($role);
    }
}