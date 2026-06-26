<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {

            // PK interna
            $table->id();

            // UUID público
            $table->uuid('uuid')->unique();

            // Información principal
            $table->string('name');
            $table->string('slug')->unique();

            // Contacto
            $table->string('email')->nullable();
            $table->string('phone',50)->nullable();

            // Branding
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();

            // Multitenancy
            $table->string('subdomain')->unique();

            // Configuración regional
            $table->string('country',10)->default('CO');
            $table->string('currency',10)->default('COP');
            $table->string('timezone')
                  ->default('America/Bogota');

            // Configuración comercial
            $table->boolean('is_active')
                  ->default(true);

            $table->boolean('is_verified')
                  ->default(false);

            // Plan SaaS futuro
            $table->string('plan')
                  ->default('free');

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('name');
            $table->index('subdomain');
            $table->index('country');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};