<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Dominios centrales
    |--------------------------------------------------------------------------
    |
    | Dominios que pertenecen a Colmerzia y que no representan una tienda.
    |
    | Desarrollo:
    |   localhost
    |   127.0.0.1
    |
    | Producción:
    |   colmerzia.com
    |
    */

    'central_domains' => array_filter(array_map(
        'trim',
        explode(',', env(
            'TENANCY_CENTRAL_DOMAINS',
            'localhost,127.0.0.1'
        ))
    )),

    /*
    |--------------------------------------------------------------------------
    | Dominio base de las tiendas
    |--------------------------------------------------------------------------
    |
    | Desarrollo:
    |   localhost
    |
    | Producción:
    |   colmerzia.com
    |
    | Una tienda quedaría:
    |
    |   colmerzia.localhost
    |   colmerzia.colmerzia.com
    |
    */

    'store_domain' => env(
        'TENANCY_STORE_DOMAIN',
        'localhost'
    ),

];
