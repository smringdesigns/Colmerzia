<?php

namespace App\Http\Resources\Platform;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class StorePlatformResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'uuid' => $this->uuid,

            'name' => $this->name,

            'email' => $this->email,

            'subdomain' => $this->subdomain,

            'custom_domain' => $this->custom_domain,

            'business_type' => $this->business_type,

            'is_active' => (bool) $this->is_active,

            'is_verified' => (bool) $this->is_verified,

            'created_at' => $this->created_at,

            /*
            |--------------------------------------------------------------------------
            | Conteos (solo se calculan si el controller pidió withCount)
            |--------------------------------------------------------------------------
            */

            'users_count' => $this->when(
                isset($this->users_count),
                fn () => $this->users_count
            ),

            'products_count' => $this->when(
                isset($this->products_count),
                fn () => $this->products_count
            ),

            'categories_count' => $this->when(
                isset($this->categories_count),
                fn () => $this->categories_count
            ),

            /*
            |--------------------------------------------------------------------------
            | Suscripción
            |--------------------------------------------------------------------------
            */

            'subscription' => $this->whenLoaded('subscription', function () {

                if (!$this->subscription) {
                    return null;
                }

                return [
                    'plan_slug' => $this->subscription->plan_slug,
                    'status' => $this->subscription->status,
                    'trial_ends_at' => $this->subscription->trial_ends_at,
                    'current_period_ends_at' => $this->subscription->current_period_ends_at,
                ];
            }),

            /*
            |--------------------------------------------------------------------------
            | Configuración (solo en el detalle, no en el listado)
            |--------------------------------------------------------------------------
            */

            'settings' => $this->whenLoaded('settings', function () {

                if (!$this->settings) {
                    return null;
                }

                return [
                    'currency' => $this->settings->currency,
                    'timezone' => $this->settings->timezone,
                    'logo_path' => $this->settings->logo_path,
                ];
            }),

        ];
    }
}
