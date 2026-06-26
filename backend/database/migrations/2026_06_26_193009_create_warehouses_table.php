<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {

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

            // Código interno
            $table->string('code');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Ubicación
            $table->string('country', 10)
                  ->default('CO');

            $table->string('state')
                  ->nullable();

            $table->string('city')
                  ->nullable();

            $table->string('address')
                  ->nullable();

            $table->string('postal_code')
                  ->nullable();

            // Contacto
            $table->string('phone', 50)
                  ->nullable();

            $table->string('email')
                  ->nullable();

            // Bodega principal
            $table->boolean('is_default')
                  ->default(false);

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Restricciones
            $table->unique([
                'store_id',
                'code'
            ]);

            // Índices
            $table->index('store_id');
            $table->index('is_default');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouses');
    }
};