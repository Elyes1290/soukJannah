<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $categorySlug = $request->query('categorie');
        $sort         = $request->query('tri', 'pertinence');
        $search       = trim($request->query('q', ''));

        $query = Product::with('category')->where('is_active', true);

        // Recherche plein texte + log
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });

            // Enregistrer la recherche pour les suggestions populaires
            DB::table('search_logs')->upsert(
                ['query' => mb_strtolower(trim($search)), 'count' => 1, 'last_searched_at' => now()],
                ['query'],
                ['count' => DB::raw('count + 1'), 'last_searched_at' => now()]
            );
        }

        // Tri
        match ($sort) {
            'prix-asc'   => $query->orderBy('price'),
            'prix-desc'  => $query->orderByDesc('price'),
            'nouveautes' => $query->orderByDesc('created_at'),
            default      => $query->orderBy('sort_order')->orderByDesc('created_at'),
        };

        $activeCategory = null;
        if ($categorySlug) {
            $activeCategory = Category::where('slug', $categorySlug)->where('is_active', true)->first();
            if ($activeCategory) {
                $query->where('category_id', $activeCategory->id);
            }
        }

        $paginator = $query->paginate(20)->withQueryString();

        // Charger les moyennes d'avis pour tous les produits de la page
        $productIds = $paginator->getCollection()->pluck('id');
        $ratings = Review::where('is_active', true)
            ->whereIn('product_id', $productIds)
            ->selectRaw('product_id, ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as reviews_count')
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        $products = $paginator->getCollection()->map(fn($p) => [
            'id'                => $p->id,
            'name'              => $p->name,
            'slug'              => $p->slug,
            'short_description' => $p->short_description,
            'price'             => $p->price,
            'sale_price'        => $p->sale_price,
            'main_image_url'    => $p->main_image_url,
            'category'          => $p->category?->name,
            'stock'             => $p->stock,
            'is_featured'       => $p->is_featured,
            'avg_rating'        => $ratings->get($p->id)?->avg_rating,
            'reviews_count'     => $ratings->get($p->id)?->reviews_count ?? 0,
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
                'products_count' => $c->products_count,
            ]);

        return Inertia::render('Shop/Index', [
            'products'       => $products,
            'categories'     => $categories,
            'activeCategory' => $activeCategory ? ['name' => $activeCategory->name, 'slug' => $activeCategory->slug] : null,
            'activeSort'     => $sort,
            'activeSearch'   => $search,
            'pagination'     => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'from'         => $paginator->firstItem(),
                'to'           => $paginator->lastItem(),
            ],
        ]);
    }

    public function storeReview(\Illuminate\Http\Request $request, string $slug)
    {
        $product    = Product::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $customerId = session('customer_id');

        if (!$customerId) {
            return redirect()->route('customer.login', ['redirect' => "/boutique/{$slug}"]);
        }

        $customer = Customer::findOrFail($customerId);

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating'   => 'required|integer|min:1|max:5',
            'content'  => 'required|string|min:10|max:1000',
        ]);

        $order = Order::with('items')->findOrFail($request->order_id);
        $ownsOrder = $order->customer_id === $customer->id
            || ($order->customer && $order->customer->email === $customer->email);
        abort_if(!$ownsOrder, 403);

        $hasProduct = $order->items->contains('product_id', $product->id);
        abort_if(!$hasProduct, 403);

        $alreadyReviewed = Review::where('customer_id', $customerId)
            ->where('product_id', $product->id)
            ->exists();
        if ($alreadyReviewed) {
            return back()->withErrors(['content' => 'Vous avez déjà laissé un avis pour ce produit.']);
        }

        Review::create([
            'customer_id'       => $customerId,
            'order_id'          => $request->order_id,
            'product_id'        => $product->id,
            'author'            => $customer->first_name . ' ' . substr($customer->last_name, 0, 1) . '.',
            'rating'            => $request->rating,
            'content'           => $request->content,
            'is_active'         => false,
            'verified_purchase' => true,
        ]);

        return back()->with('review_success', true);
    }

    public function show(string $slug)
    {
        $product = Product::with(['images', 'variants', 'category'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $reviews = Review::where('product_id', $product->id)
            ->where('is_active', true)
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id'                => $r->id,
                'author'            => $r->author,
                'rating'            => $r->rating,
                'content'           => $r->content,
                'verified_purchase' => (bool) $r->verified_purchase,
                'created_at'        => $r->created_at->format('d M Y'),
            ]);

        $avgRating     = $reviews->avg('rating');
        $reviewsCount  = $reviews->count();

        $customerId = session('customer_id');

        // Vérifier si le client connecté peut laisser un avis sur ce produit
        $canReview   = false;
        $reviewOrderId = null;
        $alreadyReviewed = false;

        if ($customerId) {
            $customer = Customer::find($customerId);
            if ($customer) {
                // A-t-il déjà laissé un avis sur ce produit ?
                $existingReview = Review::where('customer_id', $customerId)
                    ->where('product_id', $product->id)
                    ->first();

                $alreadyReviewed = $existingReview !== null;
                // Si l'avis est approuvé, on ne montre plus le message "en attente"
                $reviewPending   = $existingReview && !$existingReview->is_active;

                if (!$alreadyReviewed) {
                    // A-t-il commandé ce produit (commande expédiée ou livrée) ?
                    $order = Order::with('items')
                        ->where(function ($q) use ($customer) {
                            $q->where('customer_id', $customer->id)
                              ->orWhereHas('customer', fn($sq) => $sq->where('email', $customer->email));
                        })
                        ->whereIn('status', ['shipped', 'delivered'])
                        ->whereHas('items', fn($q) => $q->where('product_id', $product->id))
                        ->latest()
                        ->first();

                    if ($order) {
                        $canReview   = true;
                        $reviewOrderId = $order->id;
                    }
                }
            }
        }

        $appUrl = rtrim(config('app.url'), '/');

        return Inertia::render('Shop/Show', [
            'auth' => [
                'customer'         => $customerId ? true : null,
                'can_review'       => $canReview,
                'review_order_id'  => $reviewOrderId,
                'already_reviewed' => $alreadyReviewed,
                'review_pending'   => $reviewPending ?? false,
            ],
            'product' => [
                'id'                => $product->id,
                'name'              => $product->name,
                'description'       => $product->description,
                'short_description' => $product->short_description,
                'sku'               => $product->sku,
                'price'             => $product->price,
                'sale_price'        => $product->sale_price,
                'stock'             => $product->stock,
                'slug'              => $product->slug,
                'main_image_url'    => $product->main_image_url,
                'images'            => $product->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url]),
                'variants'          => $product->variants,
                'category'          => $product->category?->name,
                'avg_rating'        => $avgRating ? round($avgRating, 1) : null,
                'reviews_count'     => $reviewsCount,
                'reviews'           => $reviews,
                'og' => [
                    'url'         => $appUrl . '/boutique/' . $product->slug,
                    'title'       => $product->name . ' — SoukJannah',
                    'description' => $product->short_description ?: substr(strip_tags($product->description ?? ''), 0, 160),
                    'image'       => $product->main_image_url,
                ],
            ],
        ]);
    }
}
