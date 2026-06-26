<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Bodega
            $table->foreignId('warehouse_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Producto
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Variante (opcional)
            $table->foreignId('product_variant_id')
                  ->nullable()
                  ->constrained()
                  ->cascadeOnDelete();

            // Existencias
            $table->integer('quantity')
                  ->default(0);

            // Stock reservado
            $table->integer('reserved')
                  ->default(0);

            // Stock mínimo
            $table->integer('minimum')
                  ->default(0);

            // Stock máximo
            $table->integer('maximum')
                  ->nullable();

            // Último movimiento
            $table->timestamp('last_movement_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Evita registros duplicados
            $table->unique([
                'warehouse_id',
                'product_id',
                'product_variant_id'
            ]);

            // Índices
            $table->index('warehouse_id');
            $table->index('product_id');
            $table->index('product_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};