<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Los orígenes explícitos se controlan mediante CORS_ALLOWED_ORIGINS.
    | Los subdominios locales de las tiendas se permiten mediante
    | allowed_origins_patterns.
    |
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174'
        ))
    ))),

    'allowed_origins_patterns' => [

        // Admin y Storefront locales
        '#^http://localhost:517[34]$#',

        // 127.0.0.1 para Admin y Storefront
        '#^http://127\.0\.0\.1:517[34]$#',

        // Cualquier subdominio de localhost
        //
        // Ejemplos:
        // http://colmerzia.localhost:5174
        // http://lecmarc.localhost:5174
        // http://otra-tienda.localhost:5174
        //
        // También permite el puerto 5173 del panel administrativo.
        '#^http://[a-z0-9-]+\.localhost:517[34]$#i',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Credentials
    |--------------------------------------------------------------------------
    |
    | Actualmente el frontend utiliza Bearer Token mediante Authorization,
    | no cookies de sesión para la autenticación de la API.
    |
    */

    'supports_credentials' => false,

];