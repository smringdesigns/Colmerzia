<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'store_id'          => null,
            'category_id'       => null,
            'brand_id'          => null,

            'uuid'              => Str::uuid(),

            'name'              => ucfirst($name),
            'slug'              => Str::slug($name),

            'description'       => fake()->paragraph(),
            'short_description' => fake()->sentence(),

            'sku'               => strtoupper(
                fake()->bothify('SKU-#####')
            ),

            'price'             => fake()->numberBetween(10000, 500000),

            'compare_price'     => fake()->numberBetween(10000, 700000),

            'cost_price'        => fake()->numberBetween(5000, 300000),

            'stock'             => fake()->numberBetween(0, 100),

            'weight'            => fake()->randomFloat(2, 0, 10),

            'featured'          => fake()->boolean(),

            'is_active'         => true,

            'has_variants'      => fake()->boolean(),

            'meta_title'        => null,

            'meta_description'  => null,
        ];
    }
}