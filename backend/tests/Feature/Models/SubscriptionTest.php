<?php

namespace Tests\Feature\Models;

use App\Models\Subscription;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    public function test_trialing_y_active_son_escribibles(): void
    {
        $trialing = new Subscription(['status' => Subscription::STATUS_TRIALING]);
        $active = new Subscription(['status' => Subscription::STATUS_ACTIVE]);

        $this->assertTrue($trialing->isWritable());
        $this->assertTrue($active->isWritable());
    }

    public function test_read_only_y_canceled_no_son_escribibles(): void
    {
        $readOnly = new Subscription(['status' => Subscription::STATUS_READ_ONLY]);
        $canceled = new Subscription(['status' => Subscription::STATUS_CANCELED]);

        $this->assertFalse($readOnly->isWritable());
        $this->assertFalse($canceled->isWritable());
    }

    public function test_hasFeature_lee_del_plan_correspondiente(): void
    {
        $free = new Subscription(['plan_slug' => 'free']);
        $pro = new Subscription(['plan_slug' => 'pro']);

        $this->assertFalse($free->hasFeature('coupons'));
        $this->assertTrue($pro->hasFeature('coupons'));
    }

    public function test_hasReachedLimit_respeta_limites_null_como_ilimitado(): void
    {
        $business = new Subscription(['plan_slug' => 'business']);

        $this->assertFalse($business->hasReachedLimit('max_products', 999999));
    }

    public function test_hasReachedLimit_compara_correctamente_contra_el_limite(): void
    {
        $free = new Subscription(['plan_slug' => 'free']); // max_products = 50

        $this->assertFalse($free->hasReachedLimit('max_products', 49));
        $this->assertTrue($free->hasReachedLimit('max_products', 50));
        $this->assertTrue($free->hasReachedLimit('max_products', 51));
    }
}
