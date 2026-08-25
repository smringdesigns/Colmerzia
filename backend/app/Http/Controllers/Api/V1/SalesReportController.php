<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * Reportes de ventas: ganancias, costos y demás métricas, con
 * filtro por mes y export descargable (CSV).
 *
 * DEFINICIÓN DE "VENTA" usada en todo este controller: un pedido
 * cuenta para el reporte solo si payment_status = 'paid' y
 * status != 'cancelled'. Se filtra por paid_at (cuándo se
 * confirmó el pago), no por created_at (cuándo se creó el
 * carrito/pedido) — así "ventas de agosto" son ventas
 * efectivamente cobradas en agosto, no pedidos abandonados o
 * todavía pendientes de pago.
 *
 * OJO — dato importante para JorSti: el costo (unit_cost) recién
 * se empezó a guardar en order_items a partir de esta sesión. Los
 * pedidos pagados ANTES de este cambio no tienen unit_cost (queda
 * NULL → se trata como 0), así que para esos meses viejos el
 * reporte va a mostrar "ganancia" = "ingresos" (costo en 0), no
 * porque no hubiera costo real sino porque no quedó guardado. Los
 * pedidos nuevos de acá en adelante sí van a tener el dato correcto.
 */
class SalesReportController extends Controller
{
    /**
     * Resumen del mes: ingresos, costos, ganancia, margen, desglose
     * diario y top de productos.
     */
    public function summary(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        [$start, $end, $month] = $this->resolveRange($request);

        $orders = $this->paidOrdersQuery($storeId, $start, $end)
            ->with('items')
            ->orderBy('paid_at')
            ->get();

        $revenue = (float) $orders->sum('total');
        $discounts = (float) $orders->sum('discount');
        $ordersCount = $orders->count();

        $cost = (float) $orders->flatMap->items->sum(
            fn ($item) => $item->quantity * (float) $item->unit_cost
        );

        $profit = $revenue - $cost;
        $margin = $revenue > 0 ? round(($profit / $revenue) * 100, 1) : 0;
        $avgOrderValue = $ordersCount > 0 ? round($revenue / $ordersCount, 2) : 0;

        $daily = $orders
            ->groupBy(fn ($order) => $order->paid_at->format('Y-m-d'))
            ->map(function ($dayOrders, $date) {
                $dayRevenue = (float) $dayOrders->sum('total');

                $dayCost = (float) $dayOrders->flatMap->items->sum(
                    fn ($item) => $item->quantity * (float) $item->unit_cost
                );

                return [
                    'date' => $date,
                    'orders' => $dayOrders->count(),
                    'revenue' => round($dayRevenue, 2),
                    'cost' => round($dayCost, 2),
                    'profit' => round($dayRevenue - $dayCost, 2),
                ];
            })
            ->values();

        $topProducts = $orders->flatMap->items
            ->groupBy('product_id')
            ->map(function ($items) {
                $first = $items->first();
                $itemRevenue = (float) $items->sum('total');

                $itemCost = (float) $items->sum(
                    fn ($item) => $item->quantity * (float) $item->unit_cost
                );

                return [
                    'product_id' => $first->product_id,
                    'product_name' => $first->product_name,
                    'quantity' => $items->sum('quantity'),
                    'revenue' => round($itemRevenue, 2),
                    'cost' => round($itemCost, 2),
                    'profit' => round($itemRevenue - $itemCost, 2),
                ];
            })
            ->sortByDesc('revenue')
            ->take(5)
            ->values();

        return response()->json([
            'month' => $month,
            'range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => [
                'revenue' => round($revenue, 2),
                'cost' => round($cost, 2),
                'profit' => round($profit, 2),
                'margin' => $margin,
                'orders_count' => $ordersCount,
                'average_order_value' => $avgOrderValue,
                'discounts_total' => round($discounts, 2),
            ],
            'daily' => $daily,
            'top_products' => $topProducts,
        ]);
    }

    /**
     * Descarga el informe del mes en CSV (una fila por pedido).
     * Se abre directo en Excel; incluye BOM UTF-8 para que los
     * acentos/ñ no salgan mal en Excel de Windows.
     */
    public function export(Request $request)
    {
        $storeId = $this->currentStoreId($request);

        [$start, $end, $month] = $this->resolveRange($request);

        $orders = $this->paidOrdersQuery($storeId, $start, $end)
            ->with('items')
            ->orderBy('paid_at')
            ->get();

        $filename = "ventas-{$month}.csv";

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Fecha de pago',
                'N° Pedido',
                'Cliente',
                'Unidades',
                'Subtotal',
                'Descuento',
                'Costo',
                'Ganancia',
                'Total',
            ]);

            foreach ($orders as $order) {
                $cost = (float) $order->items->sum(
                    fn ($item) => $item->quantity * (float) $item->unit_cost
                );

                $profit = (float) $order->total - $cost;

                fputcsv($handle, [
                    $order->paid_at?->format('Y-m-d H:i'),
                    $order->order_number,
                    $order->customer_snapshot['name'] ?? 'Cliente',
                    $order->items->sum('quantity'),
                    number_format((float) $order->subtotal, 2, '.', ''),
                    number_format((float) $order->discount, 2, '.', ''),
                    number_format($cost, 2, '.', ''),
                    number_format($profit, 2, '.', ''),
                    number_format((float) $order->total, 2, '.', ''),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Query base de pedidos "vendidos" (pagados, no cancelados)
     * de una tienda dentro de un rango de fechas.
     */
    private function paidOrdersQuery(int $storeId, Carbon $start, Carbon $end)
    {
        return Order::where('store_id', $storeId)
            ->where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled')
            ->whereBetween('paid_at', [$start, $end]);
    }

    /**
     * Resuelve el mes pedido (?month=YYYY-MM, default: mes actual
     * en America/Bogota) a un rango [inicio, fin] de ese mes.
     *
     * @return array{0: Carbon, 1: Carbon, 2: string}
     */
    private function resolveRange(Request $request): array
    {
        $month = $request->query('month') ?? now('America/Bogota')->format('Y-m');

        if (!preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $month)) {
            abort(422, 'Formato de mes inválido. Usa YYYY-MM (ej. 2026-08).');
        }

        $start = Carbon::createFromFormat('Y-m-d', "{$month}-01", 'America/Bogota')
            ->startOfDay();

        $end = $start->copy()->endOfMonth();

        return [$start, $end, $month];
    }
}
