<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id'   => null,
            'uuid'       => Str::uuid(),
            'first_name' => fake()->firstName(),
            'last_name'  => fake()->lastName(),
            'email'      => fake()->unique()->safeEmail(),
            'phone'      => fake()->phoneNumber(),
            'is_active'  => true,
        ];
    }
}