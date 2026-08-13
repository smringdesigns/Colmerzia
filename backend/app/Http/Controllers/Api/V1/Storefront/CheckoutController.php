<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Exceptions\CartException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\OrderResource;
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
        [$cart] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token')
        );

        try {
            $order = $this->checkoutService->checkout(
                $cart,
                $request->input('customer'),
                $request->input('shipping_address')
            );
        } catch (CartException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(
            (new OrderResource($order))->resolve($request),
            201
        );
    }
}
