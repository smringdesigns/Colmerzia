<?php

namespace Tests\Feature\Http;

use App\Models\Product;
use App\Models\Store;
use App\Models\Subscription;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

/**
 * Cubre EnsureSubscriptionIsWritable y el límite max_products,
 * reutilizando el endpoint real de /products en vez de mockear nada.
 */
class ProductPlanLimitTest extends TestCase
{
    use RefreshDatabase;
    use CreatesStoreUsers;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->store = Store::factory()->create([
            'subdomain' => 'tienda-a',
            'is_active' => true,
        ]);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function url(string $path): string
    {
        return "http://tienda-a.localhost/api/v1{$path}";
    }

    private function validProductPayload(string $sku): array
    {
        return [
            'name' => "Producto {$sku}",
            'sku' => $sku,
            'price' => 10000,
        ];
    }

    // ---------------------------------------------------------------
    // Límite de cantidad (max_products del plan Free = 50)
    // ---------------------------------------------------------------

    public function test_no_se_puede_crear_un_producto_al_alcanzar_el_limite_del_plan(): void
    {
        Subscription::factory()->for($this->store)->create(); // free, trialing

        $user = $this->createUserWithPermissions($this->store, ['products.create']);

        // Llenamos hasta el límite (50) directo en BD, sin pasar por
        // el endpoint, para no hacer 50 peticiones HTTP en el test.
        Product::factory()->count(50)->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/products'), $this->validProductPayload('SKU-LIMITE-1'));

        $response->assertStatus(403);

        $this->assertDatabaseMissing('products', ['sku' => 'SKU-LIMITE-1']);
    }

    public function test_si_puede_crear_por_debajo_del_limite(): void
    {
        Subscription::factory()->for($this->store)->create(); // free, trialing

        $user = $this->createUserWithPermissions($this->store, ['products.create']);

        Product::factory()->count(49)->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/products'), $this->validProductPayload('SKU-LIMITE-2'));

        $response->assertCreated();
    }

    public function test_un_plan_superior_permite_mas_productos(): void
    {
        Subscription::factory()->for($this->store)->plan('pro')->create();

        $user = $this->createUserWithPermissions($this->store, ['products.create']);

        // Por encima del límite del plan Free (50), pero muy por
        // debajo del límite de Pro (5000).
        Product::factory()->count(60)->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/products'), $this->validProductPayload('SKU-PRO-1'));

        $response->assertCreated();
    }

    // ---------------------------------------------------------------
    // Modo solo-lectura (prueba vencida)
    // ---------------------------------------------------------------

    public function test_con_suscripcion_read_only_no_se_puede_crear_pero_si_leer(): void
    {
        Subscription::factory()->for($this->store)->readOnly()->create();

        $user = $this->createUserWithPermissions($this->store, ['products.view', 'products.create']);

        $creacion = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/products'), $this->validProductPayload('SKU-READONLY-1'));

        $lectura = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('/products'));

        $creacion->assertStatus(403);
        $lectura->assertOk();

        $this->assertDatabaseMissing('products', ['sku' => 'SKU-READONLY-1']);
    }

    public function test_con_suscripcion_activa_normal_si_se_puede_crear(): void
    {
        Subscription::factory()->for($this->store)->create(); // trialing, escribible

        $user = $this->createUserWithPermissions($this->store, ['products.create']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/products'), $this->validProductPayload('SKU-NORMAL-1'));

        $response->assertCreated();
    }
}
