<?php

namespace Tests\Feature\Storefront;

use App\Models\Coupon;
use App\Models\DiscountRule;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\Subscription;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
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

        Subscription::factory()->for($this->store)->create(); // free, trialing

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

    private function simpleProduct(array $overrides = []): Product
    {
        return Product::factory()->create(array_merge([
            'store_id' => $this->store->id,
            'has_variants' => false,
            'stock' => 10,
            'price' => 10000,
        ], $overrides));
    }

    // ---------------------------------------------------------------
    // Agregar items
    // ---------------------------------------------------------------

    public function test_agregar_un_producto_crea_un_guest_token_y_el_item(): void
    {
        $product = $this->simpleProduct();

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertOk();
        $response->assertJsonPath('guest_token', fn ($token) => !empty($token));
        $response->assertJsonCount(1, 'items');
        $response->assertJsonPath('items.0.quantity', 2);
        $response->assertJsonPath('subtotal', '20000.00');
        $response->assertJsonPath('total', '20000.00');
    }

    public function test_agregar_el_mismo_producto_dos_veces_suma_la_cantidad(): void
    {
        $product = $this->simpleProduct();

        $first = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $token = $first->json('guest_token');

        $second = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/items'), [
                'product_id' => $product->id,
                'quantity' => 3,
            ]);

        $second->assertJsonCount(1, 'items');
        $second->assertJsonPath('items.0.quantity', 5);
    }

    public function test_no_se_puede_agregar_mas_cantidad_de_la_que_hay_en_stock(): void
    {
        $product = $this->simpleProduct(['stock' => 3]);

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 4,
        ]);

        $response->assertStatus(422);
    }

    public function test_un_producto_con_variantes_exige_seleccionar_una(): void
    {
        $product = $this->simpleProduct(['has_variants' => true]);

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_agregar_una_variante_usa_su_propio_precio_y_stock(): void
    {
        $product = $this->simpleProduct(['has_variants' => true, 'price' => 10000]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->id,
            'price' => 15000,
            'stock' => 2,
        ]);

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);

        $response->assertOk();
        $response->assertJsonPath('items.0.unit_price', '15000.00');

        $overStock = $this->withHeader('X-Guest-Token', $response->json('guest_token'))
            ->postJson($this->url('/cart/items'), [
                'product_id' => $product->id,
                'product_variant_id' => $variant->id,
                'quantity' => 1, // ya hay 2 en el carrito, quedan 0 disponibles
            ]);

        $overStock->assertStatus(422);
    }

    // ---------------------------------------------------------------
    // Aislamiento por tienda y por guest_token
    // ---------------------------------------------------------------

    public function test_carritos_de_guest_tokens_distintos_no_se_mezclan(): void
    {
        $product = $this->simpleProduct();

        $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Sin header X-Guest-Token: debe ser un carrito nuevo, vacío.
        $response = $this->getJson($this->url('/cart'));

        $response->assertJsonCount(0, 'items');
    }

    // ---------------------------------------------------------------
    // Actualizar / quitar items
    // ---------------------------------------------------------------

    public function test_actualizar_cantidad_a_cero_quita_el_item(): void
    {
        $product = $this->simpleProduct();

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $token = $add->json('guest_token');
        $itemId = $add->json('items.0.id');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->patchJson($this->url("/cart/items/{$itemId}"), ['quantity' => 0]);

        $response->assertOk();
        $response->assertJsonCount(0, 'items');
    }

    public function test_quitar_un_item_directamente(): void
    {
        $product = $this->simpleProduct();

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $token = $add->json('guest_token');
        $itemId = $add->json('items.0.id');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->deleteJson($this->url("/cart/items/{$itemId}"));

        $response->assertOk();
        $response->assertJsonCount(0, 'items');
    }

    // ---------------------------------------------------------------
    // Cupones
    // ---------------------------------------------------------------

    public function test_aplicar_cupon_de_porcentaje_reduce_el_total(): void
    {
        $product = $this->simpleProduct(['price' => 10000]);

        Coupon::factory()->for($this->store)->percentage(10)->create(['code' => 'DIEZ']);

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $token = $add->json('guest_token');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/coupon'), ['code' => 'DIEZ']);

        $response->assertOk();
        $response->assertJsonPath('discount', '1000.00');
        $response->assertJsonPath('total', '9000.00');
    }

    public function test_cupon_con_compra_minima_no_alcanzada_se_rechaza(): void
    {
        $product = $this->simpleProduct(['price' => 5000]);

        Coupon::factory()->for($this->store)->percentage(10)->minimumAmount(20000)->create(['code' => 'MIN20K']);

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $token = $add->json('guest_token');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/coupon'), ['code' => 'MIN20K']);

        $response->assertStatus(422);
    }

    public function test_cupon_vencido_se_rechaza(): void
    {
        $product = $this->simpleProduct();

        Coupon::factory()->for($this->store)->expired()->create(['code' => 'VENCIDO']);

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $token = $add->json('guest_token');

        $response = $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/coupon'), ['code' => 'VENCIDO']);

        $response->assertStatus(422);
    }

    public function test_quitar_el_cupon_aplicado(): void
    {
        $product = $this->simpleProduct(['price' => 10000]);

        Coupon::factory()->for($this->store)->percentage(10)->create(['code' => 'DIEZ']);

        $add = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $token = $add->json('guest_token');

        $this->withHeader('X-Guest-Token', $token)
            ->postJson($this->url('/cart/coupon'), ['code' => 'DIEZ']);

        $response = $this->withHeader('X-Guest-Token', $token)
            ->deleteJson($this->url('/cart/coupon'));

        $response->assertOk();
        $response->assertJsonPath('discount', '0.00');
        $response->assertJsonPath('total', '10000.00');
    }

    // ---------------------------------------------------------------
    // Reglas de descuento automáticas
    // ---------------------------------------------------------------

    public function test_una_regla_de_descuento_activa_se_aplica_automaticamente(): void
    {
        $product = $this->simpleProduct(['price' => 10000]);

        DiscountRule::factory()->for($this->store)->fixed(1500)->create();

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertJsonPath('discount', '1500.00');
        $response->assertJsonPath('total', '8500.00');
    }

    public function test_entre_dos_reglas_aplica_la_de_mayor_prioridad(): void
    {
        $product = $this->simpleProduct(['price' => 10000]);

        DiscountRule::factory()->for($this->store)->fixed(500, priority: 1)->create();
        DiscountRule::factory()->for($this->store)->fixed(2000, priority: 10)->create();

        $response = $this->postJson($this->url('/cart/items'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertJsonPath('discount', '2000.00');
    }

    // ---------------------------------------------------------------
    // Modo solo-lectura
    // ---------------------------------------------------------------

    public function test_con_suscripcion_read_only_no_se_puede_agregar_al_carrito_pero_si_verlo(): void
    {
        $readOnlyStore = Store::factory()->create(['subdomain' => 'tienda-vencida', 'is_active' => true]);
        Subscription::factory()->for($readOnlyStore)->readOnly()->create();

        $product = Product::factory()->create([
            'store_id' => $readOnlyStore->id,
            'has_variants' => false,
            'stock' => 10,
        ]);

        $add = $this->postJson(
            "http://tienda-vencida.localhost/api/v1/storefront/cart/items",
            ['product_id' => $product->id, 'quantity' => 1]
        );

        $get = $this->getJson('http://tienda-vencida.localhost/api/v1/storefront/cart');

        $add->assertStatus(403);
        $get->assertOk();
    }
}
