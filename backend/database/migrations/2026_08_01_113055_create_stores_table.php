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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('name'); // Nombre de la empresa
            $table->string('subdomain')->unique(); // ej: mitienda (para mitienda.colmerzia.com)
            $table->string('custom_domain')->nullable()->unique(); // ej: www.mitienda.com
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // Permite "borrar" la tienda sin perder los datos reales
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};