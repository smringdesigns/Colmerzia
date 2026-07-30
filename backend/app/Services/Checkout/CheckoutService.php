<?php

namespace App\Services\Checkout;

use App\Exceptions\CartException;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Cart\CartService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Convierte un carrito activo en una orden.
 *
 * NOTA sobre pagos: esto crea la Order en estado 'pending' /
 * payment_status 'pending'. No se integra ninguna pasarela de pago
 * real todavía (mismo criterio usado en el sistema de planes) — el
 * registro en `payments` queda como responsabilidad de un paso
 * posterior (webhook de la pasarela, o confirmación manual), no de
 * este servicio.
 */
class CheckoutService
{
    public function __construct(
        private readonly CartService $cartService
    ) {
    }

    /**
     * @param array{name:string,email:string,phone?:string} $customerData
     * @param array $shippingAddress
     */
    public function checkout(Cart $cart, array $customerData, array $shippingAddress): Order
    {
        if (!$cart->isActive()) {
            throw new CartException('Este carrito ya no está disponible.');
        }

        $items = $cart->items()->get();

        if ($items->isEmpty()) {
            throw new CartException('El carrito está vacío.');
        }

        return DB::transaction(function () use ($cart, $items, $customerData, $shippingAddress) {

            // Re-valida stock DENTRO de la transacción, con lock, para
            // evitar que dos checkouts simultáneos vendan la misma
            // última unidad (condición de carrera clásica).
            foreach ($items as $item) {
                $this->lockAndValidateStock($item->product_id, $item->product_variant_id, $item->quantity);
            }

            // Recalcula totales una última vez por si algo cambió
            // (precio, cupón vencido, etc.) entre que se armó el
            // carrito y el momento del pago.
            $this->cartService->recalculateTotals($cart);
            $cart->refresh();

            $order = Order::create([
                'store_id' => $cart->store_id,
                'customer_id' => $cart->customer_id,
                'cart_id' => $cart->id,
                'uuid' => Str::uuid(),
                'order_number' => $this->generateOrderNumber(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'shipping_status' => 'pending',
                'subtotal' => $cart->subtotal,
                'discount' => $cart->discount,
                'tax' => $cart->tax,
                'shipping' => $cart->shipping,
                'total' => $cart->total,
                'customer_snapshot' => $customerData,
                'shipping_address' => $shippingAddress,
            ]);

            foreach ($items as $item) {
                $product = Product::find($item->product_id);
                $variant = $item->product_variant_id
                    ? ProductVariant::find($item->product_variant_id)
                    : null;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'uuid' => Str::uuid(),
                    'product_name' => $product?->name ?? 'Producto eliminado',
                    'product_sku' => $variant?->sku ?? $product?->sku,
                    'product_snapshot' => [
                        'product' => $product?->only(['id', 'name', 'sku', 'price']),
                        'variant' => $variant?->only(['id', 'name', 'sku', 'price', 'attributes']),
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'discount' => $item->discount,
                    'tax' => $item->tax,
                    'total' => $item->total,
                ]);

                $this->decrementStock($item->product_id, $item->product_variant_id, $item->quantity);
            }

            if ($cart->coupon_id) {
                Coupon::where('id', $cart->coupon_id)->increment('used_count');
            }

            $cart->update(['status' => Cart::STATUS_CONVERTED]);

            return $order->fresh(['items', 'payments']);
        });
    }

    private function lockAndValidateStock(int $productId, ?int $variantId, int $quantity): void
    {
        if ($variantId) {
            $variant = ProductVariant::where('id', $variantId)->lockForUpdate()->first();

            if (!$variant || $variant->stock < $quantity) {
                throw new CartException('Uno de los productos ya no tiene stock suficiente.');
            }

            return;
        }

        $product = Product::where('id', $productId)->lockForUpdate()->first();

        if (!$product || $product->stock < $quantity) {
            throw new CartException('Uno de los productos ya no tiene stock suficiente.');
        }
    }

    private function decrementStock(int $productId, ?int $variantId, int $quantity): void
    {
        if ($variantId) {
            ProductVariant::where('id', $variantId)->decrement('stock', $quantity);

            return;
        }

        Product::where('id', $productId)->decrement('stock', $quantity);
    }

    /**
     * ORD-{año}-{fecha/hora compacta}{sufijo aleatorio}. `order_number`
     * es único a nivel de TODA la plataforma (no por tienda, así está
     * definida la columna en la migración), por eso no se puede usar
     * un contador secuencial simple sin una tabla de conteo dedicada
     * — esto es sencillo y evita colisiones, pero si más adelante
     * quieren números consecutivos "bonitos" por tienda (ORD-0001,
     * ORD-0002...), eso necesita su propio contador con lock.
     */
    private function generateOrderNumber(): string
    {
        return 'ORD-' . now()->format('Y') . '-' . now()->format('YmdHis') . strtoupper(Str::random(4));
    }
}
