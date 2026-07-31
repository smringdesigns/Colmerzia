<?php

namespace App\Services\Onboarding;

use App\Contracts\Onboarding\StoreOnboardingServiceInterface;
use App\DTOs\Onboarding\StoreOnboardingResponseDTO;
use App\Models\Role;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Support\Plans\PlanRegistry;
use App\Support\Tenancy\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StoreOnboardingService implements StoreOnboardingServiceInterface
{
    public function register(
        string $businessName,
        string $subdomain,
        string $ownerName,
        string $email,
        string $password,
        string $planSlug
    ): StoreOnboardingResponseDTO
    {
        // Crear una tienda nueva solo tiene sentido desde el dominio
        // central. Hacerlo "dentro" del subdominio de otra tienda no
        // tiene un caso de uso legítimo.
        if (Tenant::check()) {
            throw ValidationException::withMessages([
                'subdomain' => 'El registro de una tienda nueva debe hacerse desde el dominio principal.',
            ]);
        }

        return DB::transaction(function () use (
            $businessName,
            $subdomain,
            $ownerName,
            $email,
            $password,
            $planSlug
        ) {
            $store = Store::create([
                'uuid' => Str::uuid(),
                'name' => $businessName,
                'slug' => Str::slug($businessName) . '-' . Str::random(6),
                'email' => strtolower(trim($email)),
                'subdomain' => $subdomain,
                'is_active' => true,
                'is_verified' => false,
            ]);

            $subscription = Subscription::create(
                $this->initialSubscriptionAttributes($store->id, $planSlug)
            );

            $owner = User::create([
                'uuid' => Str::uuid(),
                'store_id' => $store->id,
                'name' => $ownerName,
                'email' => strtolower(trim($email)),
                'password' => $password,
                'is_active' => true,
            ]);

            $ownerRole = Role::create([
                'store_id' => $store->id,
                'uuid' => Str::uuid(),
                'name' => 'Dueño de la tienda',
                'slug' => 'store-owner',
                'is_system' => true,
            ]);

            $ownerRole->users()->attach($owner->id);

            $token = $owner
                ->createToken('colmerzia')
                ->plainTextToken;

            return new StoreOnboardingResponseDTO(
                store: $store,
                subscription: $subscription,
                owner: $owner,
                token: $token
            );
        });
    }

    /**
     * Estado inicial de la suscripción según el plan elegido.
     *
     * NOTA: todavía no hay pasarela de pago integrada. Elegir un plan
     * pago acá lo activa de inmediato en modo "confianza" (a la
     * espera de facturación manual); el plan Free arranca con el
     * período de prueba definido en config/plans.php. Antes de un
     * lanzamiento real, esto debería reemplazarse por un flujo real
     * de checkout/verificación de pago.
     */
    private function initialSubscriptionAttributes(int $storeId, string $planSlug): array
    {
        $trialDays = PlanRegistry::trialDays($planSlug);

        if ($trialDays !== null) {
            return [
                'store_id' => $storeId,
                'plan_slug' => $planSlug,
                'status' => Subscription::STATUS_TRIALING,
                'trial_ends_at' => now()->addDays($trialDays),
            ];
        }

        return [
            'store_id' => $storeId,
            'plan_slug' => $planSlug,
            'status' => Subscription::STATUS_ACTIVE,
            'current_period_ends_at' => null,
        ];
    }
}
