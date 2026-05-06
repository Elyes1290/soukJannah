<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();                    // Ex: RAMADAN20
            $table->enum('type', ['percent', 'fixed']);          // % ou montant fixe
            $table->decimal('value', 8, 2);                     // 20 (%) ou 10 (CHF)
            $table->decimal('min_amount', 8, 2)->default(0);    // Montant minimum panier
            $table->unsignedInteger('max_uses')->nullable();     // null = illimité
            $table->unsignedInteger('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_codes');
    }
};
