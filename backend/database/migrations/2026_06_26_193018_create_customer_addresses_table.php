<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_addresses', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Cliente propietario
            $table->foreignId('customer_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Nombre de la dirección
            // Ej: Casa, Oficina, Facturación
            $table->string('label')
                  ->default('Casa');

            // Persona que recibe
            $table->string('recipient_name');

            // Teléfono de contacto
            $table->string('phone', 50)
                  ->nullable();

            // Dirección
            $table->string('address_line_1');

            $table->string('address_line_2')
                  ->nullable();

            // Ubicación
            $table->string('country', 10)
                  ->default('CO');

            $table->string('state')
                  ->nullable();

            $table->string('city');

            $table->string('postal_code')
                  ->nullable();

            // Coordenadas (para futuras integraciones)
            $table->decimal('latitude', 10, 7)
                  ->nullable();

            $table->decimal('longitude', 10, 7)
                  ->nullable();

            // Tipo de dirección
            $table->boolean('is_shipping')
                  ->default(true);

            $table->boolean('is_billing')
                  ->default(false);

            // Dirección principal
            $table->boolean('is_default')
                  ->default(false);

            // Observaciones
            $table->text('notes')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('customer_id');
            $table->index('is_default');
            $table->index('is_shipping');
            $table->index('is_billing');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};