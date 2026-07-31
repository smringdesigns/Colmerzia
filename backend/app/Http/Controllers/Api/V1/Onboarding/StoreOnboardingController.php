<?php

namespace App\Http\Controllers\Api\V1\Onboarding;

use App\Http\Controllers\Controller;
use App\Contracts\Onboarding\StoreOnboardingServiceInterface;
use App\Http\Requests\Onboarding\StoreOnboardingRequest;
use App\Http\Resources\Onboarding\StoreOnboardingResource;

class StoreOnboardingController extends Controller
{
    public function __construct(
        private readonly StoreOnboardingServiceInterface $onboardingService
    ) {
    }

    public function store(StoreOnboardingRequest $request)
    {
        $data = new StoreOnboardingResource(
            $this->onboardingService->register(
                $request->business_name,
                $request->subdomain,
                $request->owner_name,
                $request->email,
                $request->password,
                $request->plan_slug
            )
        );

        return $data->response()->setStatusCode(201);
    }
}
