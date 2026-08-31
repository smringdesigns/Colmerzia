<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

/**
 * Búsqueda global del topbar. Antes el cuadro de búsqueda del panel
 * era puramente decorativo (sin onChange, sin lógica) -- esto le da
 * un endpoint real de un solo viaje que combina los 3 recursos que
 * más se buscan, en vez de que el frontend dispare 3 llamadas
 * separadas a /products, /customers y /orders.
 */
class SearchController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->currentStoreId($request);
        $term = trim((string) $request->query('q', ''));

        if (mb_strlen($term) < 2) {
            return response()->json([
                'products' => [],
                'customers' => [],
                'orders' => [],
            ]);
        }

        $like = '%' . $term . '%';

        $products = $request->user()->can('products.view')
            ? Product::where('store_id', $storeId)
                ->where(function ($query) use ($like) {
                    $query->where('name', 'ilike', $like)
                        ->orWhere('sku', 'ilike', $like);
                })
                ->limit(5)
                ->get(['id', 'name', 'sku', 'price'])
                ->map(fn ($product) => [
                    'id' => $product->id,
                    'title' => $product->name,
                    'subtitle' => $product->sku,
                    'url' => "/products/{$product->id}/edit",
                ])
            : collect();

        $customers = $request->user()->can('customers.view')
            ? Customer::where('store_id', $storeId)
                ->where(function ($query) use ($like) {
                    $query->where('first_name', 'ilike', $like)
                        ->orWhere('last_name', 'ilike', $like)
                        ->orWhere('email', 'ilike', $like);
                })
                ->limit(5)
                ->get(['id', 'first_name', 'last_name', 'email'])
                ->map(fn ($customer) => [
                    'id' => $customer->id,
                    'title' => trim("{$customer->first_name} {$customer->last_name}"),
                    'subtitle' => $customer->email,
                    'url' => "/customers/{$customer->id}/edit",
                ])
            : collect();

        $orders = $request->user()->can('orders.view')
            ? Order::where('store_id', $storeId)
                ->where('order_number', 'ilike', $like)
                ->limit(5)
                ->get(['id', 'order_number', 'total', 'customer_snapshot'])
                ->map(fn ($order) => [
                    'id' => $order->id,
                    'title' => $order->order_number,
                    'subtitle' => $order->customer_snapshot['name'] ?? 'Cliente',
                    'url' => "/orders/{$order->id}",
                ])
            : collect();

        return response()->json([
            'products' => $products,
            'customers' => $customers,
            'orders' => $orders,
        ]);
    }
}
