<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')
            ->withCount('products')
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        $parentOptions = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Index', compact('categories', 'parentOptions'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'parent_id'   => 'nullable|exists:categories,id',
        ]);

        $data['slug'] = Str::slug($data['name']);
        Category::create($data);

        return back()->with('success', 'Catégorie créée.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'parent_id'   => 'nullable|exists:categories,id',
        ]);

        // Empêcher qu'une catégorie soit son propre parent
        if (!empty($data['parent_id']) && $data['parent_id'] == $category->id) {
            unset($data['parent_id']);
        }

        $data['slug'] = Str::slug($data['name']);
        $category->update($data);

        return back()->with('success', 'Catégorie mise à jour.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Catégorie supprimée.');
    }
}
