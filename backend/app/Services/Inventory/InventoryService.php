<?php

namespace App\Services\Inventory;

use App\Exceptions\CartException;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Único punto de lectura/escritura de existencias. `products.stock` y
 * `product_variants.stock` quedan como columnas legacy, YA NO son la
 * fuente de verdad — todo pasa por `Inventory` (una fila por
 * bodega+producto[+variante]) y cada cambio deja un `InventoryMovement`
 * (auditoría de quién movió qué y por qué).
 *
 * SIMPLIFICACIÓN A PROPÓSITO: el carrito y el checkout solo consultan
 * y descuentan de la bodega POR DEFECTO de la tienda (is_default) —
 * no hay todavía lógica de "fulfillment" que reparta un pedido entre
 * varias bodegas. Con multi-bodega (plan Pro/Business), el resto de
 * bodegas sirven para organizar/trasladar stock desde el admin, pero
 * las ventas online siempre salen de la bodega por defecto.
 */
class InventoryService
{
    /**
     * Bodega por defecto de la tienda.
     * Si existe una bodega PRINCIPAL creada anteriormente pero no marcada
     * como default, se reutiliza y se corrige.
     */
    public function defaultWarehouse(int $storeId): Warehouse
    {
        $warehouse = Warehouse::where('store_id', $storeId)
            ->where(function ($query) {
                $query->where('is_default', true)
                    ->orWhere('code', 'PRINCIPAL');
            })
            ->first();

        if ($warehouse) {

            if (!$warehouse->is_default) {
                $warehouse->update([
                    'is_default' => true,
                ]);
            }

            return $warehouse;
        }

        return Warehouse::firstOrCreate(
            [
                'store_id' => $storeId,
                'code' => 'PRINCIPAL',
            ],
            [
                'uuid' => Str::uuid(),
                'name' => 'Bodega principal',
                'country' => 'CO',
                'is_default' => true,
                'is_active' => true,
            ]
        );
    }


    public function inventoryRow(Warehouse $warehouse, int $productId, ?int $productVariantId): Inventory
    {
        return Inventory::firstOrCreate(
            [
                'warehouse_id' => $warehouse->id,
                'product_id' => $productId,
                'product_variant_id' => $productVariantId,
            ],
            [
                'quantity' => 0,
                'reserved' => 0,
                'minimum' => 0,
            ]
        );
    }


    /**
     * Disponible (quantity - reserved) en la bodega por defecto.
     */
    public function availableStock(int $storeId, int $productId, ?int $productVariantId): int
    {
        $warehouse = $this->defaultWarehouse($storeId);

        $inventory = $this->inventoryRow(
            $warehouse,
            $productId,
            $productVariantId
        );

        return $inventory->available();
    }


    /**
     * Valida disponibilidad de stock.
     */
    public function assertAvailable(
        int $storeId,
        int $productId,
        ?int $productVariantId,
        int $quantity
    ): void {
        $available = $this->availableStock(
            $storeId,
            $productId,
            $productVariantId
        );

        if ($quantity > $available) {
            throw new CartException(
                "No hay suficiente stock disponible. Quedan {$available} unidades."
            );
        }
    }


    /**
     * Bloqueo de fila para checkout.
     */
    public function lockAndAssertAvailable(
        int $storeId,
        int $productId,
        ?int $productVariantId,
        int $quantity
    ): Inventory {

        $warehouse = $this->defaultWarehouse($storeId);

        $inventory = Inventory::where('warehouse_id', $warehouse->id)
            ->where('product_id', $productId)
            ->where('product_variant_id', $productVariantId)
            ->lockForUpdate()
            ->first();

        $inventory ??= $this->inventoryRow(
            $warehouse,
            $productId,
            $productVariantId
        );

        if ($quantity > $inventory->available()) {
            throw new CartException(
                "Uno de los productos ya no tiene stock suficiente."
            );
        }

        return $inventory;
    }


    public function decrementForSale(
        Inventory $inventory,
        int $quantity,
        string $reference,
        ?User $user = null
    ): void {
        $this->applyMovement(
            $inventory,
            InventoryMovement::TYPE_OUT,
            -$quantity,
            $reference,
            'Venta',
            $user
        );
    }


    public function restockForCancellation(
        int $storeId,
        int $productId,
        ?int $productVariantId,
        int $quantity,
        string $reference,
        ?User $user = null
    ): void {

        $warehouse = $this->defaultWarehouse($storeId);

        $inventory = $this->inventoryRow(
            $warehouse,
            $productId,
            $productVariantId
        );

        $this->applyMovement(
            $inventory,
            InventoryMovement::TYPE_RETURN,
            $quantity,
            $reference,
            'Cancelación de pedido',
            $user
        );
    }


    /**
     * Ajuste manual de inventario.
     */
    public function setQuantity(
        Warehouse $warehouse,
        int $productId,
        ?int $productVariantId,
        int $newQuantity,
        ?User $user = null,
        ?string $reason = null
    ): Inventory {

        return DB::transaction(function () use (
            $warehouse,
            $productId,
            $productVariantId,
            $newQuantity,
            $user,
            $reason
        ) {

            $inventory = Inventory::where('warehouse_id', $warehouse->id)
                ->where('product_id', $productId)
                ->where('product_variant_id', $productVariantId)
                ->lockForUpdate()
                ->first()
                ??
                $this->inventoryRow(
                    $warehouse,
                    $productId,
                    $productVariantId
                );


            $delta = $newQuantity - $inventory->quantity;


            if ($delta === 0) {
                return $inventory;
            }


            $this->applyMovement(
                $inventory,
                InventoryMovement::TYPE_ADJUSTMENT,
                $delta,
                null,
                $reason ?? 'Ajuste manual',
                $user
            );


            return $inventory->fresh();
        });
    }


    private function applyMovement(
        Inventory $inventory,
        string $type,
        int $delta,
        ?string $reference,
        ?string $reason,
        ?User $user
    ): void {

        DB::transaction(function () use (
            $inventory,
            $type,
            $delta,
            $reference,
            $reason,
            $user
        ) {

            $before = $inventory->quantity;

            $after = max(
                0,
                $before + $delta
            );


            $inventory->update([
                'quantity' => $after,
                'last_movement_at' => now(),
            ]);


            InventoryMovement::create([
                'inventory_id' => $inventory->id,
                'user_id' => $user?->id,
                'uuid' => Str::uuid(),
                'type' => $type,
                'quantity' => abs($delta),
                'stock_before' => $before,
                'stock_after' => $after,
                'reason' => $reason,
                'reference' => $reference,
                'performed_at' => now(),
            ]);
        });
    }
}