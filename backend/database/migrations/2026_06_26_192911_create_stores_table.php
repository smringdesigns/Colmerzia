<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique(); // UUID público
            $table->string('name');
            $table->string('subdomain')->unique(); // Multitenancy
            $table->string('domain')->nullable()->unique(); // <-- Agrega esta línea
            $table->string('custom_domain')->nullable()->unique(); // Para dominios propios futuros
            
            // Datos de contacto y configuración agregados
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('country')->default('CO');
            $table->string('currency')->default('COP');
            $table->string('timezone')->default('America/Bogota');
            
            // Configuración comercial
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            
            // Plan SaaS futuro
            $table->string('plan')->default('free');
            
            $table->timestamps();
            $table->softDeletes();

            // Índices 
            $table->index('name');
            $table->index('subdomain');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};