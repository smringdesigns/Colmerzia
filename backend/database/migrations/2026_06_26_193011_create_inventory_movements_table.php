<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Inventario afectado
            $table->foreignId('inventory_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Usuario responsable
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Tipo de movimiento
            // in, out, adjustment, transfer, return
            $table->enum('type', [
                'in',
                'out',
                'adjustment',
                'transfer',
                'return'
            ]);

            // Cantidad movida
            $table->integer('quantity');

            // Stock antes del movimiento
            $table->integer('stock_before');

            // Stock después del movimiento
            $table->integer('stock_after');

            // Motivo
            $table->string('reason')
                  ->nullable();

            // Referencia externa
            // Ej: ORDER-1001, PURCHASE-10
            $table->string('reference')
                  ->nullable();

            // Información adicional
            $table->json('metadata')
                  ->nullable();

            // Fecha real del movimiento
            $table->timestamp('performed_at')
                  ->useCurrent();

            // Auditoría
            $table->timestamps();

            // Índices
            $table->index('inventory_id');
            $table->index('user_id');
            $table->index('type');
            $table->index('performed_at');
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};