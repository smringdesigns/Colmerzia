<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use RuntimeException;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $email = strtolower(trim('elmusdevops@gmail.com'));
        $password = env('SEED_ADMIN_PASSWORD');

        if (!is_string($password) || trim($password) === '') {
            throw new RuntimeException(
                'SEED_ADMIN_PASSWORD debe estar definido para ejecutar UserSeeder.'
            );
        }

        $role = Role::query()
            ->withoutGlobalScopes()
            ->whereNull('store_id')
            ->whereNull('deleted_at')
            ->whereRaw('LOWER(BTRIM(slug)) = ?', ['super-admin'])
            ->firstOrFail();

        $user = User::withTrashed()->firstOrCreate(
            [
                'email' => $email,
            ],
            [
                'store_id' => null,
                'uuid' => (string) Str::uuid(),
                'name' => 'Super Administrador',
                'email_verified_at' => now(),
                'password' => Hash::make($password),
                'is_active' => true,
            ]
        );

        if ($user->trashed()) {
            $user->restore();
        }

        $user->forceFill([
            'store_id' => null,
            'email' => $email,
            'name' => 'Super Administrador',
            'email_verified_at' => $user->email_verified_at ?? now(),
            'is_active' => true,
        ])->save();

        $user->roles()->syncWithoutDetaching([$role->id]);
    }
}
