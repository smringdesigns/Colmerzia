<?php

namespace Tests\Feature\Support;

use App\Support\Plans\PlanRegistry;
use InvalidArgumentException;
use Tests\TestCase;

class PlanRegistryTest extends TestCase
{
    public function test_conoce_los_4_planes_definidos(): void
    {
        $this->assertEqualsCanonicalizing(
            ['free', 'starter', 'pro', 'business'],
            PlanRegistry::slugs()
        );
    }

    public function test_exists_distingue_planes_validos_de_invalidos(): void
    {
        $this->assertTrue(PlanRegistry::exists('free'));
        $this->assertFalse(PlanRegistry::exists('plan-inventado'));
    }

    public function test_get_lanza_excepcion_para_un_plan_inexistente(): void
    {
        $this->expectException(InvalidArgumentException::class);

        PlanRegistry::get('plan-inventado');
    }

    public function test_trialDays_solo_el_plan_free_tiene_prueba(): void
    {
        $this->assertSame(60, PlanRegistry::trialDays('free'));
        $this->assertNull(PlanRegistry::trialDays('starter'));
        $this->assertNull(PlanRegistry::trialDays('pro'));
        $this->assertNull(PlanRegistry::trialDays('business'));
    }

    public function test_business_no_tiene_limites(): void
    {
        $this->assertNull(PlanRegistry::limit('business', 'max_products'));
        $this->assertNull(PlanRegistry::limit('business', 'max_staff_users'));
        $this->assertNull(PlanRegistry::limit('business', 'max_warehouses'));
    }

    public function test_las_funciones_avanzan_de_forma_consistente_entre_planes(): void
    {
        // starter no tiene discount_rules, pero pro y business sí.
        $this->assertFalse(PlanRegistry::hasFeature('starter', 'discount_rules'));
        $this->assertTrue(PlanRegistry::hasFeature('pro', 'discount_rules'));
        $this->assertTrue(PlanRegistry::hasFeature('business', 'discount_rules'));

        // free no tiene ninguna función avanzada.
        $this->assertFalse(PlanRegistry::hasFeature('free', 'coupons'));
        $this->assertFalse(PlanRegistry::hasFeature('free', 'discount_rules'));
        $this->assertFalse(PlanRegistry::hasFeature('free', 'multi_warehouse'));
    }
}
