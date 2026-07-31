<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Cliente
            $table->foreignId('customer_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // Carrito origen
            $table->foreignId('cart_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Número comercial de orden
            // Ejemplo: ORD-2026-000001
            $table->string('order_number')
                  ->unique();

            // Estado de la orden
            $table->enum('status', [
                'pending',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ])->default('pending');

            // Estado del pago
            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
                'refunded'
            ])->default('pending');

            // Estado del envío
            $table->enum('shipping_status', [
                'pending',
                'preparing',
                'shipped',
                'delivered'
            ])->default('pending');

            // Valores económicos
            $table->decimal('subtotal', 12, 2)
                  ->default(0);

            $table->decimal('discount', 12, 2)
                  ->default(0);

            $table->decimal('tax', 12, 2)
                  ->default(0);

            $table->decimal('shipping', 12, 2)
                  ->default(0);

            $table->decimal('total', 12, 2)
                  ->default(0);

            // Snapshot del cliente
            $table->json('customer_snapshot')
                  ->nullable();

            // Snapshot dirección
            $table->json('shipping_address')
                  ->nullable();

            // Notas
            $table->text('notes')
                  ->nullable();

            // Fechas importantes
            $table->timestamp('paid_at')
                  ->nullable();

            $table->timestamp('shipped_at')
                  ->nullable();

            $table->timestamp('delivered_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('customer_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('shipping_status');
            $table->index('order_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};