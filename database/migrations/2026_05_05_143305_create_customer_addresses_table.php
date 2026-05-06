<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('label', 60)->default('Home');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('address', 255);
            $table->string('address2', 255)->nullable();
            $table->string('city', 100);
            $table->string('postal_code', 20);
            $table->string('country', 2)->default('CH');
            $table->string('phone', 30)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
