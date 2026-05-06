<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'all');

        $query = Review::with(['product', 'customer'])
            ->orderByDesc('created_at');

        if ($filter === 'pending') {
            $query->where('is_active', false);
        } elseif ($filter === 'approved') {
            $query->where('is_active', true);
        }

        $reviews = $query->get()->map(fn($r) => [
            'id'           => $r->id,
            'author'       => $r->author,
            'rating'       => $r->rating,
            'content'      => $r->content,
            'is_active'    => $r->is_active,
            'created_at'   => $r->created_at->format('d/m/Y H:i'),
            'product_name' => $r->product?->name,
            'product_slug' => $r->product?->slug,
            'customer_email' => $r->customer?->email,
            'is_verified'  => $r->customer_id !== null,
        ]);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews'       => $reviews,
            'filter'        => $filter,
            'counts' => [
                'all'      => Review::count(),
                'pending'  => Review::where('is_active', false)->count(),
                'approved' => Review::where('is_active', true)->count(),
            ],
        ]);
    }

    public function update(Request $request, Review $review)
    {
        // Modération uniquement : on ne peut que changer is_active
        $review->update(['is_active' => !$review->is_active]);
        return back()->with('success', $review->is_active ? 'Avis approuvé.' : 'Avis masqué.');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Avis supprimé.');
    }
}
