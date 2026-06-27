<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'store_id'    => null,
            'parent_id'   => null,
            'uuid'        => Str::uuid(),
            'name'        => ucfirst($name),
            'slug'        => Str::slug($name),
            'description' => fake()->sentence(),
            'image'       => null,
            'is_active'   => true,
            'sort_order'  => fake()->numberBetween(1, 100),
        ];
    }
}