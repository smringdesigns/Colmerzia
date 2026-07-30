<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Resources\Order\OrderResource;
use App\Services\Order\OrderService;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {
    }

    /**
     * Lista paginada de pedidos de la tienda.
     * Soporta filtro por status, payment_status y búsqueda por
     * número de orden.
     */
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        $query = Order::where('store_id', $storeId)
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->query('payment_status'));
        }

        if ($request->filled('search')) {
            $query->where('order_number', 'ilike', '%' . $request->query('search') . '%');
        }

        $perPage = min((int) $request->query('per_page', 15), 100);

        $orders = $query->paginate($perPage);

        // Mismo formato de paginación "plano" que Product/Customer
        // (current_page/data/... al nivel raíz), no el formato
        // anidado data/links/meta de las Resource Collections — el
        // frontend ya está armado para el primero.
        $orders->through(fn ($order) => (new OrderResource($order))->resolve());

        return response()->json($orders);
    }

    public function show(Request $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $order = Order::where('store_id', $storeId)
            ->with(['items', 'payments'])
            ->findOrFail($id);

        return response()->json((new OrderResource($order))->resolve());
    }

    public function updateStatus(UpdateOrderStatusRequest $request, int $id)
    {
        $storeId = $this->currentStoreId($request);

        $order = Order::where('store_id', $storeId)->findOrFail($id);

        $order = $this->orderService->updateStatus($order, $request->validated());

        return response()->json((new OrderResource($order))->resolve());
    }
}