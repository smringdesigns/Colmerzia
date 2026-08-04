<?php

namespace Tests\Feature\Inventory;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Store;
use App\Services\Inventory\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    private Store $store;
    private InventoryService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::factory()->create();
        $this->service = app(InventoryService::class);
    }

    public function test_crea_la_bodega_por_defecto_la_primera_vez_que_se_pide(): void
    {
        $this->assertDatabaseCount('warehouses', 0);

        $warehouse = $this->service->defaultWarehouse($this->store->id);

        $this->assertTrue($warehouse->is_default);
        $this->assertDatabaseCount('warehouses', 1);
    }

    public function test_pedir_la_bodega_por_defecto_dos_veces_no_duplica(): void
    {
        $first = $this->service->defaultWarehouse($this->store->id);
        $second = $this->service->defaultWarehouse($this->store->id);

        $this->assertSame($first->id, $second->id);
        $this->assertDatabaseCount('warehouses', 1);
    }

    public function test_setQuantity_deja_un_movimiento_de_auditoria(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $warehouse = $this->service->defaultWarehouse($this->store->id);

        $inventory = $this->service->setQuantity($warehouse, $product->id, null, 50);

        $this->assertSame(50, $inventory->quantity);

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'type' => InventoryMovement::TYPE_ADJUSTMENT,
            'stock_before' => 0,
            'stock_after' => 50,
        ]);
    }

    public function test_setQuantity_no_crea_movimiento_si_la_cantidad_no_cambia(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $warehouse = $this->service->defaultWarehouse($this->store->id);

        $this->service->setQuantity($warehouse, $product->id, null, 30);
        $this->service->setQuantity($warehouse, $product->id, null, 30); // mismo valor

        $this->assertDatabaseCount('inventory_movements', 1);
    }

    public function test_decrementForSale_reduce_quantity_y_registra_referencia(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $warehouse = $this->service->defaultWarehouse($this->store->id);
        $this->service->setQuantity($warehouse, $product->id, null, 20);

        $inventory = $this->service->lockAndAssertAvailable($this->store->id, $product->id, null, 5);
        $this->service->decrementForSale($inventory, 5, 'ORD-TEST-1');

        $this->assertSame(15, $inventory->fresh()->quantity);

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $inventory->id,
            'type' => 'out',
            'reference' => 'ORD-TEST-1',
        ]);
    }

    public function test_restockForCancellation_devuelve_stock(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $warehouse = $this->service->defaultWarehouse($this->store->id);
        $this->service->setQuantity($warehouse, $product->id, null, 10);

        $inventory = $this->service->lockAndAssertAvailable($this->store->id, $product->id, null, 3);
        $this->service->decrementForSale($inventory, 3, 'ORD-TEST-2');

        $this->assertSame(7, $this->service->availableStock($this->store->id, $product->id, null));

        $this->service->restockForCancellation($this->store->id, $product->id, null, 3, 'ORD-TEST-2');

        $this->assertSame(10, $this->service->availableStock($this->store->id, $product->id, null));
    }

    public function test_reserved_reduce_lo_disponible(): void
    {
        $product = Product::factory()->create(['store_id' => $this->store->id]);
        $warehouse = $this->service->defaultWarehouse($this->store->id);
        $inventory = $this->service->setQuantity($warehouse, $product->id, null, 10);

        $inventory->update(['reserved' => 4]);

        $this->assertSame(6, $this->service->availableStock($this->store->id, $product->id, null));
    }
}
