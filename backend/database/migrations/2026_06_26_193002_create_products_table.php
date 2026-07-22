<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Categoría
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // Marca
            $table->foreignId('brand_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Información principal
            $table->string('name');

            // SEO
            $table->string('slug');

            // SKU principal
            // Puede repetirse entre tiendas,
            // pero no dentro de la misma tienda.
            $table->string('sku');

            // Descripción corta
            $table->text('short_description')
                  ->nullable();

            // Descripción larga
            $table->longText('description')
                  ->nullable();

            // Precios
            $table->decimal('price', 12, 2);

            $table->decimal('compare_price', 12, 2)
                  ->nullable();

            $table->decimal('cost_price', 12, 2)
                  ->nullable();

            // Inventario básico
            $table->integer('stock')
                  ->default(0);

            $table->integer('min_stock')
                  ->default(0);

            // Peso y dimensiones
            $table->decimal('weight', 10, 2)
                  ->nullable();

            $table->decimal('length', 10, 2)
                  ->nullable();

            $table->decimal('width', 10, 2)
                  ->nullable();

            $table->decimal('height', 10, 2)
                  ->nullable();

            // Producto destacado
            $table->boolean('featured')
                  ->default(false);

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Si maneja variantes
            $table->boolean('has_variants')
                  ->default(false);

            // SEO adicional
            $table->string('meta_title')
                  ->nullable();

            $table->text('meta_description')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Restricciones
            // El slug debe ser único dentro de cada tienda.
            $table->unique([
                'store_id',
                'slug'
            ]);

            // El SKU debe ser único dentro de cada tienda.
            // Ejemplo:
            //
            // Tienda A -> SKU-001 ✅
            // Tienda B -> SKU-001 ✅
            // Tienda A -> SKU-001 ❌
            //
            $table->unique([
                'store_id',
                'sku'
            ]);

            // Índices
            $table->index('store_id');
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('is_active');
            $table->index('featured');
            $table->index('has_variants');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};