<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_rules', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Nombre de la regla
            $table->string('name');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Tipo de descuento
            $table->enum('type', [
                'percentage',
                'fixed',
                'free_shipping',
                'buy_x_get_y'
            ]);

            // Valor del descuento
            $table->decimal('value', 12, 2)
                  ->default(0);

            // Prioridad
            $table->integer('priority')
                  ->default(0);

            // Puede combinarse
            $table->boolean('is_stackable')
                  ->default(false);

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Reglas y condiciones
            $table->json('conditions')
                  ->nullable();

            // Acciones de la promoción
            $table->json('actions')
                  ->nullable();

            // Vigencia
            $table->timestamp('starts_at')
                  ->nullable();

            $table->timestamp('expires_at')
                  ->nullable();

            // Límites
            $table->integer('usage_limit')
                  ->nullable();

            $table->integer('used_count')
                  ->default(0);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('type');
            $table->index('priority');
            $table->index('is_active');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_rules');
    }
};