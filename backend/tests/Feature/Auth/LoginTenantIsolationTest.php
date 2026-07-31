<?php

namespace Tests\Feature\Auth;

use App\Models\Store;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cubre el fix de AuthService::login(): un usuario de la Tienda A no
 * debe poder autenticarse desde el subdominio de la Tienda B, aunque
 * sus credenciales sean correctas.
 *
 * Nota: LoginRequest valida el email con la regla `email:rfc,dns`, que
 * hace una consulta DNS real. Por eso los emails de prueba usan
 * dominios públicos con DNS válido (gmail.com) en vez de dominios
 * inventados, para que los tests no fallen por eso en un entorno sin
 * salida a internet.
 */
class LoginTenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    private Store $storeA;
    private Store $storeB;

    protected function setUp(): void
    {
        parent::setUp();

        // Fijamos los dominios centrales para que el test no dependa
        // de lo que haya (o no) en el .env de quien lo corre.
        config(['tenancy.central_domains' => ['localhost']]);

        $this->storeA = Store::factory()->create([
            'subdomain' => 'tienda-a',
            'is_active' => true,
        ]);

        $this->storeB = Store::factory()->create([
            'subdomain' => 'tienda-b',
            'is_active' => true,
        ]);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    private function loginUrl(string $host): string
    {
        return "http://{$host}/api/v1/login";
    }

    public function test_user_puede_loguearse_desde_el_subdominio_de_su_propia_tienda(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        $response = $this->postJson($this->loginUrl('tienda-a.localhost'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.user.email', $user->email);
        $response->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_user_no_puede_loguearse_desde_el_subdominio_de_otra_tienda(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        // Mismas credenciales válidas, pero entrando por el subdominio
        // de la Tienda B en vez de la A.
        $response = $this->postJson($this->loginUrl('tienda-b.localhost'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_no_filtra_si_el_motivo_del_rechazo_fue_password_o_tienda(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        $wrongPassword = $this->postJson($this->loginUrl('tienda-a.localhost'), [
            'email' => $user->email,
            'password' => 'password-incorrecta',
        ]);

        $wrongStore = $this->postJson($this->loginUrl('tienda-b.localhost'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $wrongPassword->assertStatus(401);
        $wrongStore->assertStatus(401);

        // Mismo mensaje en ambos casos: no le decimos a un atacante
        // cuál de las dos cosas falló.
        $this->assertSame(
            $wrongPassword->json('message'),
            $wrongStore->json('message')
        );
    }

    public function test_user_puede_loguearse_desde_el_dominio_central_sin_importar_su_tienda(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        // El dominio central (ej. panel super-admin) no resuelve
        // ningún tenant, así que ahí el chequeo de tienda no aplica.
        $response = $this->postJson($this->loginUrl('localhost'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk();
    }

    public function test_login_sigue_fallando_con_password_incorrecta(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        $response = $this->postJson($this->loginUrl('tienda-a.localhost'), [
            'email' => $user->email,
            'password' => 'password-incorrecta',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_sigue_fallando_para_usuario_inactivo(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->storeA->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => false,
        ]);

        $response = $this->postJson($this->loginUrl('tienda-a.localhost'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }
}
