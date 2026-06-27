<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::first();

        // Categorías
        $categories = Category::factory(10)->create([
            'store_id' => $store->id,
        ]);

        // Marcas
        $brands = Brand::factory(20)->create([
            'store_id' => $store->id,
        ]);

        // Productos
        foreach (range(1, 100) as $i) {

            $product = Product::factory()->create([
                'store_id'    => $store->id,
                'category_id' => $categories->random()->id,
                'brand_id'    => $brands->random()->id,
            ]);

            ProductVariant::factory(rand(1, 3))->create([
                'product_id' => $product->id,
            ]);
        }
    }
}