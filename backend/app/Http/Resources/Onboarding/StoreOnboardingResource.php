<?php

namespace App\Http\Resources\Onboarding;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use App\Http\Resources\User\UserResource;

class StoreOnboardingResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [

            'store' => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'subdomain' => $this->store->subdomain,
            ],

            'subscription' => [
                'plan' => $this->subscription->plan_slug,
                'status' => $this->subscription->status,
                'trial_ends_at' => $this->subscription->trial_ends_at,
            ],

            'user' => new UserResource(
                $this->owner
            ),

            'token' => $this->token,

        ];
    }
}
