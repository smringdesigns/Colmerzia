<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Ejecuta los seeders necesarios para dejar
     * la aplicación lista para trabajar.
     */
    public function run(): void
    {
        $this->call([
            // ---------------------------------------------------------
            // TIENDAS
            // ---------------------------------------------------------
            // Crea las tiendas base necesarias para el sistema.
            StoreSeeder::class,

            // ---------------------------------------------------------
            // PERMISOS
            // ---------------------------------------------------------
            // Permisos del sistema utilizados por Spatie Permission.
            PermissionSeeder::class,

            // ---------------------------------------------------------
            // ROLES
            // ---------------------------------------------------------
            // Roles y asignación de permisos.
            RoleSeeder::class,

            // ---------------------------------------------------------
            // USUARIOS
            // ---------------------------------------------------------
            // Usuarios iniciales / administrativos.
            UserSeeder::class,

            // ---------------------------------------------------------
            // DATOS DE PRUEBA
            // ---------------------------------------------------------
            // Desactivados para NO crear información ficticia.
            //
            // CatalogSeeder::class,
            // CustomerSeeder::class,
        ]);
    }
}