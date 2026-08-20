<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Exceptions\CartException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\OrderResource;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Services\Cart\CartService;
use App\Services\Checkout\CheckoutService;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly CheckoutService $checkoutService
    ) {
    }

    public function store(CheckoutRequest $request)
    {
        $customer = $request->user('sanctum');
        $customer = $customer instanceof Customer ? $customer : null;

        [$cart] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $customer
        );

        try {
            $order = $this->checkoutService->checkout(
                $cart,
                $this->resolveCustomerData($request, $customer),
                $this->resolveShippingAddress($request, $customer),
                $request->string('payment_method')->toString()
            );
        } catch (CartException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(
            (new OrderResource($order))->resolve($request),
            201
        );
    }

    /**
     * Si hay un cliente logueado, sus propios datos son la fuente de
     * verdad — no confiamos en lo que venga en el body para nombre/
     * email de alguien ya identificado. Un invitado sí manda todo a
     * mano, como siempre.
     */
    private function resolveCustomerData(CheckoutRequest $request, ?Customer $customer): array
    {
        if ($customer) {
            return [
                'name' => trim("{$customer->first_name} {$customer->last_name}"),
                'email' => $customer->email,
                'phone' => $customer->phone,
            ];
        }

        return $request->input('customer');
    }

    /**
     * Un cliente logueado puede elegir una de sus direcciones
     * guardadas (shipping_address_id) en vez de volver a escribirla
     * cada vez. Si no manda una, o si es invitado, se usa el bloque
     * shipping_address tal como llegó (mismo formato de siempre).
     */
    private function resolveShippingAddress(CheckoutRequest $request, ?Customer $customer): array
    {
        if ($customer && $request->filled('shipping_address_id')) {

            $address = CustomerAddress::where('customer_id', $customer->id)
                ->findOrFail($request->integer('shipping_address_id'));

            return [
                'line1' => $address->address_line_1,
                'line2' => $address->address_line_2,
                'city' => $address->city,
                'state' => $address->state,
                'country' => $address->country,
                'postal_code' => $address->postal_code,
                'recipient_name' => $address->recipient_name,
                'phone' => $address->phone,
            ];
        }

        return $request->input('shipping_address');
    }
}

