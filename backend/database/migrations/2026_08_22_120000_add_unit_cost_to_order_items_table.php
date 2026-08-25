<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * order_items no guardaba el costo del producto al momento de la
     * venta, solo el precio (unit_price). Sin eso no hay forma
     * confiable de calcular la ganancia real de un pedido: si
     * calculáramos con el cost_price ACTUAL del producto, un pedido
     * de hace 3 meses mostraría una ganancia distinta cada vez que
     * cambies el costo del producto hoy.
     *
     * unit_cost es un snapshot: se llena una sola vez en el momento
     * del checkout (ver CheckoutService) y ya no cambia.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('unit_cost', 12, 2)
                ->nullable()
                ->after('unit_price');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('unit_cost');
        });
    }
};
