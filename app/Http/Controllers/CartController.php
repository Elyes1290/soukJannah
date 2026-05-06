<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function __construct(private CartService $cart) {}

    public function index()
    {
        return Inertia::render('Cart/Index', [
            'cart' => $this->cart->summary(),
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'integer|min:1|max:100',
        ]);

        $this->cart->add($request->product_id, $request->quantity ?? 1);
        $this->saveCartSnapshot();

        return back()->with('success', 'Produit ajouté au panier.');
    }

    public function update(Request $request, int $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $this->cart->update($productId, $request->quantity);
        $this->saveCartSnapshot();

        return back();
    }

    public function remove(int $productId)
    {
        $this->cart->remove($productId);
        $this->saveCartSnapshot();

        return back()->with('success', 'Produit retiré du panier.');
    }

    public function clear()
    {
        $this->cart->clear();
        $this->clearCartSnapshot();

        return back()->with('success', 'Panier vidé.');
    }

    // ── Snapshot du panier pour récupération abandonnée ───────────────────────

    private function saveCartSnapshot(): void
    {
        $customerId = session('customer_id');
        if (!$customerId) return;

        $customer = Customer::find($customerId);
        if (!$customer) return;

        $summary = $this->cart->summary();
        if (empty($summary['items'])) {
            $this->clearCartSnapshot();
            return;
        }

        $customer->update([
            'cart_snapshot'          => $summary['items'],
            'cart_updated_at'        => now(),
            'abandoned_cart_sent_at' => null,
        ]);
    }

    private function clearCartSnapshot(): void
    {
        $customerId = session('customer_id');
        if (!$customerId) return;

        $customer = Customer::find($customerId);
        if (!$customer) return;

        $customer->update([
            'cart_snapshot'          => null,
            'cart_updated_at'        => null,
            'abandoned_cart_sent_at' => null,
        ]);
    }
}
