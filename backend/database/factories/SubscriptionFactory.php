<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'plan_slug' => 'free',
            'status' => Subscription::STATUS_TRIALING,
            'trial_ends_at' => now()->addDays(60),
            'current_period_ends_at' => null,
        ];
    }

    public function readOnly(): static
    {
        return $this->state(fn () => [
            'status' => Subscription::STATUS_READ_ONLY,
            'trial_ends_at' => now()->subDay(),
        ]);
    }

    public function plan(string $slug): static
    {
        return $this->state(fn () => [
            'plan_slug' => $slug,
            'status' => Subscription::STATUS_ACTIVE,
            'trial_ends_at' => null,
            'current_period_ends_at' => now()->addMonth(),
        ]);
    }
}
