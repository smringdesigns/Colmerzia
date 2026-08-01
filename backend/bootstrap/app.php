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
        | Tenancy: alias de middleware para resolver la tienda por subdominio
        |--------------------------------------------------------------------------
        */

        $middleware->alias([
            // Apuntando a la clase exacta que acabamos de crear
            'tenant' => \App\Http\Middleware\TenantResolver::class,
            
            // TODO: Descomentar estos cuando creemos físicamente los archivos
            // 'store.active' => \App\Http\Middleware\EnsureStoreIsActive::class,
            // 'subscription.writable' => \App\Http\Middleware\EnsureSubscriptionIsWritable::class,
            // 'feature' => \App\Http\Middleware\EnsureFeatureAvailable::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Rate limiting: activa throttle:api en el grupo de rutas 'api'
        |--------------------------------------------------------------------------
        |
        | El límite en sí (60 req/min por usuario o IP) está definido en
        | AppServiceProvider::configureRateLimiting(), bajo el nombre 'api'.
        */

        $middleware->throttleApi();

        /*
        |--------------------------------------------------------------------------
        | API: No redirigir usuarios no autenticados al login web
        |--------------------------------------------------------------------------
        */

        $middleware->redirectGuestsTo(function (Request $request) {

            if ($request->is('api/*')) {
                return null; // Devuelve 401 en lugar de redirigir a una vista HTML
            }

            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        /*
        |--------------------------------------------------------------------------
        | Las rutas API siempre responden en formato JSON
        |--------------------------------------------------------------------------
        */

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })
    ->create();