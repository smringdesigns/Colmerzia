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
            | OJO -- super-admin es la ÚNICA excepción que va con
            | store_id = NULL. Es un rol de plataforma, no de una
            | tienda puntual: BelongsToStoreOrNullScope (ver
            | app/Models/Scopes/BelongsToStoreOrNullScope.php) filtra
            | roles por "store_id = tienda_actual OR store_id IS NULL"
            | -- si este rol quedara con store_id = $store->id (la
            | tienda "colmerzia" de desarrollo), un super-admin dejaría
            | de "verse a sí mismo" como super-admin apenas entrara a
            | CUALQUIER OTRA tienda (ej. con switchToStore() desde el
            | panel de plataforma), porque la query de sus roles
            | quedaría filtrada a la tienda a la que entró. Eso rompía
            | Gate::before() en AppServiceProvider (el bypass de
            | super-admin) y todo terminaba en 403 en absolutamente
            | todo -- productos, clientes, pedidos, todo.
            |
            */

            $roleStoreId = $roleSlug === 'super-admin' ? null : $store->id;

            $role = Role::firstOrCreate(
                [
                    'store_id' => $roleStoreId,
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

                        'categories.view',

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