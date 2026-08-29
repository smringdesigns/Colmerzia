<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Tienda principal
        |--------------------------------------------------------------------------
        */

        $store = Store::where('subdomain', 'colmerzia')->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Rol de super administrador
        |--------------------------------------------------------------------------
        */

        // El rol super-admin es un rol de plataforma: store_id = NULL
        // a propósito (ver el comentario en RoleSeeder.php sobre por
        // qué). No busques por $store->id acá.
        $role = Role::whereNull('store_id')
            ->where('slug', 'super-admin')
            ->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Crear o recuperar usuario administrador
        |--------------------------------------------------------------------------
        |
        | El correo electrónico es único en toda la plataforma.
        | Por eso primero buscamos el usuario existente.
        |
        */

        $user = User::firstOrCreate(
            [
                'email' => 'elmusdevops@gmail.com',
            ],
            [
                'store_id' => $store->id,
                'uuid' => (string) Str::uuid(),
                'name' => 'Super Administrador',
                'email_verified_at' => now(),
                'password' => Hash::make('Root123'),
                'is_active' => true,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Mantener el usuario asociado a la tienda principal
        |--------------------------------------------------------------------------
        */

        if ($user->store_id !== $store->id) {
            $user->store_id = $store->id;
            $user->save();
        }

        /*
        |--------------------------------------------------------------------------
        | Mantener el usuario como super administrador
        |--------------------------------------------------------------------------
        |
        | syncWithoutDetaching evita duplicar la relación en role_user.
        |
        */

        $user->roles()->syncWithoutDetaching([
            $role->id,
        ]);
    }
}