<?php

use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;
use Laravel\Sanctum\Sanctum;

return [
    'stateful' => array_values(array_filter(array_map(
        static fn (string $host): string => trim($host),
        explode(',', (string) env(
            'SANCTUM_STATEFUL_DOMAINS',
            sprintf(
                '%s%s',
                'localhost,localhost:5173,localhost:5174,127.0.0.1,127.0.0.1:5173,127.0.0.1:5174,::1',
                Sanctum::currentApplicationUrlWithPort(),
            )
        ))
    ))),

    'guard' => ['web'],

    // Minutos. Debe ser finito en producción para limitar el impacto
    // de un token Bearer filtrado.
    'expiration' => (int) env('SANCTUM_TOKEN_EXPIRATION', 10080),

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', 'colmerzia_'),

    'middleware' => [
        'authenticate_session' => AuthenticateSession::class,
        'encrypt_cookies' => EncryptCookies::class,
        'validate_csrf_token' => ValidateCsrfToken::class,
    ],
];
