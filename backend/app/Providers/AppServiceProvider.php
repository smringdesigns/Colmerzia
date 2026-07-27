<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

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

        $this->configureRateLimiting();
    }

    /**
     * Límites de peticiones para la API.
     *
     * 'api': límite general, aplicado a todas las rutas de la API
     * (registrado vía $middleware->throttleApi() en bootstrap/app.php).
     * Se identifica por usuario autenticado si hay uno, o por IP.
     *
     * 'login': límite específico y más estricto para /login, porque
     * ahí el costo de no limitar es mucho mayor (fuerza bruta de
     * contraseñas). Combina dos reglas:
     *   - máx. 5 intentos/minuto por combinación IP + email: protege
     *     una cuenta puntual de fuerza bruta dirigida.
     *   - máx. 20 intentos/minuto por IP en total: protege contra
     *     credential stuffing (probar muchos emails distintos desde
     *     la misma IP).
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            $email = strtolower((string) $request->input('email'));

            return [
                Limit::perMinute(5)->by($request->ip() . '|' . $email),
                Limit::perMinute(20)->by($request->ip()),
            ];
        });

        // Registro: límite más generoso que login (no hay contraseñas
        // que adivinar), pero igual acotado por IP para prevenir spam
        // de creación de cuentas.
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}