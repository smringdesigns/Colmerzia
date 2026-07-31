<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Tabla de usuarios
        |--------------------------------------------------------------------------
        */
        Schema::create('users', function (Blueprint $table) {

            // PK interna
            $table->id();

            // Relación con la tienda (la FK se agregará después)
            $table->unsignedBigInteger('store_id')
                  ->nullable();

            // UUID público
            $table->uuid('uuid')
                  ->unique();

            // Información básica
            $table->string('name');

            $table->string('email')
                  ->unique();

            $table->timestamp('email_verified_at')
                  ->nullable();

            $table->string('password');

            // Perfil del usuario
            $table->string('avatar')
                  ->nullable();

            // Estado del usuario
            $table->boolean('is_active')
                  ->default(true);

            // Último inicio de sesión
            $table->timestamp('last_login_at')
                  ->nullable();

            // Campos propios de Laravel
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('store_id');
            $table->index('email');
            $table->index('is_active');
        });

        /*
        |--------------------------------------------------------------------------
        | Recuperación de contraseña
        |--------------------------------------------------------------------------
        */
        Schema::create('password_reset_tokens', function (Blueprint $table) {

            $table->string('email')
                  ->primary();

            $table->string('token');

            $table->timestamp('created_at')
                  ->nullable();
        });

        /*
        |--------------------------------------------------------------------------
        | Sesiones de usuario
        |--------------------------------------------------------------------------
        */
        Schema::create('sessions', function (Blueprint $table) {

            $table->string('id')
                  ->primary();

            $table->foreignId('user_id')
                  ->nullable()
                  ->index();

            $table->string('ip_address', 45)
                  ->nullable();

            $table->text('user_agent')
                  ->nullable();

            $table->longText('payload');

            $table->integer('last_activity')
                  ->index();
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};