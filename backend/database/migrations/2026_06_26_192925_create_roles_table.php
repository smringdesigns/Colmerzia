<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Relación con la tienda
            $table->foreignId('store_id')
                  ->nullable()
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')->unique();

            // Datos
            $table->string('name');
            $table->string('slug');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Rol del sistema
            $table->boolean('is_system')
                  ->default(false);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->unique(['store_id', 'slug']);
            $table->index('store_id');
            $table->index('slug');
            $table->index('is_system');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};