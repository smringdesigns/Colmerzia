<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Orden asociada
            $table->foreignId('order_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Proveedor de pago
            // stripe, wompi, mercadopago, paypal
            $table->string('provider');

            // Método utilizado
            // card, pse, cash, transfer
            $table->string('method');

            // Identificador externo
            $table->string('provider_payment_id')
                  ->nullable();

            // Referencia comercial
            $table->string('reference')
                  ->unique();

            // Estado del pago
            $table->enum('status', [
                'pending',
                'processing',
                'approved',
                'rejected',
                'cancelled',
                'refunded'
            ])->default('pending');

            // Valores económicos
            $table->decimal('amount', 12, 2);

            $table->decimal('fee', 12, 2)
                  ->default(0);

            $table->decimal('net_amount', 12, 2)
                  ->default(0);

            // Moneda
            $table->string('currency', 10)
                  ->default('COP');

            // Respuesta completa del gateway
            $table->json('gateway_response')
                  ->nullable();

            // Información adicional
            $table->json('metadata')
                  ->nullable();

            // Fechas
            $table->timestamp('paid_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('order_id');
            $table->index('provider');
            $table->index('status');
            $table->index('provider_payment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
