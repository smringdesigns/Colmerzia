<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'store_id'    => null,
            'uuid'        => Str::uuid(),
            'name'        => $name,
            'slug'        => Str::slug($name),
            'description' => fake()->sentence(),
            'logo'        => null,
            'website'     => fake()->url(),
            'is_active'   => true,
        ];
    }
}