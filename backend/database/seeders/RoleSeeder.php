<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Obtener la tienda principal
        |--------------------------------------------------------------------------
        |
        | El seeder trabaja sobre la tienda principal de desarrollo.
        |
        */

        $store = Store::where('subdomain', 'colmerzia')->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Obtener todos los permisos
        |--------------------------------------------------------------------------
        */

        $permissions = Permission::all();

        /*
        |--------------------------------------------------------------------------
        | Roles del sistema
        |--------------------------------------------------------------------------
        |
        | Estos son los roles base que necesita Colmerzia.
        |
        */

        $roles = [
            'super-admin',
            'admin',
            'employee',
        ];

        foreach ($roles as $roleSlug) {

            /*
            |--------------------------------------------------------------------------
            | Buscar el rol o crearlo
            |--------------------------------------------------------------------------
            |
            | Evita errores de duplicados al ejecutar varias veces:
            |
            | roles_store_id_slug_unique
            |
            */

            $role = Role::firstOrCreate(
                [
                    'store_id' => $store->id,
                    'slug' => $roleSlug,
                ],
                [
                    'uuid' => (string) Str::uuid(),
                    'name' => match ($roleSlug) {
                        'super-admin' => 'Super-admin',
                        'admin' => 'Admin',
                        'employee' => 'Employee',
                        default => ucfirst($roleSlug),
                    },
                    'is_system' => true,
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | Super administrador
            |--------------------------------------------------------------------------
            |
            | Tiene todos los permisos disponibles.
            |
            */

            if ($roleSlug === 'super-admin') {

                $role->permissions()->sync(
                    $permissions->pluck('id')
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Administrador
            |--------------------------------------------------------------------------
            |
            | Puede administrar la tienda, pero no recibe permisos
            | relacionados con configuración global ni gestión de roles.
            |
            */

            if ($roleSlug === 'admin') {

                $adminPermissions = $permissions->filter(function ($permission) {

                    return ! str_starts_with($permission->slug, 'settings.')
                        && ! str_starts_with($permission->slug, 'roles.');
                });

                $role->permissions()->sync(
                    $adminPermissions->pluck('id')
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Empleado
            |--------------------------------------------------------------------------
            |
            | Permisos básicos para operar productos, inventario,
            | clientes, pedidos y pagos.
            |
            */

            if ($roleSlug === 'employee') {

                $employeePermissions = $permissions->whereIn(
                    'slug',
                    [
                        'products.view',

                        'customers.view',
                        'customers.create',

                        'inventory.view',
                        'inventory.create',
                        'inventory.update',

                        'orders.view',
                        'orders.create',

                        'payments.view',
                        'payments.create',
                    ]
                );

                $role->permissions()->sync(
                    $employeePermissions->pluck('id')
                );
            }
        }
    }
}