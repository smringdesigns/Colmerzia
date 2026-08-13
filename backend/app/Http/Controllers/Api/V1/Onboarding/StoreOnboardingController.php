<?php

namespace App\Http\Controllers\Api\V1\Onboarding;

use App\Http\Controllers\Controller;
use App\Contracts\Onboarding\StoreOnboardingServiceInterface;
use App\Http\Requests\Onboarding\StoreOnboardingRequest;
use App\Http\Resources\Onboarding\StoreOnboardingResource;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Http\Request;

class StoreOnboardingController extends Controller
{
    public function __construct(
        private readonly StoreOnboardingServiceInterface $onboardingService
    ) {
    }

    public function store(StoreOnboardingRequest $request)
    {
        $this->resolvePublicTenant($request);

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

    private function resolvePublicTenant(Request $request): void
    {
        Tenant::clear();

        $subdomain = $request->header('X-Tenant');

        if (is_string($subdomain)) {
            $subdomain = strtolower(trim($subdomain));
        }

        if (!$subdomain) {
            $host = strtolower($request->getHost());
            $centralDomains = config('tenancy.central_domains', []);

            if (!in_array($host, $centralDomains, true)) {
                if (str_ends_with($host, '.localhost')) {
                    $subdomain = substr($host, 0, -strlen('.localhost'));
                } elseif (str_ends_with($host, '.127.0.0.1')) {
                    $subdomain = substr($host, 0, -strlen('.127.0.0.1'));
                } else {
                    $subdomain = explode('.', $host)[0] ?? null;
                }
            }
        }

        if (!$subdomain) {
            return;
        }

        $store = Store::where('subdomain', $subdomain)->first();

        if (!$store) {
            return;
        }

        Tenant::set($store);
        app()->instance('tenant', $store);
        $request->attributes->set('tenant', $store);
    }
}
