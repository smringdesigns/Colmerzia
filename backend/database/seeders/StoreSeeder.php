<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use RuntimeException;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('SEED_STORE_EMAIL');

        if (!is_string($email) || trim($email) === '') {
            throw new RuntimeException(
                'SEED_STORE_EMAIL debe estar definido para ejecutar StoreSeeder.'
            );
        }

        /*
         * Tienda principal para desarrollo local.
         *
         * No se crean productos, categorías, clientes ni
         * otros datos ficticios desde este seeder.
         */
        $store = Store::firstOrCreate(
            [
                'subdomain' => 'colmerzia',
            ],
            [
                'name' => 'Colmerzia',
                'email' => strtolower(trim($email)),
                'is_active' => true,
                'is_verified' => true,
                'business_type' => 'retail',
            ]
        );

        /*
         * La aplicación necesita una suscripción para permitir
         * operaciones de escritura en la tienda.
         *
         * Si ya existe, no crea otra.
         */
        if (! $store->subscription()->exists()) {
            Subscription::factory()
                ->for($store)
                ->plan('business')
                ->create();
        }

        /*
         * Configuración básica de la tienda.
         *
         * Solo se crea si todavía no existe.
         */
        if (! $store->settings()->exists()) {
            $store->settings()->create([
                'currency' => 'COP',
                'timezone' => 'America/Bogota',
            ]);
        }
    }
}