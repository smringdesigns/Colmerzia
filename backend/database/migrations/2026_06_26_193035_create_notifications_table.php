<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->nullable()
                  ->constrained()
                  ->cascadeOnDelete();

            // Usuario destinatario
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // Cliente destinatario
            $table->foreignId('customer_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Canal
            $table->enum('channel', [
                'email',
                'sms',
                'whatsapp',
                'push',
                'system',
                'webhook'
            ]);

            // Tipo de evento
            $table->string('event');

            // Asunto
            $table->string('subject')
                  ->nullable();

            // Destinatario
            $table->string('recipient');

            // Contenido
            $table->longText('content')
                  ->nullable();

            // Estado
            $table->enum('status', [
                'pending',
                'processing',
                'sent',
                'delivered',
                'failed'
            ])->default('pending');

            // Error si falla
            $table->text('error_message')
                  ->nullable();

            // Datos adicionales
            $table->json('payload')
                  ->nullable();

            // Fechas
            $table->timestamp('sent_at')
                  ->nullable();

            $table->timestamp('delivered_at')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('user_id');
            $table->index('customer_id');
            $table->index('channel');
            $table->index('event');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};