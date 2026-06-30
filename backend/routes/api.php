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
        Route::get('/me',      [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Productos
        Route::apiResource('products',  ProductController::class);

        // Clientes
        Route::apiResource('customers', CustomerController::class);
    });
});
