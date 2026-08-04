<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Onboarding\StoreOnboardingController;

use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;

use App\Http\Controllers\Api\V1\WarehouseController;
use App\Http\Controllers\Api\V1\InventoryController;

use App\Http\Controllers\Api\V1\Storefront\CartController;
use App\Http\Controllers\Api\V1\Storefront\CheckoutController;

use App\Http\Controllers\Api\V1\Storefront\ProductController
    as StorefrontProductController;

use App\Http\Controllers\Api\V1\Storefront\CategoryController
    as StorefrontCategoryController;


/*
|--------------------------------------------------------------------------
| API V1
|--------------------------------------------------------------------------
|
| Las rutas públicas de autenticación no requieren tenant.
|
| Las rutas de tienda sí requieren:
|
| - tenant
| - store.active
|
*/

Route::prefix('v1')->group(function () {


    /*
    |--------------------------------------------------------------------------
    | RUTAS PÚBLICAS
    |--------------------------------------------------------------------------
    |
    | Estas rutas funcionan antes de que exista una tienda o antes de
    | que el usuario tenga una sesión autenticada.
    |
    */


    /*
    |--------------------------------------------------------------------------
    | Onboarding
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/onboarding',
        [StoreOnboardingController::class, 'store']
    )->middleware('throttle:register');


    /*
    |--------------------------------------------------------------------------
    | Registro e inicio de sesión
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/register',
        [AuthController::class, 'register']
    )->middleware('throttle:register');


    Route::post(
        '/login',
        [AuthController::class, 'login']
    )->middleware('throttle:login');


    /*
    |--------------------------------------------------------------------------
    | Recuperación de contraseña
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/forgot-password',
        [AuthController::class, 'forgotPassword']
    )->middleware('throttle:6,1');


    Route::post(
        '/reset-password',
        [AuthController::class, 'resetPassword']
    )->middleware('throttle:6,1');


    /*
    |--------------------------------------------------------------------------
    | Verificación de correo
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/email/verify/{id}/{hash}',
        [AuthController::class, 'verifyEmail']
    )
        ->middleware([
            'signed',
            'throttle:6,1'
        ])
        ->name('verification.verify');


    /*
    |--------------------------------------------------------------------------
    | SESIÓN AUTENTICADA
    |--------------------------------------------------------------------------
    |
    | Estas rutas necesitan login, pero todavía no requieren tenant.
    |
    */


    Route::middleware([
        'auth:sanctum'
    ])->group(function () {


        /*
        |--------------------------------------------------------------------------
        | Usuario autenticado
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/me',
            [AuthController::class, 'me']
        );


        Route::post(
            '/logout',
            [AuthController::class, 'logout']
        );


        /*
        |--------------------------------------------------------------------------
        | Reenviar verificación de correo
        |--------------------------------------------------------------------------
        */

        Route::post(
            '/email/verification-notification',
            [AuthController::class, 'sendVerificationEmail']
        )->middleware('throttle:6,1');


    });


    /*
    |--------------------------------------------------------------------------
    | RUTAS MULTI-TENANT
    |--------------------------------------------------------------------------
    |
    | Desde aquí todas las rutas necesitan una tienda válida.
    |
    */


    Route::middleware([
        'tenant',
        'store.active'
    ])->group(function () {


        /*
        |--------------------------------------------------------------------------
        | STOREFRONT PÚBLICO
        |--------------------------------------------------------------------------
        |
        | Los compradores no usan auth:sanctum.
        |
        | El carrito se identifica mediante:
        |
        | X-Guest-Token
        |
        */


        Route::prefix('storefront')->group(function () {


            /*
            |--------------------------------------------------------------------------
            | Catálogo público
            |--------------------------------------------------------------------------
            |
            | Estas rutas son de lectura.
            |
            | Se dejan fuera de subscription.writable para que una
            | tienda pueda seguir mostrando su catálogo aunque esté
            | en modo de solo lectura.
            |
            */


            Route::get(
                '/products',
                [StorefrontProductController::class, 'index']
            );


            Route::get(
                '/products/{slug}',
                [StorefrontProductController::class, 'show']
            );


            Route::get(
                '/categories',
                [StorefrontCategoryController::class, 'index']
            );


            /*
            |--------------------------------------------------------------------------
            | Carrito y checkout
            |--------------------------------------------------------------------------
            |
            | Estas operaciones modifican información.
            |
            | Por eso requieren una suscripción activa y editable.
            |
            */


            Route::middleware([
                'subscription.writable'
            ])->group(function () {


                Route::get(
                    '/cart',
                    [CartController::class, 'show']
                );


                Route::post(
                    '/cart/items',
                    [CartController::class, 'addItem']
                );


                Route::patch(
                    '/cart/items/{item}',
                    [CartController::class, 'updateItem']
                );


                Route::delete(
                    '/cart/items/{item}',
                    [CartController::class, 'removeItem']
                );


                Route::post(
                    '/cart/coupon',
                    [CartController::class, 'applyCoupon']
                );


                Route::delete(
                    '/cart/coupon',
                    [CartController::class, 'removeCoupon']
                );


                Route::post(
                    '/checkout',
                    [CheckoutController::class, 'store']
                );


            });


        });


        /*
        |--------------------------------------------------------------------------
        | PANEL ADMINISTRATIVO
        |--------------------------------------------------------------------------
        |
        | Estas rutas requieren:
        |
        | - Usuario autenticado
        | - Tienda resuelta
        | - Tienda activa
        |
        */


        Route::middleware([
            'auth:sanctum'
        ])->group(function () {


            /*
            |--------------------------------------------------------------------------
            | PRODUCTOS, CLIENTES, BODEGAS E INVENTARIO
            |--------------------------------------------------------------------------
            |
            | Se bloquean cuando la suscripción está en modo
            | solo lectura.
            |
            */


            Route::middleware([
                'subscription.writable'
            ])->group(function () {


                /*
                |--------------------------------------------------------------------------
                | Productos
                |--------------------------------------------------------------------------
                */


                Route::get(
                    '/products',
                    [ProductController::class, 'index']
                )->middleware('can:products.view');


                Route::post(
                    '/products',
                    [ProductController::class, 'store']
                )->middleware('can:products.create');


                Route::get(
                    '/products/{product}',
                    [ProductController::class, 'show']
                )->middleware('can:products.view');


                Route::put(
                    '/products/{product}',
                    [ProductController::class, 'update']
                )->middleware('can:products.update');


                Route::patch(
                    '/products/{product}',
                    [ProductController::class, 'update']
                )->middleware('can:products.update');


                Route::delete(
                    '/products/{product}',
                    [ProductController::class, 'destroy']
                )->middleware('can:products.delete');


                /*
                |--------------------------------------------------------------------------
                | Clientes
                |--------------------------------------------------------------------------
                */


                Route::get(
                    '/customers',
                    [CustomerController::class, 'index']
                )->middleware('can:customers.view');


                Route::post(
                    '/customers',
                    [CustomerController::class, 'store']
                )->middleware('can:customers.create');


                Route::get(
                    '/customers/{customer}',
                    [CustomerController::class, 'show']
                )->middleware('can:customers.view');


                Route::put(
                    '/customers/{customer}',
                    [CustomerController::class, 'update']
                )->middleware('can:customers.update');


                Route::patch(
                    '/customers/{customer}',
                    [CustomerController::class, 'update']
                )->middleware('can:customers.update');


                Route::delete(
                    '/customers/{customer}',
                    [CustomerController::class, 'destroy']
                )->middleware('can:customers.delete');


                /*
                |--------------------------------------------------------------------------
                | Bodegas
                |--------------------------------------------------------------------------
                */


                Route::get(
                    '/warehouses',
                    [WarehouseController::class, 'index']
                )->middleware('can:inventory.view');


                Route::post(
                    '/warehouses',
                    [WarehouseController::class, 'store']
                )->middleware('can:inventory.create');


                Route::get(
                    '/warehouses/{warehouse}',
                    [WarehouseController::class, 'show']
                )->middleware('can:inventory.view');


                Route::put(
                    '/warehouses/{warehouse}',
                    [WarehouseController::class, 'update']
                )->middleware('can:inventory.update');


                Route::patch(
                    '/warehouses/{warehouse}',
                    [WarehouseController::class, 'update']
                )->middleware('can:inventory.update');


                Route::post(
                    '/warehouses/{warehouse}/make-default',
                    [WarehouseController::class, 'makeDefault']
                )->middleware('can:inventory.update');


                Route::delete(
                    '/warehouses/{warehouse}',
                    [WarehouseController::class, 'destroy']
                )->middleware('can:inventory.update');


                /*
                |--------------------------------------------------------------------------
                | Inventario
                |--------------------------------------------------------------------------
                */


                Route::get(
                    '/inventory',
                    [InventoryController::class, 'index']
                )->middleware('can:inventory.view');


                Route::patch(
                    '/inventory/{inventory}',
                    [InventoryController::class, 'adjust']
                )->middleware('can:inventory.update');


                Route::get(
                    '/inventory/{inventory}/movements',
                    [InventoryController::class, 'movements']
                )->middleware('can:inventory.view');


            });


            /*
            |--------------------------------------------------------------------------
            | Pedidos
            |--------------------------------------------------------------------------
            |
            | Los pedidos existentes pueden gestionarse incluso si
            | la suscripción venció.
            |
            */


            Route::get(
                '/orders',
                [OrderController::class, 'index']
            )->middleware('can:orders.view');


            Route::get(
                '/orders/{order}',
                [OrderController::class, 'show']
            )->middleware('can:orders.view');


            Route::patch(
                '/orders/{order}/status',
                [OrderController::class, 'updateStatus']
            )->middleware('can:orders.update');


        });


    });


});
