<?php

/**
 * Definición de límites y funciones por plan.
 *
 * `null` en un límite significa "sin límite".
 *
 * Esto vive en config (no en base de datos) a propósito: hoy no hay
 * panel de administración de planes, así que un archivo versionado en
 * git es más simple y más seguro que una tabla editable sin UI. Si
 * más adelante necesitan que un super-admin edite planes desde un
 * panel, esto se migra a una tabla `plans` sin tener que tocar el
 * resto del sistema (todo el código lee planes a través de
 * App\Support\Plans\PlanRegistry, no de este archivo directamente).
 */

return [

    'free' => [
        'name' => 'Free (prueba)',
        'trial_days' => 60,
        'limits' => [
            'max_products' => 50,
            'max_staff_users' => 2,
            'max_warehouses' => 1,
        ],
        'features' => [
            'coupons' => false,
            'discount_rules' => false,
            'multi_warehouse' => false,
        ],
    ],

    'starter' => [
        'name' => 'Starter',
        'trial_days' => null,
        'limits' => [
            'max_products' => 500,
            'max_staff_users' => 5,
            'max_warehouses' => 1,
        ],
        'features' => [
            'coupons' => true,
            'discount_rules' => false,
            'multi_warehouse' => false,
        ],
    ],

    'pro' => [
        'name' => 'Pro',
        'trial_days' => null,
        'limits' => [
            'max_products' => 5000,
            'max_staff_users' => 20,
            'max_warehouses' => 5,
        ],
        'features' => [
            'coupons' => true,
            'discount_rules' => true,
            'multi_warehouse' => true,
        ],
    ],

    'business' => [
        'name' => 'Business',
        'trial_days' => null,
        'limits' => [
            'max_products' => null,
            'max_staff_users' => null,
            'max_warehouses' => null,
        ],
        'features' => [
            'coupons' => true,
            'discount_rules' => true,
            'multi_warehouse' => true,
        ],
    ],

];
