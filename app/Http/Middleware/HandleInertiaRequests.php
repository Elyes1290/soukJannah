<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Setting;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cart = app(CartService::class);

        return [
            ...parent::share($request),
            'flash' => [
                'success'          => $request->session()->get('success'),
                'error'            => $request->session()->get('error'),
                'contact_success'  => $request->session()->get('contact_success'),
                'discount_success' => $request->session()->get('discount_success'),
                'discount_error'   => $request->session()->get('discount_error'),
            ],
            'cartCount'  => $cart->count(),
            'navCategories' => Category::where('is_active', true)
                ->whereNull('parent_id')
                ->with(['children' => fn($q) => $q->where('is_active', true)->orderBy('sort_order')])
                ->withCount(['products' => fn($q) => $q->where('is_active', true)])
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug'])
                ->map(fn($c) => [
                    'id'       => $c->id,
                    'name'     => $c->name,
                    'slug'     => $c->slug,
                    'children' => $c->children->map(fn($sub) => [
                        'name' => $sub->name,
                        'slug' => $sub->slug,
                    ]),
                ]),
            'popularSearches' => \Illuminate\Support\Facades\DB::table('search_logs')
                ->orderByDesc('count')
                ->limit(6)
                ->pluck('query'),
            'authCustomer' => function () use ($request) {
                $id = $request->session()->get('customer_id');
                if (!$id) return null;
                $c = Customer::find($id);
                return $c ? ['first_name' => $c->first_name, 'email' => $c->email] : null;
            },
            'settings'  => [
                'meta_pixel_id'   => Setting::get('meta_pixel_id'),
                'tiktok_pixel_id' => Setting::get('tiktok_pixel_id'),
                'ga4_id'          => Setting::get('ga4_id'),
                'shop_name'       => Setting::get('shop_name', 'SoukJannah'),
            ],
        ];
    }
}
