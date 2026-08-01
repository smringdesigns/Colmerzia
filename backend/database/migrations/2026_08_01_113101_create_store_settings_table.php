<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            
            // Llave foránea que conecta esta configuración con su respectiva tienda
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            
            $table->string('contact_email')->nullable(); // Correo público de contacto de la tienda
            $table->string('contact_phone')->nullable(); // Teléfono público
            $table->string('currency')->default('USD'); // Moneda base (ej: COP, USD, MXN)
            $table->string('timezone')->default('UTC'); // Zona horaria de la tienda
            $table->string('logo_path')->nullable(); // Ruta de la imagen del logo
            $table->json('theme_colors')->nullable(); // Colores personalizados de la tienda (en formato JSON)
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};