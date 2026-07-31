<?php

namespace Tests\Feature\Onboarding;

use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreOnboardingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function url(): string
    {
        return 'http://localhost/api/v1/onboarding';
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'business_name' => 'Mi Negocio',
            'subdomain' => 'mi-negocio',
            'owner_name' => 'Dueño Ejemplo',
            'email' => 'dueno@gmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'plan_slug' => 'free',
        ], $overrides);
    }

    public function test_crea_tienda_suscripcion_y_dueno_con_plan_free(): void
    {
        $response = $this->postJson($this->url(), $this->payload());

        $response->assertCreated();
        $response->assertJsonPath('data.store.subdomain', 'mi-negocio');
        $response->assertJsonPath('data.subscription.plan', 'free');
        $response->assertJsonPath('data.subscription.status', Subscription::STATUS_TRIALING);
        $response->assertJsonStructure(['data' => ['store', 'subscription', 'user', 'token']]);

        $this->assertDatabaseHas('stores', ['subdomain' => 'mi-negocio']);
        $this->assertDatabaseHas('subscriptions', [
            'plan_slug' => 'free',
            'status' => Subscription::STATUS_TRIALING,
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'dueno@gmail.com',
        ]);
    }

    public function test_la_prueba_free_dura_60_dias(): void
    {
        $response = $this->postJson($this->url(), $this->payload());

        $store = Store::where('subdomain', 'mi-negocio')->firstOrFail();
        $subscription = $store->subscription;

        $this->assertNotNull($subscription->trial_ends_at);
        $this->assertEqualsWithDelta(
            now()->addDays(60)->timestamp,
            $subscription->trial_ends_at->timestamp,
            5 // margen de segundos por el tiempo que toma correr el test
        );
    }

    public function test_un_plan_pago_arranca_activo_sin_periodo_de_prueba(): void
    {
        $response = $this->postJson($this->url(), $this->payload(['plan_slug' => 'pro']));

        $response->assertCreated();
        $response->assertJsonPath('data.subscription.plan', 'pro');
        $response->assertJsonPath('data.subscription.status', Subscription::STATUS_ACTIVE);

        $store = Store::where('subdomain', 'mi-negocio')->firstOrFail();
        $this->assertNull($store->subscription->trial_ends_at);
    }

    public function test_el_dueno_creado_tiene_el_rol_store_owner(): void
    {
        $this->postJson($this->url(), $this->payload());

        $store = Store::where('subdomain', 'mi-negocio')->firstOrFail();
        $owner = User::where('email', 'dueno@gmail.com')->firstOrFail();

        Tenant::set($store);

        $this->assertTrue($owner->hasRole('store-owner'));

        Tenant::clear();
    }

    public function test_no_se_puede_crear_tienda_estando_dentro_del_subdominio_de_otra(): void
    {
        Store::factory()->create(['subdomain' => 'tienda-existente']);

        $response = $this->postJson(
            'http://tienda-existente.localhost/api/v1/onboarding',
            $this->payload()
        );

        $response->assertStatus(422);
    }

    public function test_no_permite_subdominio_duplicado(): void
    {
        Store::factory()->create(['subdomain' => 'mi-negocio']);

        $response = $this->postJson($this->url(), $this->payload());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('subdomain');
    }

    public function test_no_permite_subdominio_igual_a_un_dominio_central(): void
    {
        $response = $this->postJson($this->url(), $this->payload(['subdomain' => 'localhost']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('subdomain');
    }

    public function test_no_permite_plan_inexistente(): void
    {
        $response = $this->postJson($this->url(), $this->payload(['plan_slug' => 'plan-que-no-existe']));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('plan_slug');
    }

    public function test_el_endpoint_de_onboarding_tambien_tiene_rate_limit(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $response = $this->postJson($this->url(), $this->payload([
                'subdomain' => "negocio-{$i}",
                'email' => "dueno-{$i}@gmail.com",
            ]));

            $response->assertCreated();
        }

        $response = $this->postJson($this->url(), $this->payload([
            'subdomain' => 'negocio-6',
            'email' => 'dueno-6@gmail.com',
        ]));

        $response->assertStatus(429);
    }
}
