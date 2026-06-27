<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        $color = fake()->randomElement([
            'Negro',
            'Blanco',
            'Azul',
            'Rojo',
        ]);

        $size = fake()->randomElement([
            'S',
            'M',
            'L',
            'XL',
        ]);

        return [
            'product_id' => null,

            'uuid' => Str::uuid(),

            'sku' => strtoupper(
                fake()->unique()->bothify('VAR-#####')
            ),

            // Garantiza unicidad por producto
            'name' => $color.'-'.$size.'-'.Str::upper(Str::random(4)),

            'attributes' => [
                'color' => $color,
                'size'  => $size,
            ],

            'price' => fake()->numberBetween(
                10000,
                500000
            ),

            'compare_price' => fake()->numberBetween(
                10000,
                600000
            ),

            'cost_price' => fake()->numberBetween(
                5000,
                200000
            ),

            'stock' => fake()->numberBetween(
                0,
                100
            ),

            'min_stock' => fake()->numberBetween(
                1,
                10
            ),

            'weight' => fake()->randomFloat(
                2,
                0,
                10
            ),

            'is_active' => true,
        ];
    }
}