<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Categoría padre (subcategorías)
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            // Información principal
            $table->string('name');

            // SEO
            $table->string('slug');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Imagen
            $table->string('image')
                  ->nullable();

            // Orden visual
            $table->integer('sort_order')
                  ->default(0);

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Restricciones
            $table->unique([
                'store_id',
                'slug'
            ]);

            // Índices
            $table->index('store_id');
            $table->index('parent_id');
            $table->index('slug');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
