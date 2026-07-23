<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Dominios centrales
    |--------------------------------------------------------------------------
    |
    | Estos son los dominios "sin tienda": el sitio de marketing, el
    | panel de super-admin de Colmerzia, o el propio localhost cuando
    | se prueba sin subdominio. Cualquier otro host que llegue como
    | "algo.<uno-de-estos-dominios>" se interpreta como el subdominio
    | de una tienda concreta.
    |
    | En local, agrega algo como esto a tu /etc/hosts (o configura un
    | DNS wildcard con dnsmasq) para poder probar subdominios:
    |
    |   127.0.0.1 colmerzia.test
    |   127.0.0.1 tienda-demo.colmerzia.test
    |
    */

    'central_domains' => array_filter(array_map(
        'trim',
        explode(',', env('TENANCY_CENTRAL_DOMAINS', 'localhost,127.0.0.1'))
    )),

];
