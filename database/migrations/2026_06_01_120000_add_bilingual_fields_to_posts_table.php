<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('title_fr')->nullable()->after('slug');
            $table->string('title_en')->nullable()->after('title_fr');
            $table->string('excerpt_fr')->nullable()->after('title_en');
            $table->string('excerpt_en')->nullable()->after('excerpt_fr');
            $table->longText('content_fr')->nullable()->after('excerpt_en');
            $table->longText('content_en')->nullable()->after('content_fr');
            $table->string('meta_description_fr')->nullable()->after('content_en');
            $table->string('meta_description_en')->nullable()->after('meta_description_fr');
        });

        foreach (DB::table('posts')->orderBy('id')->get() as $post) {
            DB::table('posts')->where('id', $post->id)->update([
                'title_fr'            => $post->title,
                'excerpt_fr'          => $post->excerpt,
                'content_fr'          => $post->content,
                'meta_description_fr' => $post->meta_description,
            ]);
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['title', 'excerpt', 'content', 'meta_description']);
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('title')->nullable()->after('slug');
            $table->string('excerpt')->nullable()->after('title');
            $table->longText('content')->nullable()->after('excerpt');
            $table->string('meta_description')->nullable()->after('content');
        });

        DB::table('posts')->orderBy('id')->each(function ($post) {
            DB::table('posts')->where('id', $post->id)->update([
                'title'            => $post->title_fr,
                'excerpt'          => $post->excerpt_fr,
                'content'          => $post->content_fr,
                'meta_description' => $post->meta_description_fr,
            ]);
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'title_fr', 'title_en',
                'excerpt_fr', 'excerpt_en',
                'content_fr', 'content_en',
                'meta_description_fr', 'meta_description_en',
            ]);
        });
    }
};
