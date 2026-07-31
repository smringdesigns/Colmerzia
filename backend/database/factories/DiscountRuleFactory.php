<?php

namespace Database\Factories;

use App\Models\DiscountRule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DiscountRuleFactory extends Factory
{
    protected $model = DiscountRule::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid(),
            'name' => 'Regla de prueba',
            'type' => 'percentage',
            'value' => 5,
            'priority' => 0,
            'is_stackable' => false,
            'is_active' => true,
            'conditions' => null,
            'actions' => null,
            'starts_at' => null,
            'expires_at' => null,
            'usage_limit' => null,
            'used_count' => 0,
        ];
    }

    public function percentage(float $value, int $priority = 0): static
    {
        return $this->state(fn () => [
            'type' => 'percentage',
            'value' => $value,
            'priority' => $priority,
        ]);
    }

    public function fixed(float $value, int $priority = 0): static
    {
        return $this->state(fn () => [
            'type' => 'fixed',
            'value' => $value,
            'priority' => $priority,
        ]);
    }

    public function minimumAmount(float $amount): static
    {
        return $this->state(fn () => [
            'conditions' => ['minimum_amount' => $amount],
        ]);
    }
}
