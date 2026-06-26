<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Pago asociado
            $table->foreignId('payment_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Tipo de transacción
            $table->enum('type', [
                'authorization',
                'capture',
                'payment',
                'refund',
                'chargeback',
                'fee',
                'webhook'
            ]);

            // Estado
            $table->enum('status', [
                'pending',
                'success',
                'failed'
            ])->default('pending');

            // Referencia externa
            $table->string('external_id')
                  ->nullable();

            // Valor
            $table->decimal('amount', 12, 2)
                  ->default(0);

            // Moneda
            $table->string('currency', 10)
                  ->default('COP');

            // Mensaje del proveedor
            $table->text('message')
                  ->nullable();

            // Datos completos recibidos
            $table->json('payload')
                  ->nullable();

            // Metadata interna
            $table->json('metadata')
                  ->nullable();

            // Fecha efectiva
            $table->timestamp('processed_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();

            // Índices
            $table->index('payment_id');
            $table->index('type');
            $table->index('status');
            $table->index('external_id');
            $table->index('processed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
