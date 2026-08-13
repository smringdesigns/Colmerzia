<?php

namespace App\Services\Cart;

use App\Exceptions\CartException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\DiscountRule;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Inventory\InventoryService;
use Illuminate\Support\Str;

class CartService
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {
    }

    public function resolveCart(int $storeId, ?string $guestToken): array
    {
        if ($guestToken) {
            $cart = Cart::where('store_id', $storeId)
                ->where('guest_token', $guestToken)
                ->where('status', Cart::STATUS_ACTIVE)
                ->first();

            if ($cart) {
                return [$cart, $guestToken];
            }
        }

        $guestToken = (string) Str::uuid();

        $cart = Cart::create([
            'store_id' => $storeId,
            'guest_token' => $guestToken,
            'status' => Cart::STATUS_ACTIVE,
            'last_activity_at' => now(),
        ]);

        return [$cart, $guestToken];
    }

    public function addItem(Cart $cart, int $productId, ?int $variantId, int $quantity): CartItem
    {
        if ($quantity < 1) {
            throw new CartException('La cantidad debe ser al menos 1.');
        }

        $product = Product::where('store_id', $cart->store_id)->find($productId);

        if (!$product) {
            throw new CartException('El producto no existe en esta tienda.');
        }

        $variant = null;

        if ($product->has_variants) {
            if (!$variantId) {
                throw new CartException('Este producto requiere seleccionar una variante.');
            }

            $variant = ProductVariant::where('product_id', $product->id)->find($variantId);

            if (!$variant) {
                throw new CartException('La variante seleccionada no existe.');
            }
        }

        // Buscamos si el item ya existe en el carrito
        $existing = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->where('product_variant_id', $variant?->id)
            ->first();

        // Sumamos la cantidad existente con la nueva
        $newQuantity = ($existing ? $existing->quantity : 0) + $quantity;

        $this->assertStockAvailable($product, $variant, $newQuantity);

        $unitPrice = $this->unitPrice($product, $variant);
        $totalPrice = $unitPrice * $newQuantity;

        if ($existing) {
            $existing->update([
                'quantity' => $newQuantity,
                'unit_price' => $unitPrice,
                'total' => $totalPrice, 
            ]);
            $item = $existing;
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $newQuantity,
                'unit_price' => $unitPrice,
                'total' => $totalPrice, 
            ]);
        }

        $this->recalculateTotals($cart->fresh());

        return $item->fresh();
    }

    public function updateItemQuantity(Cart $cart, int $itemId, int $quantity): ?CartItem
    {
        $item = CartItem::where('cart_id', $cart->id)->findOrFail($itemId);

        if ($quantity < 1) {
            $item->delete();
            $this->recalculateTotals($cart->fresh());

            return null;
        }

        $product = Product::findOrFail($item->product_id);
        $variant = $item->product_variant_id
            ? ProductVariant::find($item->product_variant_id)
            : null;

        $this->assertStockAvailable($product, $variant, $quantity);

        $unitPrice = $this->unitPrice($product, $variant);

        $item->update([
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $unitPrice * $quantity, 
        ]);

        $this->recalculateTotals($cart->fresh());

        return $item->fresh();
    }

    public function removeItem(Cart $cart, int $itemId): void
    {
        CartItem::where('cart_id', $cart->id)->findOrFail($itemId)->delete();
        $this->recalculateTotals($cart->fresh());
    }

    public function applyCoupon(Cart $cart, string $code): Cart
    {
        $coupon = Coupon::where('store_id', $cart->store_id)
            ->where('code', $code)
            ->first();

        if (!$coupon || !$coupon->isValidNow()) {
            throw new CartException('Este cupón no es válido.');
        }

        if ($coupon->minimum_amount && $cart->subtotal < $coupon->minimum_amount) {
            throw new CartException(
                "Este cupón requiere una compra mínima de {$coupon->minimum_amount}."
            );
        }

        $cart->update(['coupon_id' => $coupon->id]);
        $this->recalculateTotals($cart->fresh());

        return $cart->fresh();
    }

    public function removeCoupon(Cart $cart): Cart
    {
        $cart->update(['coupon_id' => null]);
        $this->recalculateTotals($cart->fresh());

        return $cart->fresh();
    }

    public function recalculateTotals(Cart $cart): void
    {
        // SOLUCIÓN: Hacemos la suma en PHP en lugar de depender de SQL
        // Esto garantiza que SQLite no falle al sumar los decimales
        $subtotal = $cart->items()->get()->sum(function ($item) {
            return (float) $item->total;
        });

        $discount = $this->automaticDiscountAmount($cart->store_id, $subtotal);

        if ($cart->coupon_id) {
            $coupon = Coupon::find($cart->coupon_id);

            if ($coupon && $coupon->isValidNow()
                && (!$coupon->minimum_amount || $subtotal >= $coupon->minimum_amount)) {
                $discount += $this->couponDiscountAmount($coupon, $subtotal);
            }
        }

        $discount = min($discount, $subtotal);

        $cart->update([
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => 0,
            'shipping' => 0,
            'total' => max($subtotal - $discount, 0),
            'last_activity_at' => now(),
        ]);
    }

    private function automaticDiscountAmount(int $storeId, float $subtotal): float
    {
        if ($subtotal <= 0) {
            return 0;
        }

        $rule = DiscountRule::where('store_id', $storeId)
            ->whereIn('type', ['percentage', 'fixed'])
            ->orderByDesc('priority')
            ->get()
            ->first(function (DiscountRule $rule) use ($subtotal) {
                if (method_exists($rule, 'isValidNow') && !$rule->isValidNow()) {
                    return false;
                }
                $minimum = ($rule->conditions ?? [])['minimum_amount'] ?? null;
                return !$minimum || $subtotal >= $minimum;
            });

        if (!$rule) {
            return 0;
        }

        return $rule->type === 'percentage'
            ? $subtotal * ((float) $rule->value / 100)
            : (float) $rule->value;
    }

    private function couponDiscountAmount(Coupon $coupon, float $subtotal): float
    {
        if ($coupon->type === 'free_shipping') {
            return 0;
        }

        $amount = $coupon->type === 'percentage'
            ? $subtotal * ((float) $coupon->value / 100)
            : (float) $coupon->value;

        if ($coupon->maximum_discount) {
            $amount = min($amount, (float) $coupon->maximum_discount);
        }

        return $amount;
    }

    private function unitPrice(Product $product, ?ProductVariant $variant): float
    {
        if ($variant && $variant->price !== null) {
            return (float) $variant->price;
        }

        return (float) $product->price;
    }

    private function assertStockAvailable(Product $product, ?ProductVariant $variant, int $requestedQuantity): void
    {
        $available = $this->inventoryService->availableStock(
            $product->store_id,
            $product->id,
            $variant?->id
        );

        if ($requestedQuantity > $available) {
            throw new CartException(
                "No hay suficiente stock disponible. Quedan {$available} unidades."
            );
        }
    }
}
