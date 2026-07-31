<?php

namespace Tests\Feature\Tenancy;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Role;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Cubre el Global Scope (BelongsToStoreScope / BelongsToStoreOrNullScope):
 * la red de seguridad que filtra automáticamente cualquier query por la
 * tienda actual, además del filtrado manual que ya hacen los controllers.
 */
class StoreScopingTest extends TestCase
{
    use RefreshDatabase;

    private Store $storeA;
    private Store $storeB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeA = Store::factory()->create(['subdomain' => 'tienda-a']);
        $this->storeB = Store::factory()->create(['subdomain' => 'tienda-b']);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    // ---------------------------------------------------------------
    // Scope estricto (store_id obligatorio): Product
    // ---------------------------------------------------------------

    public function test_solo_ve_los_productos_de_la_tienda_actual(): void
    {
        Product::factory()->create(['store_id' => $this->storeA->id, 'name' => 'Producto A']);
        Product::factory()->create(['store_id' => $this->storeB->id, 'name' => 'Producto B']);

        Tenant::set($this->storeA);

        $productos = Product::all();

        $this->assertCount(1, $productos);
        $this->assertSame('Producto A', $productos->first()->name);
    }

    public function test_no_puede_encontrar_por_id_un_producto_de_otra_tienda(): void
    {
        $productoDeB = Product::factory()->create(['store_id' => $this->storeB->id]);

        Tenant::set($this->storeA);

        // find() también pasa por el Global Scope: no debe encontrarlo,
        // aunque el ID exista en la base de datos.
        $this->assertNull(Product::find($productoDeB->id));
    }

    public function test_sin_tenant_resuelto_no_se_restringe_nada(): void
    {
        // Simula un contexto sin tenant: comandos artisan, colas, tests
        // que no pasan por el middleware de subdominio.
        Product::factory()->create(['store_id' => $this->storeA->id]);
        Product::factory()->create(['store_id' => $this->storeB->id]);

        Tenant::clear();

        $this->assertCount(2, Product::all());
    }

    public function test_withoutStoreScope_permite_cruzar_tiendas_explicitamente(): void
    {
        Product::factory()->create(['store_id' => $this->storeA->id]);
        Product::factory()->create(['store_id' => $this->storeB->id]);

        Tenant::set($this->storeA);

        $this->assertCount(1, Product::all());
        $this->assertCount(2, Product::withoutStoreScope()->get());
    }

    public function test_al_crear_un_producto_sin_store_id_se_autocompleta_con_el_tenant_actual(): void
    {
        Tenant::set($this->storeA);

        $producto = Product::create([
            'uuid' => Str::uuid(),
            'name' => 'Autocompletado',
            'slug' => 'autocompletado',
            'sku' => 'SKU-AUTO-1',
            'price' => 10000,
            'stock' => 1,
        ]);

        $this->assertSame($this->storeA->id, $producto->store_id);
    }

    // ---------------------------------------------------------------
    // Scope estricto: Customer (mismo patrón que Product)
    // ---------------------------------------------------------------

    public function test_solo_ve_los_clientes_de_la_tienda_actual(): void
    {
        Customer::factory()->create(['store_id' => $this->storeA->id]);
        Customer::factory()->create(['store_id' => $this->storeB->id]);
        Customer::factory()->create(['store_id' => $this->storeB->id]);

        Tenant::set($this->storeB);

        $this->assertCount(2, Customer::all());
    }

    // ---------------------------------------------------------------
    // Scope nullable-aware: Role (roles de sistema son globales)
    // ---------------------------------------------------------------

    public function test_ve_sus_propios_roles_y_los_roles_globales_del_sistema(): void
    {
        $rolGlobal = Role::create([
            'store_id' => null,
            'uuid' => Str::uuid(),
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'is_system' => true,
        ]);

        $rolPropio = Role::create([
            'store_id' => $this->storeA->id,
            'uuid' => Str::uuid(),
            'name' => 'Vendedor',
            'slug' => 'vendedor',
            'is_system' => false,
        ]);

        $rolDeOtraTienda = Role::create([
            'store_id' => $this->storeB->id,
            'uuid' => Str::uuid(),
            'name' => 'Vendedor B',
            'slug' => 'vendedor-b',
            'is_system' => false,
        ]);

        Tenant::set($this->storeA);

        $slugs = Role::pluck('slug')->all();

        $this->assertContains('super-admin', $slugs, 'El rol global debe seguir siendo visible.');
        $this->assertContains('vendedor', $slugs, 'El rol propio de la tienda debe ser visible.');
        $this->assertNotContains('vendedor-b', $slugs, 'El rol de otra tienda NO debe ser visible.');
    }
}
