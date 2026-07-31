<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Código del cupón
            $table->string('code')
                  ->unique();

            // Nombre interno
            $table->string('name');

            // Descripción
            $table->text('description')
                  ->nullable();

            // Tipo de descuento
            // percentage, fixed, free_shipping
            $table->enum('type', [
                'percentage',
                'fixed',
                'free_shipping'
            ]);

            // Valor del descuento
            $table->decimal('value', 12, 2)
                  ->default(0);

            // Compra mínima
            $table->decimal('minimum_amount', 12, 2)
                  ->nullable();

            // Límite de descuento
            $table->decimal('maximum_discount', 12, 2)
                  ->nullable();

            // Cantidad máxima de usos
            $table->integer('usage_limit')
                  ->nullable();

            // Cantidad usada
            $table->integer('used_count')
                  ->default(0);

            // Un uso por cliente
            $table->boolean('once_per_customer')
                  ->default(false);

            // Estado
            $table->boolean('is_active')
                  ->default(true);

            // Vigencia
            $table->timestamp('starts_at')
                  ->nullable();

            $table->timestamp('expires_at')
                  ->nullable();

            // Configuración adicional
            $table->json('rules')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('code');
            $table->index('type');
            $table->index('is_active');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};