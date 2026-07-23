<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Store;
use App\Models\Permission;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Obtener todos los permisos
        |--------------------------------------------------------------------------
        */

        $permissions = Permission::all();


        /*
        |--------------------------------------------------------------------------
        | Crear roles
        |--------------------------------------------------------------------------
        */

        $roles = [
            'super-admin',
            'admin',
            'employee',
        ];

        foreach ($roles as $roleSlug) {

            $role = Role::create([
                'store_id'  => $store->id,
                'uuid'      => Str::uuid(),
                'name'      => ucfirst($roleSlug),
                'slug'      => $roleSlug,
                'is_system' => true,
            ]);


            /*
            |--------------------------------------------------------------------------
            | Super administrador
            |--------------------------------------------------------------------------
            | Tiene todos los permisos del sistema.
            |--------------------------------------------------------------------------
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
            | Tiene permisos de gestión, pero no necesariamente
            | permisos globales del sistema.
            |--------------------------------------------------------------------------
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
            | Puede consultar y operar sobre productos,
            | inventario y clientes.
            |--------------------------------------------------------------------------
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