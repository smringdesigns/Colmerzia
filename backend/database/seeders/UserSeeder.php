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

        $user = User::create([
            'store_id' => $store->id,
            'uuid' => Str::uuid(),
            'name' => 'Administrador',
            'email' => 'admin@commerzia.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);

        $user->roles()->attach(
            Role::where('slug', 'super-admin')->first()
        );
    }
}