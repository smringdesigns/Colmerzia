<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // usuarios
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // roles
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',

            // productos
            'products.view',
            'products.create',
            'products.update',
            'products.delete',

            // categorías
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // marcas
            'brands.view',
            'brands.create',
            'brands.update',
            'brands.delete',

            // inventario
            'inventory.view',
            'inventory.create',
            'inventory.update',

            // clientes
            'customers.view',
            'customers.create',
            'customers.update',
            'customers.delete',

            // pedidos
            'orders.view',
            'orders.create',
            'orders.update',
            'orders.delete',

            // pagos
            'payments.view',
            'payments.create',
            'payments.update',

            // configuración
            'settings.view',
            'settings.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'slug' => $permission,
            ], [
                'uuid' => Str::uuid(),
                'name' => ucwords(str_replace('.', ' ', $permission)),
            ]);
        }
    }
}
