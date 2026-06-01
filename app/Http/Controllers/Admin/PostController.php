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
            'posts' => Post::orderByDesc('created_at')->get()->map->toAdminSummary(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Form', ['post' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        $data['slug'] = Post::generateSlug($data['title_fr']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        }

        if (! empty($data['is_published'])) {
            $data['published_at'] = now();
        }

        Post::create($data);

        return redirect()->route('admin.posts.index')->with('success', 'Article créé.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Form', [
            'post' => [
                'id'                  => $post->id,
                'slug'                => $post->slug,
                'title_fr'            => $post->title_fr,
                'title_en'            => $post->title_en,
                'excerpt_fr'          => $post->excerpt_fr,
                'excerpt_en'          => $post->excerpt_en,
                'content_fr'          => $post->content_fr,
                'content_en'          => $post->content_en,
                'meta_description_fr' => $post->meta_description_fr,
                'meta_description_en' => $post->meta_description_en,
                'is_published'        => $post->is_published,
                'cover_image_url'     => $post->cover_image_url,
            ],
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $data = $this->validated($request);

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        } else {
            unset($data['cover_image']);
        }

        if (! empty($data['is_published']) && ! $post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);

        return redirect()->route('admin.posts.index')->with('success', 'Article mis à jour.');
    }

    public function destroy(Post $post)
    {
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }
        $post->delete();

        return back()->with('success', 'Article supprimé.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title_fr'            => 'required|string|max:200',
            'title_en'            => 'nullable|string|max:200',
            'excerpt_fr'          => 'nullable|string|max:300',
            'excerpt_en'          => 'nullable|string|max:300',
            'content_fr'          => 'required|string',
            'content_en'          => 'nullable|string',
            'meta_description_fr' => 'nullable|string|max:160',
            'meta_description_en' => 'nullable|string|max:160',
            'is_published'        => 'boolean',
            'cover_image'         => 'nullable|image|max:3072',
        ]);
    }
}
