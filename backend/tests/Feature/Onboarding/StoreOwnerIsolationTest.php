<?php

namespace Tests\Feature\Onboarding;

use App\Models\Store;
use App\Support\Tenancy\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreOwnerIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['tenancy.central_domains' => ['localhost']]);

        Tenant::clear();
    }

    protected function tearDown(): void
    {
        Tenant::clear();

        parent::tearDown();
    }

    public function test_el_dueno_de_una_tienda_tiene_acceso_total_dentro_de_su_propia_tienda(): void
    {
        $onboarding = $this->postJson('http://localhost/api/v1/onboarding', [
            'business_name' => 'Mi Negocio',
            'business_type' => 'retail',
            'subdomain' => 'mi-negocio',
            'owner_name' => 'Dueño',
            'email' => 'owner1@gmail.com', // <-- Cambiado a gmail.com para pasar el check DNS
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'plan_slug' => 'free',
        ]);

        $token = $onboarding->json('token') ?? $onboarding->json('data.token') ?? $onboarding->json('access_token');

        // Puede crear un producto en SU tienda sin que nadie le haya
        // asignado el permiso products.create a mano: el bypass de
        // store-owner en Gate::before se lo permite.
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('http://mi-negocio.localhost/api/v1/products', [
                'name' => 'Producto del dueño',
                'sku' => 'SKU-OWNER-1',
                'price' => 15000,
            ]);

        $response->assertCreated();
    }

    public function test_el_dueno_de_una_tienda_NO_tiene_bypass_en_el_subdominio_de_otra_tienda(): void
    {
        // Tienda A y su dueño.
        $onboardingA = $this->postJson('http://localhost/api/v1/onboarding', [
            'business_name' => 'Tienda A',
            'business_type' => 'retail',
            'subdomain' => 'tienda-a',
            'owner_name' => 'Dueño A',
            'email' => 'owner2@gmail.com', // <-- Cambiado a gmail.com
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'plan_slug' => 'free',
        ]);

        $tokenA = $onboardingA->json('token') ?? $onboardingA->json('data.token') ?? $onboardingA->json('access_token');

        // Tienda B, para que exista un subdominio distinto al que
        // apuntar con el token de A.
        $this->postJson('http://localhost/api/v1/onboarding', [
            'business_name' => 'Tienda B',
            'business_type' => 'retail',
            'subdomain' => 'tienda-b',
            'owner_name' => 'Dueño B',
            'email' => 'owner-b@gmail.com', // <-- Cambiado a gmail.com
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'plan_slug' => 'free',
        ]);

        // El dueño de A, con SU token válido, intenta crear un
        // producto en el subdominio de B.
        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->postJson('http://tienda-b.localhost/api/v1/products', [
                'name' => 'Intento cruzado',
                'sku' => 'SKU-CRUZADO-1',
                'price' => 15000,
            ]);

        // Ni siquiera es un tema de currentStoreId(): el propio
        // Gate::before ya lo bloquea antes de llegar al controller,
        // porque hasRole('store-owner') consulta el Role del tenant
        // actual (Tienda B), no el de Tienda A.
        $response->assertStatus(403);

        $this->assertDatabaseMissing('products', ['sku' => 'SKU-CRUZADO-1']);
    }
}