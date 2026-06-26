<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Producto padre
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // SKU propio de la variante
            $table->string('sku')
                  ->unique();

            // Nombre visible
            $table->string('name');

            // Atributos de la variante
            // Ejemplo:
            // {"color":"Negro","size":"M"}
            // {"storage":"256GB"}
            $table->json('attributes');

            // Precios
            $table->decimal('price', 12, 2)
                  ->nullable();

            $table->decimal('compare_price', 12, 2)
                  ->nullable();

            $table->decimal('cost_price', 12, 2)
                  ->nullable();

            // Inventario
            $table->integer('stock')
                  ->default(0);

            $table->integer('min_stock')
                  ->default(0);

            // Datos físicos
            $table->decimal('weight', 10, 2)
                  ->nullable();

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Restricciones
            $table->unique([
                'product_id',
                'name'
            ]);

            // Índices
            $table->index('product_id');
            $table->index('sku');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};