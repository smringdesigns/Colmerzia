<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Order;
use Illuminate\Http\Request;

/**
 * "Notificaciones" del topbar -- antes era una campanita decorativa
 * con un puntito rojo fijo, sin ningún dato real detrás.
 *
 * A propósito NO construimos un sistema de notificaciones completo
 * (tabla propia, eventos, marcado de leído/no leído, etc.) porque
 * nadie lo pidió y es una pieza de infraestructura grande. En vez de
 * eso, esto es una vista DERIVADA de datos que ya existen y ya
 * importan de verdad: pedidos pendientes de procesar, y productos
 * con stock por debajo del mínimo configurado (misma definición
 * exacta que usa InventoryController: quantity <= minimum). Si más
 * adelante hace falta algo más sofisticado (marcar como leído,
 * notificaciones push, etc.), esto es la base sobre la que se
 * construye, no hay que tirarlo.
 */
class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $pendingOrders = Order::where('store_id', $storeId)
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'order_number', 'total', 'created_at'])
            ->map(fn ($order) => [
                'type' => 'order',
                'title' => "Pedido {$order->order_number} pendiente",
                'subtitle' => 'Esperando confirmación',
                'url' => "/orders/{$order->id}",
                'created_at' => $order->created_at,
            ]);

        $lowStock = Inventory::with('product:id,name')
            ->whereHas('product', fn ($query) => $query->where('store_id', $storeId))
            ->whereColumn('quantity', '<=', 'minimum')
            ->orderBy('quantity')
            ->limit(5)
            ->get()
            ->filter(fn ($row) => $row->product !== null)
            ->map(fn ($row) => [
                'type' => 'low_stock',
                'title' => "Stock bajo: {$row->product->name}",
                'subtitle' => "Quedan {$row->quantity} unidades",
                'url' => "/inventory",
                'created_at' => $row->updated_at,
            ]);

        $items = $pendingOrders
            ->concat($lowStock)
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'items' => $items,
            'count' => $items->count(),
        ]);
    }
}
