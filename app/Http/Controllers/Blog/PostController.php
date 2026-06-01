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
            ->map->toPublicPayload();

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
            ->map->toPublicPayload();

        return Inertia::render('Blog/Show', [
            'post'    => $post->toPublicPayload(),
            'related' => $related,
        ]);
    }
}
