<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\NewsletterSubscriber;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->string('token')->nullable()->unique()->after('is_active');
        });

        // Générer un token pour les abonnés existants
        NewsletterSubscriber::whereNull('token')->each(function ($subscriber) {
            $subscriber->update(['token' => Str::random(40)]);
        });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn('token');
        });
    }
};
