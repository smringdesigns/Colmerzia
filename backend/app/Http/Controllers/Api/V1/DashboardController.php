<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * KPIs del Dashboard en UNA sola llamada, con el % de variación vs
 * el mes anterior calculado en el backend (no inventado en el
 * frontend). Antes el Dashboard hacía 6 llamadas separadas
 * (products total/active, customers total/active, orders
 * total/pending) solo para armar 4 tarjetas -- esto las reemplaza a
 * todas.
 *
 * Definición de "variación": (este_mes - mes_anterior) / mes_anterior
 * * 100. Si el mes anterior fue 0 y este mes tiene algo, no hay un
 * porcentaje matemáticamente honesto que mostrar (dividir por cero),
 * así que devolvemos null y el frontend lo muestra como "Nuevo" en
 * vez de inventar un "+∞%" o un "+100%" que no significa nada real.
 */
class DashboardController extends Controller
{
    public function kpis(Request $request)
    {
        $storeId = $this->currentStoreId($request);
        $tz = 'America/Bogota';

        $thisMonthStart = now($tz)->startOfMonth();
        $lastMonthStart = now($tz)->subMonthNoOverflow()->startOfMonth();
        $lastMonthEnd = now($tz)->subMonthNoOverflow()->endOfMonth();

        return response()->json([
            'products' => $this->countWithTrend(
                Product::where('store_id', $storeId),
                $thisMonthStart,
                $lastMonthStart,
                $lastMonthEnd,
                ['active' => fn ($q) => $q->where('is_active', true)]
            ),
            'customers' => $this->countWithTrend(
                Customer::where('store_id', $storeId),
                $thisMonthStart,
                $lastMonthStart,
                $lastMonthEnd,
                ['active' => fn ($q) => $q->where('is_active', true)]
            ),
            'orders' => $this->countWithTrend(
                Order::where('store_id', $storeId),
                $thisMonthStart,
                $lastMonthStart,
                $lastMonthEnd,
                ['pending' => fn ($q) => $q->where('status', 'pending')]
            ),
            'revenue' => $this->revenueTrend($storeId, $thisMonthStart, $lastMonthStart, $lastMonthEnd),
        ]);
    }

    /**
     * @param array<string, \Closure> $extraCounts nombre => callback que filtra el query
     */
    private function countWithTrend(
        $baseQuery,
        Carbon $thisMonthStart,
        Carbon $lastMonthStart,
        Carbon $lastMonthEnd,
        array $extraCounts = []
    ): array {
        $total = (clone $baseQuery)->count();

        $createdThisMonth = (clone $baseQuery)
            ->where('created_at', '>=', $thisMonthStart)
            ->count();

        $createdLastMonth = (clone $baseQuery)
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $result = [
            'total' => $total,
            'trend' => $this->percentChange($createdThisMonth, $createdLastMonth),
        ];

        foreach ($extraCounts as $key => $filter) {
            $result[$key] = $filter(clone $baseQuery)->count();
        }

        return $result;
    }

    private function revenueTrend(
        int $storeId,
        Carbon $thisMonthStart,
        Carbon $lastMonthStart,
        Carbon $lastMonthEnd
    ): array {
        $paidOrders = fn () => Order::where('store_id', $storeId)
            ->where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled');

        $thisMonth = $paidOrders()
            ->where('paid_at', '>=', $thisMonthStart)
            ->sum('total');

        $lastMonth = $paidOrders()
            ->whereBetween('paid_at', [$lastMonthStart, $lastMonthEnd])
            ->sum('total');

        return [
            'this_month' => round((float) $thisMonth, 2),
            'trend' => $this->percentChange((float) $thisMonth, (float) $lastMonth),
        ];
    }

    private function percentChange(float $current, float $previous): ?float
    {
        if ($previous <= 0) {
            // No hay una base real contra la cual comparar -- "Nuevo"
            // en el frontend, no un porcentaje inventado.
            return null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
