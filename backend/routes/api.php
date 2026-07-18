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
        Route::apiResource('customers', CustomerController::class);
    });
});