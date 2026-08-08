<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::factory()->create([
            'name' => 'Colmerzia',
            'subdomain' => 'colmerzia',
            'email' => 'elmusdevops@gmail.com',
        ]);

        // Sin esto, EnsureSubscriptionIsWritable bloquea cualquier
        // escritura (crear productos, staff, bodegas, etc.) en la
        // tienda semilla: ninguna petición no-GET funcionaría en local.
        Subscription::factory()->for($store)->plan('business')->create();

        $store->settings()->create([
            'currency' => 'COP',
            'timezone' => 'America/Bogota',
        ]);
    }
}
