<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Aplica los cambios de estado recibidos (cualquier subconjunto de
     * status/payment_status/shipping_status) y dispara los efectos
     * secundarios correspondientes:
     *  - status -> cancelled: repone el stock de cada item (solo la
     *    primera vez que se cancela, no si ya estaba cancelada).
     *  - status -> shipped / delivered: setea shipped_at/delivered_at
     *    si todavía no tenían fecha.
     *  - payment_status -> paid: setea paid_at si no tenía fecha.
     */
    public function updateStatus(Order $order, array $changes): Order
    {
        return DB::transaction(function () use ($order, $changes) {

            $wasCancelled = $order->status === 'cancelled';

            $updates = [];

            if (isset($changes['status'])) {
                $updates['status'] = $changes['status'];

                if ($changes['status'] === 'shipped' && !$order->shipped_at) {
                    $updates['shipped_at'] = now();
                }

                if ($changes['status'] === 'delivered' && !$order->delivered_at) {
                    $updates['delivered_at'] = now();
                }
            }

            if (isset($changes['payment_status'])) {
                $updates['payment_status'] = $changes['payment_status'];

                if ($changes['payment_status'] === 'paid' && !$order->paid_at) {
                    $updates['paid_at'] = now();
                }
            }

            if (isset($changes['shipping_status'])) {
                $updates['shipping_status'] = $changes['shipping_status'];
            }

            $order->update($updates);

            $becomesCancelled = isset($changes['status'])
                && $changes['status'] === 'cancelled'
                && !$wasCancelled;

            if ($becomesCancelled) {
                $this->restockItems($order);
            }

            return $order->fresh(['items', 'payments']);
        });
    }

    private function restockItems(Order $order): void
    {
        foreach ($order->items()->get() as $item) {
            if ($item->product_variant_id) {
                ProductVariant::where('id', $item->product_variant_id)
                    ->increment('stock', $item->quantity);

                continue;
            }

            Product::where('id', $item->product_id)
                ->increment('stock', $item->quantity);
        }
    }
}
