<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::first();

        Customer::factory(50)->create([
            'store_id' => $store->id,
        ]);
    }
}