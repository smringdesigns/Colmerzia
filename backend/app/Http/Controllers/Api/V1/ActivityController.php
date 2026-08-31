<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * "Actividad reciente" del Dashboard. Igual que NotificationController,
 * es una vista DERIVADA de datos que ya existen -- no hay una tabla
 * de "eventos" ni un sistema de auditoría genérico. Se arma
 * combinando 4 señales reales:
 *   - Pedidos nuevos (created_at)
 *   - Pedidos enviados (shipped_at)
 *   - Clientes nuevos (created_at)
 *   - Stock bajo (misma definición que InventoryController)
 *
 * Cada usuario solo ve las señales de los recursos que puede ver
 * (orders.view / customers.view / inventory.view), igual criterio
 * que SearchController.
 */
class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);
        $user = $request->user();
        $limit = min((int) $request->query('limit', 10), 30);

        $events = collect();

        if ($user->can('orders.view')) {
            $events = $events
                ->concat($this->newOrders($storeId))
                ->concat($this->shippedOrders($storeId));
        }

        if ($user->can('customers.view')) {
            $events = $events->concat($this->newCustomers($storeId));
        }

        if ($user->can('inventory.view')) {
            $events = $events->concat($this->lowStock($storeId));
        }

        $items = $events
            ->sortByDesc('at')
            ->take($limit)
            ->values();

        return response()->json(['items' => $items]);
    }

    private function newOrders(int $storeId): Collection
    {
        return Order::where('store_id', $storeId)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'order_number', 'customer_snapshot', 'created_at'])
            ->map(fn ($order) => [
                'type' => 'order_created',
                'title' => "Nuevo pedido {$order->order_number}",
                'subtitle' => 'de ' . ($order->customer_snapshot['name'] ?? 'un cliente'),
                'url' => "/orders/{$order->id}",
                'at' => $order->created_at,
            ]);
    }

    private function shippedOrders(int $storeId): Collection
    {
        return Order::where('store_id', $storeId)
            ->whereNotNull('shipped_at')
            ->orderByDesc('shipped_at')
            ->limit(10)
            ->get(['id', 'order_number', 'shipped_at'])
            ->map(fn ($order) => [
                'type' => 'order_shipped',
                'title' => "Pedido {$order->order_number} enviado",
                'subtitle' => 'Marcado como enviado',
                'url' => "/orders/{$order->id}",
                'at' => $order->shipped_at,
            ]);
    }

    private function newCustomers(int $storeId): Collection
    {
        return Customer::where('store_id', $storeId)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'created_at'])
            ->map(fn ($customer) => [
                'type' => 'customer_created',
                'title' => 'Nuevo cliente registrado',
                'subtitle' => trim("{$customer->first_name} {$customer->last_name}"),
                'url' => "/customers/{$customer->id}/edit",
                'at' => $customer->created_at,
            ]);
    }

    private function lowStock(int $storeId): Collection
    {
        return Inventory::with('product:id,name')
            ->whereHas('product', fn ($query) => $query->where('store_id', $storeId))
            ->whereColumn('quantity', '<=', 'minimum')
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get()
            ->filter(fn ($row) => $row->product !== null)
            ->map(fn ($row) => [
                'type' => 'low_stock',
                'title' => "Stock bajo: {$row->product->name}",
                'subtitle' => "Quedan {$row->quantity} unidades",
                'url' => '/inventory',
                'at' => $row->updated_at,
            ]);
    }
}
