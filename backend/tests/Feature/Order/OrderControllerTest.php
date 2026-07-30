<?php

namespace Tests\Feature\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\Subscription;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

class OrderControllerTest extends TestCase
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

    /**
     * Crea una orden real pasando por el flujo completo de storefront
     * (agregar al carrito + checkout), para no depender de una
     * factory de Order que no existe y probar sobre datos reales.
     */
    private function createRealOrder(Store $store, int $stock = 10, int $price = 10000): array
    {
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'has_variants' => false,
            'stock' => $stock,
            'price' => $price,
        ]);

        $add = $this->postJson(
            "http://{$store->subdomain}.localhost/api/v1/storefront/cart/items",
            ['product_id' => $product->id, 'quantity' => 2]
        );

        $checkout = $this->withHeader('X-Guest-Token', $add->json('guest_token'))
            ->postJson("http://{$store->subdomain}.localhost/api/v1/storefront/checkout", [
                'customer' => ['name' => 'Cliente', 'email' => 'cliente@gmail.com'],
                'shipping_address' => ['line1' => 'Calle 1', 'city' => 'Bogotá', 'country' => 'Colombia'],
            ]);

        $order = Order::where('order_number', $checkout->json('order_number'))->firstOrFail();

        return [$order, $product];
    }

    public function test_lista_solo_los_pedidos_de_la_tienda_del_subdominio(): void
    {
        [$orderA] = $this->createRealOrder($this->store);

        $storeB = Store::factory()->create(['subdomain' => 'tienda-b', 'is_active' => true]);
        Subscription::factory()->for($storeB)->create();
        $this->createRealOrder($storeB);

        $user = $this->createUserWithPermissions($this->store, ['orders.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('/orders'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $orderA->id);
    }

    public function test_ver_detalle_de_un_pedido_incluye_sus_items(): void
    {
        [$order] = $this->createRealOrder($this->store);

        $user = $this->createUserWithPermissions($this->store, ['orders.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url("/orders/{$order->id}"));

        $response->assertOk();
        $response->assertJsonCount(1, 'items');
    }

    public function test_no_puede_ver_un_pedido_de_otra_tienda(): void
    {
        $storeB = Store::factory()->create(['subdomain' => 'tienda-b', 'is_active' => true]);
        Subscription::factory()->for($storeB)->create();
        [$orderB] = $this->createRealOrder($storeB);

        $user = $this->createUserWithPermissions($this->store, ['orders.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url("/orders/{$orderB->id}"));

        $response->assertNotFound();
    }

    public function test_usuario_sin_permiso_orders_view_no_puede_listar(): void
    {
        $user = $this->createUserWithPermissions($this->store, ['products.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('/orders'));

        $response->assertStatus(403);
    }

    public function test_actualizar_a_shipped_setea_shipped_at(): void
    {
        [$order] = $this->createRealOrder($this->store);

        $user = $this->createUserWithPermissions($this->store, ['orders.update']);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/orders/{$order->id}/status"), ['status' => 'shipped']);

        $response->assertOk();
        $response->assertJsonPath('status', 'shipped');
        $this->assertNotNull($order->fresh()->shipped_at);
    }

    public function test_cancelar_un_pedido_repone_el_stock(): void
    {
        [$order, $product] = $this->createRealOrder($this->store, stock: 10);

        $this->assertSame(8, $product->fresh()->stock); // 10 - 2 vendidas

        $user = $this->createUserWithPermissions($this->store, ['orders.update']);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/orders/{$order->id}/status"), ['status' => 'cancelled']);

        $response->assertOk();
        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_cancelar_dos_veces_no_repone_el_stock_dos_veces(): void
    {
        [$order, $product] = $this->createRealOrder($this->store, stock: 10);

        $user = $this->createUserWithPermissions($this->store, ['orders.update']);

        $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/orders/{$order->id}/status"), ['status' => 'cancelled']);

        $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/orders/{$order->id}/status"), ['status' => 'cancelled']);

        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_gestionar_pedidos_funciona_aunque_la_suscripcion_este_en_read_only(): void
    {
        [$order] = $this->createRealOrder($this->store, stock: 10);

        // Ahora la tienda entra en modo solo-lectura (prueba vencida).
        $this->store->subscription()->update([
            'status' => Subscription::STATUS_READ_ONLY,
        ]);

        $user = $this->createUserWithPermissions($this->store, ['orders.view', 'orders.update']);

        $view = $this->actingAs($user, 'sanctum')
            ->getJson($this->url("/orders/{$order->id}"));

        $update = $this->actingAs($user, 'sanctum')
            ->patchJson($this->url("/orders/{$order->id}/status"), ['status' => 'shipped']);

        $view->assertOk();
        $update->assertOk();
    }
}
