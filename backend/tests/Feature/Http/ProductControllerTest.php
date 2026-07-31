<?php

namespace Tests\Feature\Http;

use App\Models\Product;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

/**
 * Cubre el flujo HTTP completo de /api/v1/products: autenticación,
 * permisos (Gate::before + roles) y aislamiento por tienda a través de
 * Controller::currentStoreId(), no solo el Global Scope a nivel de
 * modelo (eso ya está cubierto en StoreScopingTest).
 */
class ProductControllerTest extends TestCase
{
    use RefreshDatabase;
    use CreatesStoreUsers;

    private Store $storeA;
    private Store $storeB;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        $this->storeA = Store::factory()->create(['subdomain' => 'tienda-a', 'is_active' => true]);
        $this->storeB = Store::factory()->create(['subdomain' => 'tienda-b', 'is_active' => true]);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function url(string $host, string $path): string
    {
        return "http://{$host}/api/v1{$path}";
    }

    // ---------------------------------------------------------------
    // Listado / detalle: solo ve lo de su propia tienda
    // ---------------------------------------------------------------

    public function test_index_solo_devuelve_productos_de_la_tienda_del_subdominio(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.view']);

        Product::factory()->create(['store_id' => $this->storeA->id, 'name' => 'Producto A']);
        Product::factory()->create(['store_id' => $this->storeB->id, 'name' => 'Producto B']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-a.localhost', '/products'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Producto A');
    }

    public function test_show_de_producto_de_otra_tienda_devuelve_404(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.view']);

        $productoDeB = Product::factory()->create(['store_id' => $this->storeB->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-a.localhost', "/products/{$productoDeB->id}"));

        $response->assertNotFound();
    }

    // ---------------------------------------------------------------
    // Token de una tienda usado contra el subdominio de otra
    // ---------------------------------------------------------------

    public function test_token_de_tienda_a_no_sirve_en_el_subdominio_de_tienda_b(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-b.localhost', '/products'));

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------------
    // Permisos: sin el permiso correcto, no se puede
    // ---------------------------------------------------------------

    public function test_usuario_sin_permiso_products_create_no_puede_crear(): void
    {
        // Tiene products.view pero no products.create.
        $user = $this->createUserWithPermissions($this->storeA, ['products.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('tienda-a.localhost', '/products'), [
                'name' => 'Producto nuevo',
                'sku' => 'SKU-NOPERM-1',
                'price' => 10000,
            ]);

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------------
    // Creación: queda asociado a la tienda correcta
    // ---------------------------------------------------------------

    public function test_usuario_con_permiso_crea_producto_y_queda_en_su_propia_tienda(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.create']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('tienda-a.localhost', '/products'), [
                'name' => 'Producto nuevo',
                'sku' => 'SKU-CREATE-1',
                'price' => 25000,
            ]);

        $response->assertCreated();
        $response->assertJsonPath('store_id', $this->storeA->id);

        $this->assertDatabaseHas('products', [
            'sku' => 'SKU-CREATE-1',
            'store_id' => $this->storeA->id,
        ]);
    }

    // ---------------------------------------------------------------
    // Actualizar / eliminar producto de otra tienda: 404, no 200
    // ---------------------------------------------------------------

    public function test_no_puede_actualizar_un_producto_de_otra_tienda(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.update']);

        $productoDeB = Product::factory()->create([
            'store_id' => $this->storeB->id,
            'name' => 'Original',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson($this->url('tienda-a.localhost', "/products/{$productoDeB->id}"), [
                'name' => 'Hackeado',
                'sku' => $productoDeB->sku,
                'price' => 1,
            ]);

        $response->assertNotFound();

        $this->assertDatabaseHas('products', [
            'id' => $productoDeB->id,
            'name' => 'Original',
        ]);
    }

    public function test_no_puede_eliminar_un_producto_de_otra_tienda(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['products.delete']);

        $productoDeB = Product::factory()->create(['store_id' => $this->storeB->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson($this->url('tienda-a.localhost', "/products/{$productoDeB->id}"));

        $response->assertNotFound();

        $this->assertDatabaseHas('products', ['id' => $productoDeB->id]);
        $this->assertNull($productoDeB->fresh()->deleted_at);
    }
}
