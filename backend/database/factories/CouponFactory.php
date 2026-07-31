<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid(),
            'code' => strtoupper(fake()->unique()->bothify('CODE-####')),
            'name' => 'Cupón de prueba',
            'type' => 'percentage',
            'value' => 10,
            'minimum_amount' => null,
            'maximum_discount' => null,
            'usage_limit' => null,
            'used_count' => 0,
            'once_per_customer' => false,
            'is_active' => true,
            'starts_at' => null,
            'expires_at' => null,
        ];
    }

    public function percentage(float $value, ?float $maximumDiscount = null): static
    {
        return $this->state(fn () => [
            'type' => 'percentage',
            'value' => $value,
            'maximum_discount' => $maximumDiscount,
        ]);
    }

    public function fixed(float $value): static
    {
        return $this->state(fn () => [
            'type' => 'fixed',
            'value' => $value,
        ]);
    }

    public function minimumAmount(float $amount): static
    {
        return $this->state(fn () => ['minimum_amount' => $amount]);
    }

    public function expired(): static
    {
        return $this->state(fn () => ['expires_at' => now()->subDay()]);
    }
}
