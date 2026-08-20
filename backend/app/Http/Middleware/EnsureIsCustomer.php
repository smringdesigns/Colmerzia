<?php

namespace App\Http\Middleware;

use App\Models\Customer;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Protege las rutas de cliente del storefront (mi cuenta, mis
 * direcciones). Confirma que el token autenticado pertenece a un
 * Customer, no a un User del panel administrativo — ambos usan
 * tokens Sanctum sobre el mismo esquema, así que esta es la
 * distinción real entre "sesión de cliente" y "sesión de staff".
 */
class EnsureIsCustomer
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $customer = $request->user('sanctum');

        if (!$customer || !$customer instanceof Customer) {
            return response()->json([
                'message' => 'Necesitas iniciar sesión como cliente.',
            ], 401);
        }

        return $next($request);
    }
}
