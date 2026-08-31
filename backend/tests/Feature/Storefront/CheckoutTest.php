<?php

namespace Tests\Feature\Storefront;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Store;
use App\Models\Subscription;
use App\Services\Inventory\InventoryService;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\SeedsInventory;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;
    use SeedsInventory;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->store = Store::factory()->create([
            'subdomain' => 'tienda-a',
            'is_active' => true,
        ]);

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
        return "http://tienda-a.localhost/api/v1/storefront{$path}";
    }

    private function checkoutPayload(): array
    {
        return [
            'customer' => [
                'name' => 'Cliente de Prueba',
                'email' => 'cliente@gmail.com',
                'phone' => '3001234567',
            ],
            'shipping_address' => [
                'line1' => 'Calle 123 #45-67',
                'city' => 'Bogotá',
                'country' => 'Colombia',
            ],
            'payment_method' => 'cash', // <--- CAMPO AGREGADO AQUÍ
        ];
    }

    private function addProductToCart(int $stock = 10, int $price = 10000): array
    {
        $product = Product::factory()->create([
            'store_id' => $this->store->id,
            'has_variants' => false,
            'price' => $price,
        ]);

        $this->seedStock($product, $stock);

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        return [$product, $response->json('guest_token')];
    }

    private function currentStock(Product $product): int
    {
        return app(InventoryService::class)->availableStock($product->store_id, $product->id, null);
    }

    public function test_checkout_crea_una_orden_y_descuenta_el_stock(): void
    {
        [$product, $token] = $this->addProductToCart(stock: 10, price: 10000);

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $response->assertCreated();
        $response->assertJsonPath('status', 'pending');
        $response->assertJsonPath('payment_status', 'pending');
        $response->assertJsonPath('total', '20000.00');

        $this->assertSame(8, $this->currentStock($product));

        $this->assertDatabaseHas('orders', [
            'store_id' => $this->store->id,
            'total' => 20000,
        ]);

        $this->assertDatabaseCount('order_items', 1);
    }

    public function test_checkout_marca_el_carrito_como_convertido(): void
    {
        [, $token] = $this->addProductToCart();

        $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $cart = Cart::where('store_id', $this->store->id)->where('guest_token', $token)->firstOrFail();

        $this->assertSame(Cart::STATUS_CONVERTED, $cart->status);
    }

    public function test_no_se_puede_hacer_checkout_de_un_carrito_vacio(): void
    {
        // Sin agregar nada, solo consultamos para obtener un guest_token.
        $show = $this->getJson($this->url('/cart'));
        $token = $show->json('guest_token');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $response->assertStatus(422);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_falla_si_ya_no_hay_stock_suficiente(): void
    {
        [$product, $token] = $this->addProductToCart(stock: 5);

        // Alguien más se lleva casi todo el stock justo antes del pago.
        $this->seedStock($product, 1);

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $response->assertStatus(422);

        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(1, $this->currentStock($product)); // no se tocó
    }

    public function test_checkout_no_permite_reusar_el_mismo_carrito_dos_veces(): void
    {
        [, $token] = $this->addProductToCart();

        $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $second = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        // El carrito ya está 'converted' -> resolveCart le da uno
        // NUEVO y vacío, que a su vez falla el checkout por vacío.
        $second->assertStatus(422);
    }

    public function test_el_cupon_aplicado_se_refleja_en_la_orden_y_suma_su_uso(): void
    {
        [, $token] = $this->addProductToCart(price: 10000);

        Coupon::factory()->for($this->store)->percentage(10)->create(['code' => 'DIEZ']);

        $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/coupon'), ['code' => 'DIEZ']);

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/checkout'), $this->checkoutPayload());

        $response->assertCreated();
        $response->assertJsonPath('discount', '2000.00'); // 10% de 20000
        $response->assertJsonPath('total', '18000.00');

        $this->assertSame(1, Coupon::where('code', 'DIEZ')->firstOrFail()->used_count);
    }
}