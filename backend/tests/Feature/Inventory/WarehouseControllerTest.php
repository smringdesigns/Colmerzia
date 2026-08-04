<?php

namespace Tests\Feature\Inventory;

use App\Models\Store;
use App\Models\Subscription;
use App\Models\Warehouse;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

class WarehouseControllerTest extends TestCase
{
    use RefreshDatabase;
    use CreatesStoreUsers;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->store = Store::factory()->create(['subdomain' => 'tienda-a', 'is_active' => true]);

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

    public function test_index_crea_la_bodega_por_defecto_si_no_existe_ninguna(): void
    {
        Subscription::factory()->for($this->store)->create();
        $user = $this->createUserWithPermissions($this->store, ['inventory.view']);

        $response = $this->actingAs($user, 'sanctum')->getJson($this->url('/warehouses'));

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonPath('0.is_default', true);
    }

    public function test_plan_free_no_permite_crear_una_segunda_bodega(): void
    {
        Subscription::factory()->for($this->store)->create(); // free: max_warehouses=1, sin multi_warehouse
        $user = $this->createUserWithPermissions($this->store, ['inventory.view', 'inventory.create']);

        // La primera (por defecto) se crea sola al listar.
        $this->actingAs($user, 'sanctum')->getJson($this->url('/warehouses'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/warehouses'), ['name' => 'Bodega 2', 'code' => 'WH2']);

        $response->assertStatus(403);
    }

    public function test_plan_pro_si_permite_crear_una_segunda_bodega(): void
    {
        Subscription::factory()->for($this->store)->plan('pro')->create(); // pro: multi_warehouse=true
        $user = $this->createUserWithPermissions($this->store, ['inventory.view', 'inventory.create']);

        $this->actingAs($user, 'sanctum')->getJson($this->url('/warehouses'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/warehouses'), ['name' => 'Bodega 2', 'code' => 'WH2']);

        $response->assertCreated();
        $response->assertJsonPath('is_default', false);
    }

    public function test_make_default_cambia_la_bodega_por_defecto(): void
    {
        Subscription::factory()->for($this->store)->plan('pro')->create();
        $user = $this->createUserWithPermissions($this->store, ['inventory.view', 'inventory.create', 'inventory.update']);

        $this->actingAs($user, 'sanctum')->getJson($this->url('/warehouses'));

        $second = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('/warehouses'), ['name' => 'Bodega 2', 'code' => 'WH2']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url("/warehouses/{$second->json('id')}/make-default"));

        $response->assertOk();
        $response->assertJsonPath('is_default', true);

        $original = Warehouse::where('store_id', $this->store->id)->where('code', 'PRINCIPAL')->first();
        $this->assertFalse($original->fresh()->is_default);
    }

    public function test_no_se_puede_eliminar_la_bodega_por_defecto(): void
    {
        Subscription::factory()->for($this->store)->create();
        $user = $this->createUserWithPermissions($this->store, ['inventory.view', 'inventory.update']);

        $index = $this->actingAs($user, 'sanctum')->getJson($this->url('/warehouses'));
        $defaultId = $index->json('0.id');

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson($this->url("/warehouses/{$defaultId}"));

        $response->assertStatus(422);
    }
}
