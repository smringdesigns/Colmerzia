<?php

/**
 * Definición de tipos de negocio soportados por Colmerzia.
 *
 * El tipo de negocio elegido en el onboarding determina:
 *
 * - `default_categories`: categorías que se siembran automáticamente
 *   al crear la tienda (igual patrón que el rol "Dueño de la tienda").
 * - `uses_inventory`: si el rubro necesita bodegas/stock (una tienda
 *   de servicios, por ejemplo, no vende unidades físicas).
 * - `storefront_layout`: qué variante de home usa el storefront
 *   público para esa tienda.
 *
 * Igual que plans.php, vive en config (no en base de datos) a
 * propósito: todo el código lee esto a través de
 * App\Support\BusinessTypes\BusinessTypeRegistry, nunca directamente,
 * para poder migrar a una tabla editable después sin tocar el resto
 * del sistema.
 */

return [

    'retail' => [
        'name' => 'Retail / Tienda general',
        'uses_inventory' => true,
        'storefront_layout' => 'catalog',
        'default_categories' => [
            'Novedades',
            'Más vendidos',
            'Ofertas',
        ],
    ],

    'moda' => [
        'name' => 'Moda y accesorios',
        'uses_inventory' => true,
        'storefront_layout' => 'catalog',
        'default_categories' => [
            'Mujer',
            'Hombre',
            'Accesorios',
            'Calzado',
        ],
    ],

    'tecnologia' => [
        'name' => 'Tecnología y electrónica',
        'uses_inventory' => true,
        'storefront_layout' => 'catalog',
        'default_categories' => [
            'Computadores',
            'Celulares',
            'Accesorios',
            'Audio',
        ],
    ],

    'restaurante' => [
        'name' => 'Restaurante / Comida',
        'uses_inventory' => false,
        'storefront_layout' => 'menu',
        'default_categories' => [
            'Entradas',
            'Platos fuertes',
            'Bebidas',
            'Postres',
        ],
    ],

    'servicios' => [
        'name' => 'Servicios',
        'uses_inventory' => false,
        'storefront_layout' => 'services',
        'default_categories' => [
            'Servicios',
        ],
    ],

];
