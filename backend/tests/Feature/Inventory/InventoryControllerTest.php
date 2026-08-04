<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\Store;
use App\Models\Subscription;
use App\Services\Inventory\InventoryService;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

class InventoryControllerTest extends TestCase
{
    use RefreshDatabase;
    use CreatesStoreUsers;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->store = Store::factory()->create(['subdomain' => 'tienda-a', 'is_active' => true]);
        Subscription::factory()->for($this->store)->create();

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

    public function test_lista_el_inventario_de_la_bodega_por_defecto(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id, 'name' => 'Camiseta']);

        app(InventoryService::class)->setQuantity(
            app(InventoryService::class)->defaultWarehouse($this->store->id),
            $product->id,
            null,
            25
        );

        $user = $this->createUserWithPermissions($this->store, ['inventory.view']);

        $response = $this->actingAs($user, 'sanctum')->getJson($this->url('/inventory'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.quantity', 25);
        $response->assertJsonPath('data.0.product_name', 'Camiseta');
    }

    public function test_ajustar_cantidad_deja_movimiento_y_actualiza_disponible(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);

        $service = app(InventoryService::class);
        $warehouse = $service->defaultWarehouse($this->store->id);
        $inventory = $service->setQuantity($warehouse, $product->id, null, 10);

        $user = $this->createUserWithPermissions($this->store, ['inventory.update']);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/inventory/{$inventory->id}"), [
                'quantity' => 40,
                'reason' => 'Conteo físico',
            ]);

        $response->assertOk();
        $response->assertJsonPath('quantity', 40);

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'stock_before' => 10,
            'stock_after' => 40,
            'reason' => 'Conteo físico',
        ]);
    }

    public function test_no_puede_ajustar_inventario_de_otra_tienda(): void
    {
        $storeB = Store::factory()->create(['subdomain' => 'tienda-b']);
        Subscription::factory()->for($storeB)->create();

        $productB = Product::factory()->create(['store_id' => $storeB->id]);
        $service = app(InventoryService::class);
        $inventoryB = $service->setQuantity($service->defaultWarehouse($storeB->id), $productB->id, null, 5);

        $user = $this->createUserWithPermissions($this->store, ['inventory.update']);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/inventory/{$inventoryB->id}"), ['quantity' => 999]);

        $response->assertNotFound();
    }

    public function test_movimientos_devuelve_el_historial_mas_reciente_primero(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $service = app(InventoryService::class);
        $warehouse = $service->defaultWarehouse($this->store->id);

        $inventory = $service->setQuantity($warehouse, $product->id, null, 10);
        $service->setQuantity($warehouse, $product->id, null, 20);

        $user = $this->createUserWithPermissions($this->store, ['inventory.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url("/inventory/{$inventory->id}/movements"));

        $response->assertOk();
        $response->assertJsonCount(2);
        $response->assertJsonPath('0.stock_after', 20); // el más reciente primero
    }
}
