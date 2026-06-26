<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Carrito propietario
            $table->foreignId('cart_id')
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

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Cantidad
            $table->integer('quantity')
                  ->default(1);

            // Precio congelado
            $table->decimal('unit_price', 12, 2);

            // Precio original
            $table->decimal('compare_price', 12, 2)
                  ->nullable();

            // Descuento aplicado
            $table->decimal('discount', 12, 2)
                  ->default(0);

            // Impuesto
            $table->decimal('tax', 12, 2)
                  ->default(0);

            // Total de la línea
            $table->decimal('total', 12, 2);

            // Información adicional
            $table->json('metadata')
                  ->nullable();

            // Auditoría
            $table->timestamps();

            // Evitar duplicados
            $table->unique([
                'cart_id',
                'product_id',
                'product_variant_id'
            ]);

            // Índices
            $table->index('cart_id');
            $table->index('product_id');
            $table->index('product_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
