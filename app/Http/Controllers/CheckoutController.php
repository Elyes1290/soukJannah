<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class CheckoutController extends Controller
{
    public function __construct(private CartService $cart) {}

    public function index()
    {
        if ($this->cart->count() === 0) {
            return redirect()->route('cart');
        }

        return Inertia::render('Checkout/Index', [
            'cart' => $this->cart->summary(),
        ]);
    }

    public function store(Request $request)
    {
        if ($this->cart->count() === 0) {
            return redirect()->route('cart');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $cartSummary = $this->cart->summary();
        $lineItems   = [];

        foreach ($cartSummary['items'] as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency'     => 'chf',
                    'unit_amount'  => (int) round($item['price'] * 100),
                    'product_data' => [
                        'name'   => $item['name'],
                        'images' => $item['image'] ? [$item['image']] : [],
                    ],
                ],
                'quantity' => $item['quantity'],
            ];
        }

        if ($cartSummary['shipping'] > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency'     => 'chf',
                    'unit_amount'  => (int) round($cartSummary['shipping'] * 100),
                    'product_data' => ['name' => 'Frais de livraison'],
                ],
                'quantity' => 1,
            ];
        }

        // Réduction code promo — ligne négative dans Stripe
        if ($cartSummary['discount'] > 0 && $cartSummary['discount_code']) {
            $discountLabel = $cartSummary['discount_code']['type'] === 'percent'
                ? "Code {$cartSummary['discount_code']['code']} (-{$cartSummary['discount_code']['value']}%)"
                : "Code {$cartSummary['discount_code']['code']}";

            $lineItems[] = [
                'price_data' => [
                    'currency'     => 'chf',
                    'unit_amount'  => -(int) round($cartSummary['discount'] * 100),
                    'product_data' => ['name' => $discountLabel],
                ],
                'quantity' => 1,
            ];
        }

        $orderNote   = $request->input('order_note') ? substr($request->input('order_note'), 0, 300) : null;
        $giftMessage = $request->input('gift_message') ? substr($request->input('gift_message'), 0, 300) : null;

        $metadata = [
            'locale' => in_array($request->input('locale'), ['en', 'fr']) ? $request->input('locale') : 'en',
            'cart'   => json_encode([
                'items' => array_map(fn($item) => [
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ], $cartSummary['items']),
                'subtotal'      => $cartSummary['subtotal'],
                'shipping'      => $cartSummary['shipping'],
                'discount'      => $cartSummary['discount'],
                'discount_code' => $cartSummary['discount_code']['code'] ?? null,
                'total'         => $cartSummary['total'],
            ]),
        ];

        if ($orderNote)   $metadata['order_note']   = $orderNote;
        if ($giftMessage) $metadata['gift_message'] = $giftMessage;

        $session = Session::create([
            'payment_method_types' => ['card', 'klarna', 'twint'],
            'line_items'           => $lineItems,
            'mode'                 => 'payment',
            'success_url'          => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'           => route('checkout.cancel'),
            'metadata'             => $metadata,
        ]);

        return Inertia::location($session->url);
    }

    public function success(Request $request)
    {
        $this->cart->clear();

        return Inertia::render('Checkout/Success');
    }

    public function cancel()
    {
        return Inertia::render('Checkout/Cancel');
    }
}
