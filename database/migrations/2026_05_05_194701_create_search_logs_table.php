<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_logs', function (Blueprint $table) {
            $table->id();
            $table->string('query', 200);
            $table->unsignedBigInteger('count')->default(1);
            $table->timestamp('last_searched_at')->useCurrent();
            $table->unique('query');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_logs');
    }
};
