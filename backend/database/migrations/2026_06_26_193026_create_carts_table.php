<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Cliente registrado (opcional)
            $table->foreignId('customer_id')
                  ->nullable()
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Token para carritos invitados
            $table->string('guest_token')
                  ->nullable()
                  ->unique();

            // Estado del carrito
            // active, abandoned, converted
            $table->enum('status', [
                'active',
                'abandoned',
                'converted'
            ])->default('active');

            // Resumen económico
            $table->decimal('subtotal', 12, 2)
                  ->default(0);

            $table->decimal('discount', 12, 2)
                  ->default(0);

            $table->decimal('tax', 12, 2)
                  ->default(0);

            $table->decimal('shipping', 12, 2)
                  ->default(0);

            $table->decimal('total', 12, 2)
                  ->default(0);

            // Última actividad
            $table->timestamp('last_activity_at')
                  ->nullable();

            // Expiración
            $table->timestamp('expires_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('customer_id');
            $table->index('status');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
