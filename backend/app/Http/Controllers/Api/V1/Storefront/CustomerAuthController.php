<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\Auth\LoginCustomerRequest;
use App\Http\Requests\Storefront\Auth\RegisterCustomerRequest;
use App\Http\Resources\Storefront\CustomerResource;
use App\Models\Cart;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    /**
     * Registra un cliente nuevo para la tienda actual.
     *
     * Si venía comprando como invitado (con X-Guest-Token), su
     * carrito activo se reasigna a la cuenta recién creada — así no
     * pierde lo que ya tenía en el carrito solo por registrarse a
     * mitad de la compra.
     */
    public function register(RegisterCustomerRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $customer = Customer::create([
            'store_id' => $storeId,
            'uuid' => Str::uuid(),
            'first_name' => $request->string('first_name')->toString(),
            'last_name' => $request->string('last_name')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->input('phone'),
            'password' => $request->string('password')->toString(),
            'is_active' => true,
        ]);

        $this->attachGuestCart($request, $customer, $storeId);

        $token = $customer->createToken('storefront')->plainTextToken;

        return response()->json([
            'data' => new CustomerResource($customer),
            'token' => $token,
        ], 201);
    }

    /**
     * Inicia sesión con correo y contraseña, dentro de la tienda
     * actual (el mismo correo puede existir como cliente en otra
     * tienda distinta, con otra cuenta — el email es único por
     * tienda, no en toda la plataforma).
     */
    public function login(LoginCustomerRequest $request)
    {
        $storeId = $this->currentStoreId($request);

        $customer = Customer::where('store_id', $storeId)
            ->where('email', $request->string('email')->toString())
            ->first();

        if (!$customer || !$customer->hasAccount() || !Hash::check(
            $request->string('password')->toString(),
            $customer->password
        )) {
            throw ValidationException::withMessages([
                'email' => 'Correo o contraseña incorrectos.',
            ]);
        }

        if (!$customer->is_active) {
            throw ValidationException::withMessages([
                'email' => 'Esta cuenta está desactivada.',
            ]);
        }

        $this->attachGuestCart($request, $customer, $storeId);

        $token = $customer->createToken('storefront')->plainTextToken;

        return response()->json([
            'data' => new CustomerResource($customer),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    public function me(Request $request)
    {
        return new CustomerResource($request->user('sanctum'));
    }

    /**
     * Si la petición trae un carrito de invitado activo (X-Guest-Token)
     * sin dueño todavía, lo asigna al cliente que se acaba de
     * registrar/loguear, en vez de dejarlo huérfano.
     *
     * Si el cliente YA tenía un carrito activo propio de antes, ese
     * se respeta y el de invitado simplemente queda abandonado (no
     * se combinan items — mezclar carritos automáticamente puede
     * sorprender al cliente con productos que no reconoce).
     */
    private function attachGuestCart(Request $request, Customer $customer, int $storeId): void
    {
        $guestToken = $request->header('X-Guest-Token');

        if (!$guestToken) {
            return;
        }

        $hasOwnActiveCart = Cart::where('store_id', $storeId)
            ->where('customer_id', $customer->id)
            ->where('status', Cart::STATUS_ACTIVE)
            ->exists();

        if ($hasOwnActiveCart) {
            return;
        }

        Cart::where('store_id', $storeId)
            ->where('guest_token', $guestToken)
            ->where('status', Cart::STATUS_ACTIVE)
            ->whereNull('customer_id')
            ->update(['customer_id' => $customer->id]);
    }
}
