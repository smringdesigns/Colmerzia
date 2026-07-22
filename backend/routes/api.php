<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CustomerController;

Route::prefix('v1')->group(function () {

    // Autenticación pública
    Route::post('/login', [AuthController::class, 'login']);

    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

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

});