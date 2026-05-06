<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => Post::orderByDesc('created_at')->get()->map(fn($p) => [
                'id'           => $p->id,
                'title'        => $p->title,
                'slug'         => $p->slug,
                'is_published' => $p->is_published,
                'published_at' => $p->published_at?->format('d/m/Y'),
                'created_at'   => $p->created_at->format('d/m/Y'),
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', ['post' => null]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:200',
            'excerpt'          => 'nullable|string|max:300',
            'content'          => 'required|string',
            'meta_description' => 'nullable|string|max:160',
            'is_published'     => 'boolean',
            'cover_image'      => 'nullable|image|max:3072',
        ]);

        $data['slug'] = Post::generateSlug($data['title']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        }

        if (!empty($data['is_published'])) {
            $data['published_at'] = now();
        }

        Post::create($data);

        return redirect()->route('admin.posts.index')->with('success', 'Article créé.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => [
                'id'               => $post->id,
                'title'            => $post->title,
                'slug'             => $post->slug,
                'excerpt'          => $post->excerpt,
                'content'          => $post->content,
                'meta_description' => $post->meta_description,
                'is_published'     => $post->is_published,
                'cover_image_url'  => $post->cover_image_url,
            ],
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:200',
            'excerpt'          => 'nullable|string|max:300',
            'content'          => 'required|string',
            'meta_description' => 'nullable|string|max:160',
            'is_published'     => 'boolean',
            'cover_image'      => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image) Storage::disk('public')->delete($post->cover_image);
            $data['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        } else {
            unset($data['cover_image']);
        }

        if (!empty($data['is_published']) && !$post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);

        return redirect()->route('admin.posts.index')->with('success', 'Article mis à jour.');
    }

    public function destroy(Post $post)
    {
        if ($post->cover_image) Storage::disk('public')->delete($post->cover_image);
        $post->delete();
        return back()->with('success', 'Article supprimé.');
    }
}
