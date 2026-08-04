<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        |
        | El super admin pertenece al nivel plataforma.
        | No necesita seleccionar una tienda para entrar.
        |
        */
        $user = $request->user();

        if ($user && $user->hasRole('super-admin')) {
            return $next($request);
        }


        /*
        |--------------------------------------------------------------------------
        | Usuarios de tienda
        |--------------------------------------------------------------------------
        |
        | Store owner, empleados, etc.
        | Necesitan enviar X-Tenant desde React.
        |
        */
        $subdomain = $request->header('X-Tenant');

        if (!$subdomain) {
            return response()->json([
                'success' => false,
                'message' => 'No se ha especificado un espacio de trabajo válido. Si el problema persiste, intenta iniciar sesión nuevamente.'
            ], 400);
        }


        $store = Store::where('subdomain', $subdomain)->first();


        if (!$store || !$store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El espacio de trabajo al que intentas acceder no existe o se encuentra temporalmente inactivo.'
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Guardar tenant actual
        |--------------------------------------------------------------------------
        */
        app()->instance('tenant', $store);


        return $next($request);
    }
}