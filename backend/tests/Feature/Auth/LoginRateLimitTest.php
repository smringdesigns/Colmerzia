<?php

namespace Tests\Feature\Auth;

use App\Models\Store;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cubre los rate limiters agregados en AppServiceProvider:
 *  - 'login': máx. 5 intentos/min por combinación IP+email.
 *  - 'api': máx. 60 peticiones/min (general, activado con
 *    $middleware->throttleApi() en bootstrap/app.php).
 */
class LoginRateLimitTest extends TestCase
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

    private function loginUrl(): string
    {
        return 'http://tienda-a.localhost/api/v1/login';
    }

    public function test_el_sexto_intento_de_login_en_un_minuto_para_el_mismo_email_se_bloquea(): void
    {
        $user = User::factory()->create([
            'store_id' => $this->store->id,
            'email' => 'empleado@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        // 5 intentos fallidos (permitidos por el límite, aunque la
        // contraseña sea incorrecta: el throttle cuenta peticiones,
        // no éxitos).
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson($this->loginUrl(), [
                'email' => $user->email,
                'password' => 'password-incorrecta',
            ]);

            $response->assertStatus(401);
        }

        // El 6to, con la MISMA combinación IP+email, debe bloquearse
        // aunque esta vez la contraseña sea la correcta: el límite ya
        // se agotó, ni siquiera llega a validar credenciales.
        $response = $this->postJson($this->loginUrl(), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(429);
    }

    public function test_el_bloqueo_es_por_email_no_global_para_la_misma_ip(): void
    {
        $userA = User::factory()->create([
            'store_id' => $this->store->id,
            'email' => 'usuario-a@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        $userB = User::factory()->create([
            'store_id' => $this->store->id,
            'email' => 'usuario-b@gmail.com',
            'password' => 'password123',
            'is_active' => true,
        ]);

        // Agotamos el límite específico de usuario-a (5/min).
        for ($i = 0; $i < 5; $i++) {
            $this->postJson($this->loginUrl(), [
                'email' => $userA->email,
                'password' => 'password-incorrecta',
            ]);
        }

        $bloqueado = $this->postJson($this->loginUrl(), [
            'email' => $userA->email,
            'password' => 'password123',
        ]);

        // Un intento de login legítimo para OTRO email, desde la misma
        // IP, todavía debe pasar (llevamos ~6-7 peticiones desde esa
        // IP, muy por debajo del límite de 20/min por IP).
        $noBloqueado = $this->postJson($this->loginUrl(), [
            'email' => $userB->email,
            'password' => 'password123',
        ]);

        $bloqueado->assertStatus(429);
        $noBloqueado->assertOk();
    }

    public function test_muchos_emails_distintos_desde_la_misma_ip_activan_el_limite_por_ip(): void
    {
        // Simula credential stuffing: probar 21 emails distintos
        // (todos inexistentes) desde la misma IP en menos de un
        // minuto. El límite de 20/min por IP debe cortarlo antes de
        // llegar al final, sin importar que cada email sea distinto.
        $bloqueado = false;

        for ($i = 1; $i <= 21; $i++) {
            $response = $this->postJson($this->loginUrl(), [
                'email' => "no-existe-{$i}@gmail.com",
                'password' => 'lo-que-sea',
            ]);

            if ($response->status() === 429) {
                $bloqueado = true;
                break;
            }
        }

        $this->assertTrue(
            $bloqueado,
            'Se esperaba que el límite de 20 intentos/minuto por IP se activara.'
        );
    }
}
