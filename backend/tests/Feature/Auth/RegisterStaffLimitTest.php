<?php

namespace Tests\Feature\Auth;

use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterStaffLimitTest extends TestCase
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

    private function url(): string
    {
        return 'http://tienda-a.localhost/api/v1/register';
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Nuevo Empleado',
            'email' => 'nuevo.empleado@gmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ], $overrides);
    }

    public function test_no_deja_registrar_mas_staff_del_que_permite_el_plan_free(): void
    {
        Subscription::factory()->for($this->store)->create(); // free: max_staff_users = 2

        // Ya hay 2 usuarios en la tienda (el límite del plan Free).
        User::factory()->count(2)->create(['store_id' => $this->store->id]);

        $response = $this->postJson($this->url(), $this->payload());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');

        $this->assertDatabaseMissing('users', ['email' => 'nuevo.empleado@gmail.com']);
    }

    public function test_si_deja_registrar_por_debajo_del_limite(): void
    {
        Subscription::factory()->for($this->store)->create();

        User::factory()->count(1)->create(['store_id' => $this->store->id]);

        $response = $this->postJson($this->url(), $this->payload());

        $response->assertOk();
    }

    public function test_un_plan_superior_permite_mas_staff(): void
    {
        Subscription::factory()->for($this->store)->plan('business')->create(); // sin límite

        User::factory()->count(30)->create(['store_id' => $this->store->id]);

        $response = $this->postJson($this->url(), $this->payload());

        $response->assertOk();
    }
}
