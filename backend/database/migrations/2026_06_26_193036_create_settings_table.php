<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Tienda propietaria
            $table->foreignId('store_id')
                  ->nullable()
                  ->constrained()
                  ->cascadeOnDelete();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Grupo de configuración
            // general, payment, shipping, tax, seo, mail
            $table->string('group');

            // Clave
            $table->string('key');

            // Valor
            $table->json('value')
                  ->nullable();

            // Descripción
            $table->text('description')
                  ->nullable();

            // Estado
            $table->boolean('is_public')
                  ->default(false);

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('group');
            $table->index('key');

            // Evita claves duplicadas
            $table->unique([
                'store_id',
                'group',
                'key'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};