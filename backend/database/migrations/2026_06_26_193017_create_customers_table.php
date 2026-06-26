<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Información personal
            $table->string('first_name');
            $table->string('last_name')
                  ->nullable();

            $table->string('email');
            $table->string('phone', 50)
                  ->nullable();

            // Documento de identidad
            $table->string('document_type', 20)
                  ->nullable();

            $table->string('document_number')
                  ->nullable();

            // Empresa
            $table->string('company')
                  ->nullable();

            // Fecha de nacimiento
            $table->date('birth_date')
                  ->nullable();

            // Estado del cliente
            $table->boolean('is_active')
                  ->default(true);

            // Verificación de email
            $table->timestamp('email_verified_at')
                  ->nullable();

            // Observaciones internas
            $table->text('notes')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Restricciones
            $table->unique([
                'store_id',
                'email'
            ]);

            // Índices
            $table->index('store_id');
            $table->index('email');
            $table->index('document_number');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};