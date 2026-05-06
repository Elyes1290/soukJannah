<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->json('cart_snapshot')->nullable()->after('email_verification_token');
            $table->timestamp('cart_updated_at')->nullable()->after('cart_snapshot');
            $table->timestamp('abandoned_cart_sent_at')->nullable()->after('cart_updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['cart_snapshot', 'cart_updated_at', 'abandoned_cart_sent_at']);
        });
    }
};
