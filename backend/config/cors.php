<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | 'allowed_origins' se controla 100% por la variable de entorno
    | CORS_ALLOWED_ORIGINS (separada por comas), asi el codigo no cambia
    | entre entornos:
    |
    |   Desarrollo:  CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
    |   Produccion:  CORS_ALLOWED_ORIGINS=https://tu-dominio-real.com
    |
    | Nunca uses '*' en produccion aunque supports_credentials sea false:
    | limitar el origen reduce la superficie de abuso (scraping, bots
    | golpeando la API desde cualquier pagina) aunque no haya cookies de por medio.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env(
            'CORS_ALLOWED_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173'
        ))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // false porque el frontend usa Bearer token (Authorization header),
    // no cookies de sesion. Si en algun momento se migra a auth por cookie
    // (Sanctum SPA stateful), esto debe pasar a true.
    'supports_credentials' => false,

];
