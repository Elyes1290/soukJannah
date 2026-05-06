<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\StockAlertController;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'price'       => $p->price,
                'sale_price'  => $p->sale_price,
                'stock'       => $p->stock,
                'is_active'   => $p->is_active,
                'is_featured' => $p->is_featured,
                'main_image_url' => $p->main_image_url,
                'category'    => $p->category?->name,
            ]);

        return Inertia::render('Admin/Products/Index', compact('products'));
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        return Inertia::render('Admin/Products/Form', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price'             => 'required|numeric|min:0',
            'sale_price'        => 'nullable|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'sku'               => 'nullable|string|max:100|unique:products',
            'category_id'       => 'nullable|exists:categories,id',
            'is_active'         => 'boolean',
            'is_featured'       => 'boolean',
            'main_image'        => 'nullable|image|max:4096',
            'images.*'          => 'nullable|image|max:4096',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('main_image')) {
            $data['main_image'] = $request->file('main_image')->store('products', 'public');
        }

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create(['path' => $path, 'sort_order' => $i]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $product->load('images', 'variants');

        return Inertia::render('Admin/Products/Form', [
            'product'    => [
                'id'                => $product->id,
                'name'              => $product->name,
                'description'       => $product->description,
                'short_description' => $product->short_description,
                'price'             => $product->price,
                'sale_price'        => $product->sale_price,
                'stock'             => $product->stock,
                'sku'               => $product->sku,
                'category_id'       => $product->category_id,
                'is_active'         => $product->is_active,
                'is_featured'       => $product->is_featured,
                'main_image_url'    => $product->main_image_url,
                'images'            => $product->images->map(fn($img) => [
                    'id'  => $img->id,
                    'url' => $img->url,
                ]),
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price'             => 'required|numeric|min:0',
            'sale_price'        => 'nullable|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'sku'               => 'nullable|string|max:100|unique:products,sku,' . $product->id,
            'category_id'       => 'nullable|exists:categories,id',
            'is_active'         => 'boolean',
            'is_featured'       => 'boolean',
            'main_image'        => 'nullable|image|max:4096',
            'images.*'          => 'nullable|image|max:4096',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('main_image')) {
            if ($product->main_image) {
                Storage::disk('public')->delete($product->main_image);
            }
            $data['main_image'] = $request->file('main_image')->store('products', 'public');
        } else {
            unset($data['main_image']); // conserver l'image existante
        }

        $wasOutOfStock = $product->stock === 0;
        $product->update($data);

        // Si le produit était épuisé et que le stock vient d'être réapprovisionné, on notifie
        if ($wasOutOfStock && $product->fresh()->stock > 0) {
            StockAlertController::notifyForProduct($product->fresh());
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create(['path' => $path, 'sort_order' => $product->images()->count() + $i]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product)
    {
        if ($product->main_image) {
            Storage::disk('public')->delete($product->main_image);
        }
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        $product->delete();

        return back()->with('success', 'Produit supprimé.');
    }

    public function destroyImage(ProductImage $image)
    {
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return back()->with('success', 'Image supprimée.');
    }
}
