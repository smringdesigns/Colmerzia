<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

use App\Contracts\Auth\AuthServiceInterface;
use App\Services\Auth\AuthService;
use App\Models\User;

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
        Gate::before(function (User $user, string $ability) {

            // Super-admin: acceso total
            if ($user->hasRole('super-admin')) {
                return true;
            }

            // Los demás usuarios acceden según sus permisos
            if ($user->hasPermission($ability)) {
                return true;
            }

            return false;
        });
    }
}