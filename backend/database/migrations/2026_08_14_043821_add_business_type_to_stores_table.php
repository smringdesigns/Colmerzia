<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('business_type')
                ->nullable()
                ->after('subdomain');

            // La columna `plan` nunca se llegó a usar: el plan real de
            // una tienda vive en `subscriptions.plan_slug` (creado por
            // StoreOnboardingService). Dejarla viva es un riesgo de
            // que alguien la lea por error pensando que es la fuente
            // de verdad.
            $table->dropColumn('plan');
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->index('business_type');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['business_type']);
            $table->dropColumn('business_type');
            $table->string('plan')->default('free');
        });
    }
};
