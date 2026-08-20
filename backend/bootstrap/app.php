<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        /*
        |--------------------------------------------------------------------------
        | Middleware aliases
        |--------------------------------------------------------------------------
        |
        | Alias utilizados en las rutas:
        | tenant
        | store.active
        | subscription.writable
        | feature
        | super-admin
        | customer
        |
        */

        $middleware->alias([

            // Resolver tenant por subdominio
            'tenant' => \App\Http\Middleware\TenantResolver::class,

            // Validar que la tienda esté activa
            'store.active' => \App\Http\Middleware\EnsureStoreIsActive::class,

            // Validar que la suscripción permita escritura
            'subscription.writable' => \App\Http\Middleware\EnsureSubscriptionIsWritable::class,

            // Validar funcionalidades según plan
            'feature' => \App\Http\Middleware\EnsureFeatureAvailable::class,

            // Restringir rutas de plataforma solo a super-admin
            'super-admin' => \App\Http\Middleware\EnsureIsSuperAdmin::class,

            // Restringir rutas de "mi cuenta" del storefront a clientes
            'customer' => \App\Http\Middleware\EnsureIsCustomer::class,

        ]);


        /*
        |--------------------------------------------------------------------------
        | API Rate limiting
        |--------------------------------------------------------------------------
        */

        $middleware->throttleApi();


        /*
        |--------------------------------------------------------------------------
        | Evitar redirección web para API
        |--------------------------------------------------------------------------
        */

        $middleware->redirectGuestsTo(function (Request $request) {

            if ($request->is('api/*')) {
                return null;
            }

            return route('login');

        });

    })
    ->withExceptions(function (Exceptions $exceptions): void {

        /*
        |--------------------------------------------------------------------------
        | API responde siempre JSON
        |--------------------------------------------------------------------------
        */

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

    })
    ->create();