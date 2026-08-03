<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Onboarding\StoreOnboardingController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\Storefront\CartController;
use App\Http\Controllers\Api\V1\Storefront\CheckoutController;

// 1. ABRIMOS EL GRUPO V1 (¡SIN EL MIDDLEWARE TENANT AQUÍ!)
Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | RUTAS PÚBLICAS Y DE AUTENTICACIÓN (LIBRES DE TENANT)
    |--------------------------------------------------------------------------
    */
    // Onboarding: crear una tienda nueva
    Route::post('/onboarding', [StoreOnboardingController::class, 'store'])
        ->middleware('throttle:register');

    // Autenticación pública
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:register');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login');

    // Rutas de recuperación de contraseña
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:6,1');

    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:6,1');

    // Confirmación de correo
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');


    /*
    |--------------------------------------------------------------------------
    | RUTAS PROTEGIDAS POR SESIÓN (PERO SIN TENANT)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        
        // Reenviar correo de verificación
        Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
            ->middleware('throttle:6,1');
    });


    /*
    |--------------------------------------------------------------------------
    | RUTAS DE LA TIENDA MULTI-TENANT (AQUÍ SÍ EXIGIMOS EL TENANT)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['tenant', 'store.active'])->group(function () {

        // Storefront público: carrito y checkout de clientes finales.
        Route::prefix('storefront')->middleware(['subscription.writable'])->group(function () {
            Route::get('/cart', [CartController::class, 'show']);
            Route::post('/cart/items', [CartController::class, 'addItem']);
            Route::patch('/cart/items/{item}', [CartController::class, 'updateItem']);
            Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
            Route::post('/cart/coupon', [CartController::class, 'applyCoupon']);
            Route::delete('/cart/coupon', [CartController::class, 'removeCoupon']);
            Route::post('/checkout', [CheckoutController::class, 'store']);
        });

        // Rutas protegidas (staff de la tienda)
        Route::middleware(['auth:sanctum'])->group(function () {

            // Productos y Clientes: bloqueados en modo solo-lectura
            Route::middleware('subscription.writable')->group(function () {
                // Productos
                Route::get('/products', [ProductController::class, 'index'])->middleware('can:products.view');
                Route::post('/products', [ProductController::class, 'store'])->middleware('can:products.create');
                Route::get('/products/{product}', [ProductController::class, 'show'])->middleware('can:products.view');
                Route::put('/products/{product}', [ProductController::class, 'update'])->middleware('can:products.update');
                Route::patch('/products/{product}', [ProductController::class, 'update'])->middleware('can:products.update');
                Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('can:products.delete');

                // Clientes
                Route::get('/customers', [CustomerController::class, 'index'])->middleware('can:customers.view');
                Route::post('/customers', [CustomerController::class, 'store'])->middleware('can:customers.create');
                Route::get('/customers/{customer}', [CustomerController::class, 'show'])->middleware('can:customers.view');
                Route::put('/customers/{customer}', [CustomerController::class, 'update'])->middleware('can:customers.update');
                Route::patch('/customers/{customer}', [CustomerController::class, 'update'])->middleware('can:customers.update');
                Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->middleware('can:customers.delete');
            });

            // Pedidos: el staff siempre puede ver y gestionar los pedidos
            Route::get('/orders', [OrderController::class, 'index'])->middleware('can:orders.view');
            Route::get('/orders/{order}', [OrderController::class, 'show'])->middleware('can:orders.view');
            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware('can:orders.update');
        });
    });
});