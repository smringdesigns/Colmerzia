<?php

namespace App\Services\Checkout;

use App\Contracts\Payments\PaymentGatewayInterface;
use App\Exceptions\CartException;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Cart\CartService;
use App\Services\Inventory\InventoryService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Convierte un carrito activo en una orden, e inicia el cobro con la
 * pasarela de pago configurada (ver PaymentGatewayInterface).
 *
 * La pasarela activa por defecto es ManualPaymentGateway
 * (contraentrega/transferencia) — la orden y el pago quedan en
 * estado 'pending' hasta confirmación manual. Cuando se integre una
 * pasarela real (PSE, Wompi, tarjeta), el binding cambia en
 * AppServiceProvider y este servicio no necesita tocarse: solo pasa
 * a devolver una redirect_url real en vez de null.
 */
class CheckoutService
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly InventoryService $inventoryService,
        private readonly PaymentGatewayInterface $paymentGateway
    ) {
    }

    /**
     * @param array{name:string,email:string,phone?:string} $customerData
     * @param array $shippingAddress
     */
    public function checkout(
        Cart $cart,
        array $customerData,
        array $shippingAddress,
        string $paymentMethod = 'cash'
    ): Order {
        if (!$cart->isActive()) {
            throw new CartException('Este carrito ya no está disponible.');
        }

        if (!in_array($paymentMethod, $this->paymentGateway->supportedMethods(), true)) {
            throw new CartException(
                "El método de pago '{$paymentMethod}' no está disponible."
            );
        }

        $items = $cart->items()->get();

        if ($items->isEmpty()) {
            throw new CartException('El carrito está vacío.');
        }

        return DB::transaction(function () use ($cart, $items, $customerData, $shippingAddress, $paymentMethod) {

            // Re-valida stock DENTRO de la transacción, con lock, para
            // evitar que dos checkouts simultáneos vendan la misma
            // última unidad (condición de carrera clásica).
            foreach ($items as $item) {
                $this->inventoryService->lockAndAssertAvailable(
                    $cart->store_id,
                    $item->product_id,
                    $item->product_variant_id,
                    $item->quantity
                );
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
                        'product' => $product?->only(['id', 'name', 'sku', 'price', 'cost_price']),
                        'variant' => $variant?->only(['id', 'name', 'sku', 'price', 'cost_price', 'attributes']),
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    // Snapshot del costo en el momento de la venta (no el
                    // cost_price ACTUAL del producto): así el reporte de
                    // ganancias de un mes ya cerrado no cambia si después
                    // ajustás el costo del producto hoy.
                    'unit_cost' => $variant?->cost_price ?? $product?->cost_price ?? 0,
                    'discount' => $item->discount,
                    'tax' => $item->tax,
                    'total' => $item->total,
                ]);

                $inventory = $this->inventoryService->lockAndAssertAvailable(
                    $cart->store_id,
                    $item->product_id,
                    $item->product_variant_id,
                    $item->quantity
                );

                $this->inventoryService->decrementForSale(
                    $inventory,
                    $item->quantity,
                    $order->order_number
                );
            }

            if ($cart->coupon_id) {
                Coupon::where('id', $cart->coupon_id)->increment('used_count');
            }

            $cart->update(['status' => Cart::STATUS_CONVERTED]);

            // Inicia el cobro. Con la pasarela manual esto solo crea
            // el registro en `payments` en estado 'pending' — con una
            // pasarela real, acá es donde llegaría la redirect_url
            // (ej. la pantalla de PSE) que el frontend necesita
            // mostrarle al cliente para completar el pago.
            $this->paymentGateway->initiate($order, $paymentMethod);

            return $order->fresh(['items', 'payments']);
        });
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
