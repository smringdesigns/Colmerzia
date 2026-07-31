<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Producto propietario
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Variante opcional
            $table->foreignId('product_variant_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Ruta de la imagen
            $table->string('path');

            // Texto alternativo SEO
            $table->string('alt')
                  ->nullable();

            // Imagen principal
            $table->boolean('is_primary')
                  ->default(false);

            // Orden de visualización
            $table->integer('sort_order')
                  ->default(0);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('product_id');
            $table->index('product_variant_id');
            $table->index('is_primary');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};