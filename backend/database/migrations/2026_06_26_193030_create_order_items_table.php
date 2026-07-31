<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Orden propietaria
            $table->foreignId('order_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Producto original
            $table->foreignId('product_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // Variante comprada
            $table->foreignId('product_variant_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Snapshot del producto
            $table->string('product_name');

            $table->string('product_sku')
                  ->nullable();

            $table->json('product_snapshot')
                  ->nullable();

            // Cantidad
            $table->integer('quantity');

            // Valores económicos
            $table->decimal('unit_price', 12, 2);

            $table->decimal('discount', 12, 2)
                  ->default(0);

            $table->decimal('tax', 12, 2)
                  ->default(0);

            $table->decimal('total', 12, 2);

            // Auditoría
            $table->timestamps();

            // Índices
            $table->index('order_id');
            $table->index('product_id');
            $table->index('product_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};