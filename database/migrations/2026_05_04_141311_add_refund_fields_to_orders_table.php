<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('refunded_amount', 10, 2)->nullable()->after('total');
            $table->string('refund_reason')->nullable()->after('refunded_amount');
            $table->timestamp('disputed_at')->nullable()->after('refund_reason');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['refunded_amount', 'refund_reason', 'disputed_at']);
        });
    }
};
