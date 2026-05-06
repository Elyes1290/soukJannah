<?php

namespace App\Services;

use App\Models\DiscountCode;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartService
{
    private const SESSION_KEY  = 'cart';
    private const DISCOUNT_KEY = 'discount_code';

    public function get(): array
    {
        return Session::get(self::SESSION_KEY, []);
    }

    public function add(int $productId, int $quantity = 1): void
    {
        $cart    = $this->get();
        $product = Product::find($productId);

        if (!$product || !$product->is_active) return;

        $maxQty = $product->stock;

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = min($cart[$productId]['quantity'] + $quantity, $maxQty);
        } else {
            $cart[$productId] = [
                'product_id' => $productId,
                'name'       => $product->name,
                'price'      => (float) ($product->sale_price ?? $product->price),
                'image'      => $product->main_image_url,
                'slug'       => $product->slug,
                'stock'      => $maxQty,
                'quantity'   => min($quantity, $maxQty),
            ];
        }

        Session::put(self::SESSION_KEY, $cart);
    }

    public function update(int $productId, int $quantity): void
    {
        $cart = $this->get();
        if (!isset($cart[$productId])) return;
        if ($quantity <= 0) { $this->remove($productId); return; }
        $cart[$productId]['quantity'] = min($quantity, $cart[$productId]['stock']);
        Session::put(self::SESSION_KEY, $cart);
    }

    public function remove(int $productId): void
    {
        $cart = $this->get();
        unset($cart[$productId]);
        Session::put(self::SESSION_KEY, $cart);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
        Session::forget(self::DISCOUNT_KEY);
    }

    public function items(): array
    {
        return array_values($this->get());
    }

    public function count(): int
    {
        return array_sum(array_column($this->get(), 'quantity'));
    }

    public function subtotal(): float
    {
        return array_reduce($this->get(), fn($carry, $item) => $carry + $item['price'] * $item['quantity'], 0);
    }

    public function discountCode(): ?DiscountCode
    {
        $code = Session::get(self::DISCOUNT_KEY);
        if (!$code) return null;
        return DiscountCode::where('code', $code)->where('is_active', true)->first();
    }

    public function discountAmount(): float
    {
        $code = $this->discountCode();
        if (!$code) return 0.0;
        return $code->discountAmount($this->subtotal());
    }

    public function shipping(): float
    {
        $subtotal = $this->subtotal();
        if ($subtotal === 0.0) return 0.0;
        if ($subtotal >= 80) return 0.0;
        return 5.90;
    }

    public function total(): float
    {
        return max(0, $this->subtotal() - $this->discountAmount() + $this->shipping());
    }

    public function summary(): array
    {
        $code    = $this->discountCode();
        $discount = $this->discountAmount();

        return [
            'items'         => $this->items(),
            'count'         => $this->count(),
            'subtotal'      => round($this->subtotal(), 2),
            'shipping'      => round($this->shipping(), 2),
            'discount'      => round($discount, 2),
            'discount_code' => $code ? [
                'code'  => $code->code,
                'type'  => $code->type,
                'value' => $code->value,
            ] : null,
            'total'         => round($this->total(), 2),
        ];
    }
}
