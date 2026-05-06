<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Product;

class SitemapController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at']);

        $categories = Category::where('is_active', true)
            ->get(['slug', 'updated_at']);

        $posts = Post::where('is_published', true)
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at']);

        $staticPages = [
            ['url' => '/',               'priority' => '1.0',  'freq' => 'weekly'],
            ['url' => '/boutique',       'priority' => '0.9',  'freq' => 'daily'],
            ['url' => '/a-propos',       'priority' => '0.5',  'freq' => 'monthly'],
            ['url' => '/contact',        'priority' => '0.6',  'freq' => 'monthly'],
            ['url' => '/faq',            'priority' => '0.6',  'freq' => 'monthly'],
            ['url' => '/livraison',      'priority' => '0.5',  'freq' => 'monthly'],
            ['url' => '/mentions-legales', 'priority' => '0.3','freq' => 'yearly'],
            ['url' => '/blog',             'priority' => '0.7','freq' => 'weekly'],
        ];

        return response()
            ->view('sitemap', compact('products', 'categories', 'staticPages', 'posts'))
            ->header('Content-Type', 'application/xml');
    }
}
