<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // Usuarios
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // Roles
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',

            // Productos
            'products.view',
            'products.create',
            'products.update',
            'products.delete',

            // Categorías
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // Marcas
            'brands.view',
            'brands.create',
            'brands.update',
            'brands.delete',

            // Inventario
            'inventory.view',
            'inventory.create',
            'inventory.update',

            // Clientes
            'customers.view',
            'customers.create',
            'customers.update',
            'customers.delete',

            // Pedidos
            'orders.view',
            'orders.create',
            'orders.update',
            'orders.delete',

            // Pagos
            'payments.view',
            'payments.create',
            'payments.update',

            // Configuración
            'settings.view',
            'settings.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                [
                    'slug' => $permission,
                ],
                [
                    'uuid' => Str::uuid(),
                    'name' => ucwords(str_replace('.', ' ', $permission)),
                ]
            );
        }
    }
}