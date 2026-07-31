<?php

namespace App\DTOs\Onboarding;

use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;

final readonly class StoreOnboardingResponseDTO
{
    public function __construct(
        public Store $store,
        public Subscription $subscription,
        public User $owner,
        public string $token,
    ) {
    }
}
