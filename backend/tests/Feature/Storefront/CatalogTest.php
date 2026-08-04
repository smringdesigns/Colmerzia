<?php

namespace Tests\Feature\Storefront;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\Subscription;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\SeedsInventory;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;
    use SeedsInventory;

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
        return "http://tienda-a.localhost/api/v1/storefront{$path}";
    }

    public function test_solo_lista_productos_activos_de_la_tienda_actual(): void
    {
        Product::factory()->create(['store_id' => $this->store->id, 'is_active' => true, 'has_variants' => false]);
        Product::factory()->create(['store_id' => $this->store->id, 'is_active' => false, 'has_variants' => false]);

        $otherStore = Store::factory()->create(['subdomain' => 'tienda-b']);
        Subscription::factory()->for($otherStore)->create();
        Product::factory()->create(['store_id' => $otherStore->id, 'is_active' => true, 'has_variants' => false]);

        $response = $this->getJson($this->url('/products'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }

    public function test_ver_detalle_por_slug(): void
    {
        $product = Product::factory()->create([
            'store_id' => $this->store->id,
            'is_active' => true,
            'has_variants' => false,
            'slug' => 'producto-de-prueba',
        ]);

        $response = $this->getJson($this->url('/products/producto-de-prueba'));

        $response->assertOk();
        $response->assertJsonPath('id', $product->id);
    }

    public function test_producto_inactivo_no_es_visible_por_slug(): void
    {
        Product::factory()->create([
            'store_id' => $this->store->id,
            'is_active' => false,
            'has_variants' => false,
            'slug' => 'oculto',
        ]);

        $response = $this->getJson($this->url('/products/oculto'));

        $response->assertNotFound();
    }

    public function test_in_stock_considera_variantes_cuando_el_producto_las_tiene(): void
    {
        $product = Product::factory()->create([
            'store_id' => $this->store->id,
            'is_active' => true,
            'has_variants' => true,
            'slug' => 'con-variantes',
        ]);

        $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'is_active' => true]);

        $this->seedStock($product, 5, $variant);

        $response = $this->getJson($this->url('/products/con-variantes'));

        $response->assertJsonPath('in_stock', true);
        $response->assertJsonCount(1, 'variants');
    }

    public function test_busqueda_por_nombre(): void
    {
        Product::factory()->create(['store_id' => $this->store->id, 'is_active' => true, 'has_variants' => false, 'name' => 'Camiseta Roja']);
        Product::factory()->create(['store_id' => $this->store->id, 'is_active' => true, 'has_variants' => false, 'name' => 'Pantalón Azul']);

        $response = $this->getJson($this->url('/products?search=Camiseta'));

        $response->assertJsonCount(1, 'data');
    }

    public function test_lista_solo_categorias_activas_de_nivel_raiz(): void
    {
        Category::factory()->create(['store_id' => $this->store->id, 'is_active' => true, 'parent_id' => null]);
        Category::factory()->create(['store_id' => $this->store->id, 'is_active' => false, 'parent_id' => null]);

        $response = $this->getJson($this->url('/categories'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }
}
