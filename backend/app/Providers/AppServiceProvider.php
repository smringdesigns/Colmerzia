<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Contracts\Auth\AuthServiceInterface;
use App\Services\Auth\AuthService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AuthServiceInterface::class,
            AuthService::class
        );
    }

    public function boot(): void
    {
        //
    }
}