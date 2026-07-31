<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // Usuario responsable
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Acción realizada
            $table->string('action');

            // Modelo afectado
            $table->string('auditable_type');

            // ID del modelo afectado
            $table->unsignedBigInteger('auditable_id');

            // Valores anteriores
            $table->json('old_values')
                  ->nullable();

            // Valores nuevos
            $table->json('new_values')
                  ->nullable();

            // Descripción humana
            $table->text('description')
                  ->nullable();

            // Información técnica
            $table->string('ip_address', 45)
                  ->nullable();

            $table->text('user_agent')
                  ->nullable();

            // Datos adicionales
            $table->json('metadata')
                  ->nullable();

            // Fecha de auditoría
            $table->timestamp('performed_at')
                  ->useCurrent();

            // Auditoría propia
            $table->timestamps();

            // Índices
            $table->index('store_id');
            $table->index('user_id');
            $table->index('action');
            $table->index([
                'auditable_type',
                'auditable_id'
            ]);
            $table->index('performed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};