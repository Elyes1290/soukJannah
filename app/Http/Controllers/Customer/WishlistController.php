<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $customerId = session('customer_id');

        $items = Wishlist::where('customer_id', $customerId)
            ->with(['product' => fn($q) => $q->with('images')])
            ->latest()
            ->get()
            ->filter(fn($w) => $w->product && $w->product->is_active)
            ->map(fn($w) => [
                'id'             => $w->id,
                'product_id'     => $w->product->id,
                'name'           => $w->product->name,
                'slug'           => $w->product->slug,
                'price'          => $w->product->price,
                'sale_price'     => $w->product->sale_price,
                'main_image_url' => $w->product->main_image_url,
                'stock'          => $w->product->stock,
                'is_active'      => $w->product->is_active,
            ])
            ->values();

        return Inertia::render('Customer/Wishlist', [
            'items' => $items,
        ]);
    }

    public function toggle(Request $request)
    {
        $customerId = session('customer_id');

        if (!$customerId) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }

        $request->validate(['product_id' => 'required|exists:products,id']);

        $existing = Wishlist::where('customer_id', $customerId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            $inWishlist = false;
        } else {
            Wishlist::create([
                'customer_id' => $customerId,
                'product_id'  => $request->product_id,
            ]);
            $inWishlist = true;
        }

        $count = Wishlist::where('customer_id', $customerId)->count();

        return response()->json([
            'in_wishlist'    => $inWishlist,
            'wishlist_count' => $count,
        ]);
    }
}
