<?php

namespace Tests\Concerns;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Inventory\InventoryService;

/**
 * Desde que el stock vive en `Inventory` (por bodega), ya no alcanza
 * con Product::factory(['stock' => X]) para que el carrito/checkout
 * "vean" ese stock -- hay que sembrar la fila de Inventory en la
 * bodega por defecto de la tienda.
 */
trait SeedsInventory
{
    protected function seedStock(Product $product, int $quantity, ?ProductVariant $variant = null): void
    {
        $inventoryService = app(InventoryService::class);
        $warehouse = $inventoryService->defaultWarehouse($product->store_id);

        $inventoryService->setQuantity(
            $warehouse,
            $product->id,
            $variant?->id,
            $quantity
        );
    }
}
