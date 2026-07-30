<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Onboarding\StoreOnboardingController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\Storefront\CartController;
use App\Http\Controllers\Api\V1\Storefront\CheckoutController;

Route::prefix('v1')->middleware(['tenant', 'store.active'])->group(function () {

    // Onboarding: crear una tienda nueva (dueño de negocio, sin
    // tenant resuelto todavía). No lleva 'store.active' porque la
    // tienda ni siquiera existe hasta que este endpoint responde.
    Route::post('/onboarding', [StoreOnboardingController::class, 'store'])
        ->middleware('throttle:register');

    // Autenticación pública
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:register');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login');

    // Storefront público: carrito y checkout de clientes finales.
    // No lleva auth:sanctum (los clientes no son 'User' de staff),
    // se identifican por el header X-Guest-Token. Sí lleva
    // subscription.writable: una tienda sin plan vigente no debería
    // seguir recibiendo pedidos nuevos, igual que no puede crear
    // productos.
    Route::prefix('storefront')->middleware(['subscription.writable'])->group(function () {
        Route::get('/cart', [CartController::class, 'show']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::patch('/cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
        Route::post('/cart/coupon', [CartController::class, 'applyCoupon']);
        Route::delete('/cart/coupon', [CartController::class, 'removeCoupon']);

        Route::post('/checkout', [CheckoutController::class, 'store']);
    });

    // Rutas protegidas (staff)
    Route::middleware(['auth:sanctum'])->group(function () {

        // Auth
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Productos y Clientes: bloqueados en modo solo-lectura
        // (prueba vencida). Gestionar pedidos que YA existen, en
        // cambio, no se bloquea acá abajo — un pedido ya cobrado
        // antes de que venciera la prueba debe poder despacharse
        // igual.
        Route::middleware('subscription.writable')->group(function () {

            // Productos
            Route::get('/products', [ProductController::class, 'index'])
                ->middleware('can:products.view');

            Route::post('/products', [ProductController::class, 'store'])
                ->middleware('can:products.create');

            Route::get('/products/{product}', [ProductController::class, 'show'])
                ->middleware('can:products.view');

            Route::put('/products/{product}', [ProductController::class, 'update'])
                ->middleware('can:products.update');

            Route::patch('/products/{product}', [ProductController::class, 'update'])
                ->middleware('can:products.update');

            Route::delete('/products/{product}', [ProductController::class, 'destroy'])
                ->middleware('can:products.delete');

            // Clientes
            Route::get('/customers', [CustomerController::class, 'index'])
                ->middleware('can:customers.view');

            Route::post('/customers', [CustomerController::class, 'store'])
                ->middleware('can:customers.create');

            Route::get('/customers/{customer}', [CustomerController::class, 'show'])
                ->middleware('can:customers.view');

            Route::put('/customers/{customer}', [CustomerController::class, 'update'])
                ->middleware('can:customers.update');

            Route::patch('/customers/{customer}', [CustomerController::class, 'update'])
                ->middleware('can:customers.update');

            Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])
                ->middleware('can:customers.delete');

        });

        // Pedidos: el staff siempre puede ver y gestionar los pedidos
        // que ya existen, sin importar el estado de la suscripción.
        Route::get('/orders', [OrderController::class, 'index'])
            ->middleware('can:orders.view');

        Route::get('/orders/{order}', [OrderController::class, 'show'])
            ->middleware('can:orders.view');

        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])
            ->middleware('can:orders.update');

    });

});