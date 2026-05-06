<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\FeaturedOffer;
use App\Models\Order;
use App\Models\Post;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featured = Product::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get()
            ->map(fn($p) => [
                'id'             => $p->id,
                'name'           => $p->name,
                'slug'           => $p->slug,
                'short_description' => $p->short_description,
                'price'          => $p->price,
                'sale_price'     => $p->sale_price,
                'main_image_url' => $p->main_image_url,
            ]);

        $categories = Category::where('is_active', true)
            ->withCount(['products' => fn($q) => $q->where('is_active', true)])
            ->having('products_count', '>', 0)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'name'           => $c->name,
                'slug'           => $c->slug,
                'description'    => $c->description,
                'products_count' => $c->products_count,
            ]);

        $featuredOffers = FeaturedOffer::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn($o) => [
                'id'             => $o->id,
                'title'          => $o->title,
                'description'    => $o->description,
                'items_list'     => $o->items_list,
                'price'          => $o->price,
                'original_price' => $o->original_price,
                'url'            => $o->url,
                'image_url'      => $o->image_url,
            ]);

        $reviews = Review::where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'       => $r->id,
                'author'   => $r->author,
                'location' => $r->location,
                'rating'   => $r->rating,
                'content'  => $r->content,
            ]);

        $latestPosts = Post::where('is_published', true)
            ->orderByDesc('published_at')
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id'              => $p->id,
                'title'           => $p->title,
                'slug'            => $p->slug,
                'excerpt'         => $p->excerpt,
                'cover_image_url' => $p->cover_image_url,
                'published_at'    => $p->published_at?->format('M j, Y'),
                'reading_time'    => $p->reading_time,
            ]);

        $stats = [
            'orders_shipped'  => Order::whereIn('status', ['shipped', 'delivered'])->count(),
            'happy_customers' => Customer::distinct('email')->count('email'),
            'products_count'  => Product::where('is_active', true)->count(),
        ];

        return Inertia::render('Home', compact('featured', 'categories', 'featuredOffers', 'reviews', 'latestPosts', 'stats'));
    }
}
