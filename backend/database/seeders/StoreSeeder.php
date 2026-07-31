<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        Store::factory()->create([
            'name' => 'Colmerzia',
            'slug' => 'colmerzia',
            'subdomain' => 'colmerzia',
            'email' => 'elmusdevops@gmail.com',
        ]);
    }
}
