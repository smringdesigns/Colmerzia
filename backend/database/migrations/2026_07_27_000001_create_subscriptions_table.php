<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fuente de verdad del plan y estado de facturación de cada
     * tienda. Separada de `stores.plan` (que queda como legado / cache
     * denormalizado, no se usa para lógica de negocio) porque acá sí
     * necesitamos historial de fechas y estados, no solo un string.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {

            $table->id();

            $table->foreignId('store_id')
                  ->unique()
                  ->constrained('stores')
                  ->cascadeOnDelete();

            // Slug del plan: free | starter | pro | business
            // (definidos en config/plans.php)
            $table->string('plan_slug')->default('free');

            // trialing | active | read_only | canceled
            $table->string('status')->default('trialing');

            $table->timestamp('trial_ends_at')->nullable();

            // Vigencia del período pagado actual (cuando status=active).
            $table->timestamp('current_period_ends_at')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('plan_slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
