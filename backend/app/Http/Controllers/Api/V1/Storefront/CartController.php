<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Exceptions\CartException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\AddCartItemRequest;
use App\Http\Requests\Storefront\ApplyCouponRequest;
use App\Http\Requests\Storefront\UpdateCartItemRequest;
use App\Http\Resources\Storefront\CartResource;
use App\Models\Customer;
use App\Services\Cart\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {
    }

    /**
     * Si la petición trae un token Sanctum válido de un Customer
     * (no de un User de panel), lo devuelve — si no, null, y el
     * carrito se resuelve como invitado por X-Guest-Token, igual
     * que siempre. No es un middleware porque estas rutas son
     * públicas: deben funcionar CON o SIN sesión de cliente.
     */
    private function authenticatedCustomer(Request $request): ?Customer
    {
        $user = $request->user('sanctum');

        return $user instanceof Customer ? $user : null;
    }

    /**
     * Muestra el carrito actual.
     *
     * Aunque el carrito se cree automáticamente cuando no existe,
     * una solicitud GET siempre debe responder con HTTP 200.
     */
    public function show(Request $request)
    {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        return (new CartResource(
            $cart->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        ))->response()->setStatusCode(200);
    }

    /**
     * Agrega un producto o una variante al carrito.
     */
    public function addItem(AddCartItemRequest $request)
    {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        try {
            $this->cartService->addItem(
                $cart,
                $request->integer('product_id'),
                $request->filled('product_variant_id')
                    ? $request->integer('product_variant_id')
                    : null,
                $request->integer('quantity')
            );
        } catch (CartException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return new CartResource(
            $cart->fresh()->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        );
    }

    /**
     * Actualiza la cantidad de un producto del carrito.
     */
    public function updateItem(
        UpdateCartItemRequest $request,
        int $item
    ) {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        try {
            $this->cartService->updateItemQuantity(
                $cart,
                $item,
                $request->integer('quantity')
            );
        } catch (CartException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return new CartResource(
            $cart->fresh()->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        );
    }

    /**
     * Elimina un producto del carrito.
     */
    public function removeItem(
        Request $request,
        int $item
    ) {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        try {
            $this->cartService->removeItem(
                $cart,
                $item
            );
        } catch (CartException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return new CartResource(
            $cart->fresh()->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        );
    }

    /**
     * Aplica un cupón al carrito.
     */
    public function applyCoupon(
        ApplyCouponRequest $request
    ) {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        try {
            $this->cartService->applyCoupon(
                $cart,
                $request->string('code')->toString()
            );
        } catch (CartException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return new CartResource(
            $cart->fresh()->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        );
    }

    /**
     * Elimina el cupón aplicado al carrito.
     */
    public function removeCoupon(Request $request)
    {
        [$cart, $guestToken] = $this->cartService->resolveCart(
            $this->currentStoreId($request),
            $request->header('X-Guest-Token'),
            $this->authenticatedCustomer($request)
        );

        $this->cartService->removeCoupon($cart);

        return new CartResource(
            $cart->fresh()->load(
                'items.product',
                'items.productVariant',
                'coupon'
            ),
            $guestToken
        );
    }
}
