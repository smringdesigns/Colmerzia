<?php

namespace App\Contracts\Onboarding;

use App\DTOs\Onboarding\StoreOnboardingResponseDTO;

interface StoreOnboardingServiceInterface
{
    public function register(
        string $businessName,
        string $subdomain,
        string $ownerName,
        string $email,
        string $password,
        string $planSlug,
        string $businessType
    ): StoreOnboardingResponseDTO;
}
