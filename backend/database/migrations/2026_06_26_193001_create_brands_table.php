<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Información principal
            $table->string('name');

            // SEO
            $table->string('slug');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Branding
            $table->string('logo')
                  ->nullable();

            // Sitio web oficial
            $table->string('website')
                  ->nullable();

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
            $table->index('slug');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};