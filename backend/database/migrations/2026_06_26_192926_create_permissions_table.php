<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {

            // PK interna
            $table->id();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Información
            $table->string('name');

            // Identificador interno
            $table->string('slug')
                  ->unique();

            // Descripción
            $table->text('description')
                  ->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};