<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

// Auth
use App\Http\Controllers\Api\V1\Auth\AuthController;

// Onboarding
use App\Http\Controllers\Api\V1\Onboarding\StoreOnboardingController;

// Admin
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\WarehouseController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\PermissionController;

// Plataforma (super-admin, cruza todas las tiendas)
use App\Http\Controllers\Api\V1\Platform\PlatformController;

// Storefront
use App\Http\Controllers\Api\V1\Storefront\CartController;
use App\Http\Controllers\Api\V1\Storefront\CheckoutController;
use App\Http\Controllers\Api\V1\Storefront\CustomerAddressController;
use App\Http\Controllers\Api\V1\Storefront\CustomerAuthController;
use App\Http\Controllers\Api\V1\Storefront\ProductController as StorefrontProductController;
use App\Http\Controllers\Api\V1\Storefront\CategoryController as StorefrontCategoryController;
use App\Http\Controllers\Api\V1\Storefront\StoreController as StorefrontStoreController;


/*
|--------------------------------------------------------------------------
| API V1
|--------------------------------------------------------------------------
|
| Estructura:
|
| /api/v1
|
| ├── Públicas
| │   ├── onboarding
| │   ├── register
| │   ├── login
| │   ├── password
| │   └── email verification
| |
| ├── Autenticadas sin tenant
| │   ├── me
| │   ├── logout
| │   └── stores
| |
| └── Multi-tenant
|     │
|     ├── Storefront público
|     │   ├── store
|     │   ├── products
|     │   ├── categories
|     │   ├── cart
|     │   └── checkout
|     │
|     └── Panel administrativo
|         ├── products
|         ├── customers
|         ├── warehouses
|         ├── inventory
|         ├── settings
|         ├── users
|         ├── roles
|         ├── permissions
|         └── orders
|
|--------------------------------------------------------------------------
|
| Las rutas multi-tenant requieren:
|
| - tenant
| - store.active
|
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 1. RUTAS PÚBLICAS
    |--------------------------------------------------------------------------
    */

    // Onboarding
    Route::post(
        '/onboarding',
        [StoreOnboardingController::class, 'store']
    )->middleware('throttle:register');

    // Catálogo de tipos de negocio (para el <select> del onboarding)
    Route::get(
        '/business-types',
        [StoreOnboardingController::class, 'businessTypes']
    );


    // Registro
    Route::post(
        '/register',
        [AuthController::class, 'register']
    )->middleware('throttle:register');


    // Login
    Route::post(
        '/login',
        [AuthController::class, 'login']
    )->middleware('throttle:login');


    // Recuperación de contraseña
    Route::post(
        '/forgot-password',
        [AuthController::class, 'forgotPassword']
    )->middleware('throttle:6,1');

    Route::post(
        '/reset-password',
        [AuthController::class, 'resetPassword']
    )->middleware('throttle:6,1');


    // Verificación de correo
    Route::get(
        '/email/verify/{id}/{hash}',
        [AuthController::class, 'verifyEmail']
    )
        ->middleware([
            'signed',
            'throttle:6,1',
        ])
        ->name('verification.verify');


    /*
    |--------------------------------------------------------------------------
    | 2. SESIÓN AUTENTICADA SIN TENANT
    |--------------------------------------------------------------------------
    */

    Route::middleware('auth:sanctum')->group(function () {

        // Usuario autenticado
        Route::get(
            '/me',
            [AuthController::class, 'me']
        );

        // Logout
        Route::post(
            '/logout',
            [AuthController::class, 'logout']
        );

        // Reenviar verificación
        Route::post(
            '/email/verification-notification',
            [AuthController::class, 'sendVerificationEmail']
        )->middleware('throttle:6,1');

        // Crear tienda
        Route::post(
            '/stores',
            [StoreController::class, 'store']
        )->middleware('throttle:register');


        /*
        |--------------------------------------------------------------------------
        | Plataforma (solo super-admin, sin tenant)
        |--------------------------------------------------------------------------
        |
        | A propósito viven acá, fuera del grupo 'tenant' de más abajo:
        | necesitan ver datos de TODAS las tiendas a la vez, así que
        | resolver un tenant primero sería contradictorio. La única
        | protección que necesitan es 'super-admin'.
        |
        */

        Route::prefix('platform')
            ->middleware('super-admin')
            ->group(function () {

                Route::get('/stores', [PlatformController::class, 'stores']);
                Route::get('/stores/{id}', [PlatformController::class, 'showStore']);
                Route::delete('/stores/{id}', [PlatformController::class, 'destroyStore']);
                Route::get('/users', [PlatformController::class, 'users']);
                Route::delete('/users/{id}', [PlatformController::class, 'destroyUser']);

            });

    });


    /*
    |--------------------------------------------------------------------------
    | 3. RUTAS MULTI-TENANT
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'tenant',
        'store.active',
    ])->group(function () {


        /*
        |--------------------------------------------------------------------------
        | 3.1 STOREFRONT PÚBLICO
        |--------------------------------------------------------------------------
        */

        Route::prefix('storefront')->group(function () {

            /*
            |--------------------------------------------------------------------------
            | Información de la tienda
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/store',
                [StorefrontStoreController::class, 'show']
            );


            /*
            |--------------------------------------------------------------------------
            | Catálogo
            |--------------------------------------------------------------------------
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
            | Cuenta de cliente
            |--------------------------------------------------------------------------
            |
            | Registro/login son públicos (obvio). "Mi cuenta" y
            | direcciones requieren 'customer' — el mismo tipo de
            | chequeo que 'super-admin', pero para distinguir un
            | Customer autenticado de un User del panel.
            |
            */

            Route::prefix('auth')->group(function () {

                Route::post(
                    '/register',
                    [CustomerAuthController::class, 'register']
                )->middleware('throttle:register');

                Route::post(
                    '/login',
                    [CustomerAuthController::class, 'login']
                )->middleware('throttle:login');

            });

            Route::middleware('customer')->group(function () {

                Route::post(
                    '/auth/logout',
                    [CustomerAuthController::class, 'logout']
                );

                Route::get(
                    '/me',
                    [CustomerAuthController::class, 'me']
                );

                Route::get(
                    '/addresses',
                    [CustomerAddressController::class, 'index']
                );

                Route::post(
                    '/addresses',
                    [CustomerAddressController::class, 'store']
                );

                Route::put(
                    '/addresses/{id}',
                    [CustomerAddressController::class, 'update']
                );

                Route::delete(
                    '/addresses/{id}',
                    [CustomerAddressController::class, 'destroy']
                );

            });


            /*
            |--------------------------------------------------------------------------
            | Carrito y Checkout
            |--------------------------------------------------------------------------
            |
            | Requieren subscription.writable.
            |
            */

            Route::middleware('subscription.writable')->group(function () {

                // Carrito
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


                // Checkout
                Route::post(
                    '/checkout',
                    [CheckoutController::class, 'store']
                );

            });

        });


        /*
        |--------------------------------------------------------------------------
        | 3.2 PANEL ADMINISTRATIVO
        |--------------------------------------------------------------------------
        */

        Route::middleware('auth:sanctum')->group(function () {

            /*
            |--------------------------------------------------------------------------
            | Operaciones de escritura
            |--------------------------------------------------------------------------
            |
            | Requieren subscription.writable.
            |
            */

            Route::middleware('subscription.writable')->group(function () {

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


                /*
                |--------------------------------------------------------------------------
                | Configuración de tienda
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/settings/store',
                    [StoreController::class, 'me']
                )->middleware('can:settings.view');

                Route::put(
                    '/settings/store',
                    [StoreController::class, 'update']
                )->middleware('can:settings.update');


                /*
                |--------------------------------------------------------------------------
                | Usuarios / Staff
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/users',
                    [UserController::class, 'index']
                )->middleware('can:users.view');

                Route::post(
                    '/users',
                    [UserController::class, 'store']
                )->middleware('can:users.create');

                Route::get(
                    '/users/{user}',
                    [UserController::class, 'show']
                )->middleware('can:users.view');

                Route::put(
                    '/users/{user}',
                    [UserController::class, 'update']
                )->middleware('can:users.update');

                Route::patch(
                    '/users/{user}',
                    [UserController::class, 'update']
                )->middleware('can:users.update');

                Route::delete(
                    '/users/{user}',
                    [UserController::class, 'destroy']
                )->middleware('can:users.delete');


                /*
                |--------------------------------------------------------------------------
                | Roles
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/roles',
                    [RoleController::class, 'index']
                )->middleware('can:roles.view');

                Route::post(
                    '/roles',
                    [RoleController::class, 'store']
                )->middleware('can:roles.create');

                Route::get(
                    '/roles/{role}',
                    [RoleController::class, 'show']
                )->middleware('can:roles.view');

                Route::put(
                    '/roles/{role}',
                    [RoleController::class, 'update']
                )->middleware('can:roles.update');

                Route::patch(
                    '/roles/{role}',
                    [RoleController::class, 'update']
                )->middleware('can:roles.update');

                Route::delete(
                    '/roles/{role}',
                    [RoleController::class, 'destroy']
                )->middleware('can:roles.delete');


                /*
                |--------------------------------------------------------------------------
                | Permisos
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/permissions',
                    [PermissionController::class, 'index']
                )->middleware('can:roles.view');

            });


            /*
            |--------------------------------------------------------------------------
            | 3.3 PEDIDOS
            |--------------------------------------------------------------------------
            |
            | Los pedidos existentes pueden gestionarse aunque
            | la suscripción esté en modo de solo lectura.
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