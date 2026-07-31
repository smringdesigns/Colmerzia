<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'uuid'        => Str::uuid(),
            'name'        => $name,
            'slug'        => Str::slug($name),
            'email'       => fake()->unique()->companyEmail(),
            'phone'       => fake()->phoneNumber(),
            'logo'        => null,
            'favicon'     => null,
            'subdomain'   => Str::slug($name) . rand(100,999),
            'country'     => 'CO',
            'currency'    => 'COP',
            'timezone'    => 'America/Bogota',
            'is_active'   => true,
            'is_verified' => true,
            'plan'        => 'pro',
        ];
    }
}
