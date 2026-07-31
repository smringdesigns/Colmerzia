<?php

namespace Tests\Feature\Auth;

use App\Models\Store;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
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

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function registerUrl(string $host): string
    {
        return "http://{$host}/api/v1/register";
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Nuevo Empleado',
            'email' => 'nuevo.empleado@gmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ], $overrides);
    }

    public function test_registra_un_usuario_nuevo_asociado_a_la_tienda_del_subdominio(): void
    {
        $response = $this->postJson(
            $this->registerUrl('tienda-a.localhost'),
            $this->validPayload()
        );

        $response->assertCreated();
        $response->assertJsonPath('data.user.email', 'nuevo.empleado@gmail.com');
        $response->assertJsonStructure(['data' => ['user', 'token']]);

        $this->assertDatabaseHas('users', [
            'email' => 'nuevo.empleado@gmail.com',
            'store_id' => $this->store->id,
        ]);
    }

    public function test_el_usuario_registrado_no_tiene_permisos_hasta_que_se_le_asigne_un_rol(): void
    {
        $response = $this->postJson(
            $this->registerUrl('tienda-a.localhost'),
            $this->validPayload()
        );

        $response->assertCreated();

        $user = User::where('email', 'nuevo.empleado@gmail.com')->first();

        $this->assertFalse($user->hasPermission('products.view'));
        $this->assertFalse($user->hasRole('super-admin'));
    }

    public function test_no_se_puede_registrar_desde_el_dominio_central_sin_tienda(): void
    {
        $response = $this->postJson(
            $this->registerUrl('localhost'),
            $this->validPayload()
        );

        $response->assertStatus(422);
    }

    public function test_no_permite_registrar_un_email_ya_existente(): void
    {
        User::factory()->create([
            'store_id' => $this->store->id,
            'email' => 'ya.existe@gmail.com',
        ]);

        $response = $this->postJson(
            $this->registerUrl('tienda-a.localhost'),
            $this->validPayload(['email' => 'ya.existe@gmail.com'])
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');
    }

    public function test_exige_confirmacion_de_contrasena(): void
    {
        $response = $this->postJson(
            $this->registerUrl('tienda-a.localhost'),
            $this->validPayload(['password_confirmation' => 'otra-distinta'])
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('password');
    }

    public function test_el_endpoint_de_registro_tiene_su_propio_limite_de_peticiones(): void
    {
        // 5 registros/min por IP. Usamos emails distintos porque el
        // límite es por IP, no por email (a diferencia de login).
        for ($i = 1; $i <= 5; $i++) {
            $response = $this->postJson(
                $this->registerUrl('tienda-a.localhost'),
                $this->validPayload(['email' => "empleado-{$i}@gmail.com"])
            );

            $response->assertCreated();
        }

        $response = $this->postJson(
            $this->registerUrl('tienda-a.localhost'),
            $this->validPayload(['email' => 'empleado-6@gmail.com'])
        );

        $response->assertStatus(429);
    }
}
