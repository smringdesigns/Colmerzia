<?php

namespace Tests\Feature\Http;

use App\Models\Customer;
use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesStoreUsers;
use Tests\TestCase;

/**
 * Mismo patrón que ProductControllerTest, aplicado a /api/v1/customers.
 * No repite cada escenario de permisos (ya probado a fondo con
 * productos); se enfoca en confirmar que el aislamiento por tienda
 * también aplica acá.
 */
class CustomerControllerTest extends TestCase
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

    public function test_index_solo_devuelve_clientes_de_la_tienda_del_subdominio(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['customers.view']);

        Customer::factory()->create(['store_id' => $this->storeA->id, 'first_name' => 'Cliente A']);
        Customer::factory()->create(['store_id' => $this->storeB->id, 'first_name' => 'Cliente B']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-a.localhost', '/customers'));

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.first_name', 'Cliente A');
    }

    public function test_show_de_cliente_de_otra_tienda_devuelve_404(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['customers.view']);

        $clienteDeB = Customer::factory()->create(['store_id' => $this->storeB->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-a.localhost', "/customers/{$clienteDeB->id}"));

        $response->assertNotFound();
    }

    public function test_token_de_tienda_a_no_sirve_en_el_subdominio_de_tienda_b(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['customers.view']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->url('tienda-b.localhost', '/customers'));

        $response->assertStatus(403);
    }

    public function test_usuario_con_permiso_crea_cliente_y_queda_en_su_propia_tienda(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['customers.create']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson($this->url('tienda-a.localhost', '/customers'), [
                'first_name' => 'Nuevo',
                'last_name' => 'Cliente',
                'email' => 'nuevo.cliente@example.com',
            ]);

        $response->assertCreated();
        $response->assertJsonPath('store_id', $this->storeA->id);

        $this->assertDatabaseHas('customers', [
            'email' => 'nuevo.cliente@example.com',
            'store_id' => $this->storeA->id,
        ]);
    }

    public function test_no_puede_eliminar_un_cliente_de_otra_tienda(): void
    {
        $user = $this->createUserWithPermissions($this->storeA, ['customers.delete']);

        $clienteDeB = Customer::factory()->create(['store_id' => $this->storeB->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson($this->url('tienda-a.localhost', "/customers/{$clienteDeB->id}"));

        $response->assertNotFound();

        $this->assertDatabaseHas('customers', ['id' => $clienteDeB->id]);
        $this->assertNull($clienteDeB->fresh()->deleted_at);
    }
}
