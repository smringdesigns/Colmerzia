<?php

namespace Tests\Feature\Middleware;

use App\Models\Store;
use App\Models\Subscription;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * EnsureFeatureAvailable todavía no está enganchado a ninguna ruta
 * real (no existe CouponController ni DiscountRuleController todavía).
 * Para probarlo sin inventar un controller completo, registramos una
 * ruta sintética mínima solo para este test.
 */
class EnsureFeatureAvailableTest extends TestCase
{
    use RefreshDatabase;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->store = Store::factory()->create([
            'subdomain' => 'tienda-a',
            'is_active' => true,
        ]);

        Route::prefix('v1')->middleware(['tenant', 'store.active'])->group(function () {
            Route::get('/_test/coupons-only', function () {
                return response()->json(['ok' => true]);
            })->middleware('feature:coupons');
        });

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function url(): string
    {
        return 'http://tienda-a.localhost/api/v1/_test/coupons-only';
    }

    public function test_bloquea_si_el_plan_no_incluye_la_funcion(): void
    {
        Subscription::factory()->for($this->store)->create(); // free: sin coupons

        $response = $this->getJson($this->url());

        $response->assertStatus(403);
    }

    public function test_permite_si_el_plan_incluye_la_funcion(): void
    {
        Subscription::factory()->for($this->store)->plan('starter')->create(); // starter: con coupons

        $response = $this->getJson($this->url());

        $response->assertOk();
    }
}
