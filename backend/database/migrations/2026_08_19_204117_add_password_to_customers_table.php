<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Nullable a propósito: un Customer también se crea "de
            // paso" en un checkout de invitado (sin cuenta). Solo
            // tiene password cuando de verdad se registró.
            $table->string('password')
                ->nullable()
                ->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('password');
        });
    }
};
