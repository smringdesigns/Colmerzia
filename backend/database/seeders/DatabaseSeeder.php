<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Permisos globales de la plataforma.
            PermissionSeeder::class,

            // Crea únicamente el super-admin global con store_id = NULL.
            RoleSeeder::class,

            // Crea el administrador global con store_id = NULL.
            UserSeeder::class,
        ]);
    }
}
