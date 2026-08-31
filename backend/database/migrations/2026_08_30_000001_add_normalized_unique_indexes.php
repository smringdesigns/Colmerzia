<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        // PostgreSQL usa BTRIM; SQLite usa TRIM en el entorno de tests.
        $trim = $driver === 'sqlite' ? 'TRIM' : 'BTRIM';

        DB::statement("
            CREATE UNIQUE INDEX users_email_normalized_unique
            ON users (LOWER({$trim}(email)))
        ");

        DB::statement("
            CREATE UNIQUE INDEX roles_global_slug_normalized_unique
            ON roles (LOWER({$trim}(slug)))
            WHERE store_id IS NULL AND deleted_at IS NULL
        ");

        DB::statement("
            CREATE UNIQUE INDEX roles_store_slug_normalized_unique
            ON roles (store_id, LOWER({$trim}(slug)))
            WHERE store_id IS NOT NULL AND deleted_at IS NULL
        ");
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_email_normalized_unique');
        DB::statement('DROP INDEX IF EXISTS roles_global_slug_normalized_unique');
        DB::statement('DROP INDEX IF EXISTS roles_store_slug_normalized_unique');
    }
};