<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('is_published', true)
            ->orderByDesc('published_at')
            ->get()
            ->map(fn($p) => [
                'id'               => $p->id,
                'title'            => $p->title,
                'slug'             => $p->slug,
                'excerpt'          => $p->excerpt,
                'cover_image_url'  => $p->cover_image_url,
                'published_at'     => $p->published_at?->format('M j, Y'),
                'reading_time'     => $p->reading_time,
            ]);

        return Inertia::render('Blog/Index', compact('posts'));
    }

    public function show(string $slug)
    {
        $post = Post::where('slug', $slug)->where('is_published', true)->firstOrFail();

        $related = Post::where('is_published', true)
            ->where('id', '!=', $post->id)
            ->orderByDesc('published_at')
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'title'           => $p->title,
                'slug'            => $p->slug,
                'excerpt'         => $p->excerpt,
                'cover_image_url' => $p->cover_image_url,
                'published_at'    => $p->published_at?->format('M j, Y'),
                'reading_time'    => $p->reading_time,
            ]);

        return Inertia::render('Blog/Show', [
            'post' => [
                'id'               => $post->id,
                'title'            => $post->title,
                'slug'             => $post->slug,
                'excerpt'          => $post->excerpt,
                'content'          => $post->content,
                'cover_image_url'  => $post->cover_image_url,
                'meta_description' => $post->meta_description,
                'published_at'     => $post->published_at?->format('M j, Y'),
                'reading_time'     => $post->reading_time,
            ],
            'related' => $related,
        ]);
    }
}
