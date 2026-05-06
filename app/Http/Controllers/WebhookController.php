<?php

namespace App\Http\Controllers;

use App\Mail\LowStockMail;
use App\Mail\OrderCancelledMail;
use App\Mail\OrderConfirmationMail;
use App\Mail\OrderNotificationMail;
use App\Mail\OrderRefundedMail;
use App\Models\Customer;
use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        try {
            if ($secret) {
                $event = Webhook::constructEvent($payload, $sigHeader, $secret);
            } else {
                $event = \Stripe\Event::constructFrom(json_decode($payload, true));
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        match ($event->type) {
            'checkout.session.completed'            => $this->handleSuccessfulPayment($event->data->object),
            'checkout.session.async_payment_failed' => $this->handleAsyncPaymentFailed($event->data->object),
            'charge.refunded'                       => $this->handleChargeRefunded($event->data->object),
            'charge.dispute.created'                => $this->handleDisputeCreated($event->data->object),
            default                                 => null,
        };

        return response()->json(['status' => 'ok']);
    }

    private function handleSuccessfulPayment($session): void
    {
        if (Order::where('stripe_session_id', $session->id)->exists()) {
            return;
        }

        $cart        = json_decode($session->metadata->cart ?? '{}', true);
        $locale      = $session->metadata->locale ?? 'en';
        $orderNote   = $session->metadata->order_note ?? null;
        $giftMessage = $session->metadata->gift_message ?? null;

        // Compile les notes
        $noteParts = [];
        if ($orderNote)   $noteParts[] = $orderNote;
        if ($giftMessage) $noteParts[] = '🎁 ' . $giftMessage;
        $compiledNotes = $noteParts ? implode("\n---\n", $noteParts) : null;

        if (empty($cart['items'])) {
            return;
        }

        $customerData = $session->customer_details ?? null;
        $email        = $customerData?->email ?? '';

        // Tout le traitement dans une transaction avec verrou sur les produits
        // pour éviter les race conditions de stock
        $order = DB::transaction(function () use ($session, $cart, $locale, $customerData, $email) {

            // Verrouiller les lignes produits concernées (SELECT ... FOR UPDATE)
            $productIds = array_column($cart['items'], 'product_id');
            Product::whereIn('id', $productIds)->lockForUpdate()->get();

            // Si un compte client existe avec cet email, on le réutilise
            $customer = Customer::where('email', $email)->first();
            if (!$customer) {
                $customer = Customer::create([
                    'first_name'  => $customerData?->name ? explode(' ', $customerData->name)[0] : 'Client',
                    'last_name'   => $customerData?->name ? implode(' ', array_slice(explode(' ', $customerData->name), 1)) : '',
                    'email'       => $email,
                    'address'     => $customerData?->address?->line1 ?? '',
                    'address2'    => $customerData?->address?->line2 ?? '',
                    'city'        => $customerData?->address?->city ?? '',
                    'postal_code' => $customerData?->address?->postal_code ?? '',
                    'country'     => $customerData?->address?->country ?? 'CH',
                ]);
            }

            // Vider le snapshot de panier abandonné
            $customer->update([
                'cart_snapshot'          => null,
                'cart_updated_at'        => null,
                'abandoned_cart_sent_at' => null,
            ]);

            $order = Order::create([
                'customer_id'           => $customer->id,
                'number'                => Order::generateNumber(),
                'status'                => 'paid',
                'subtotal'              => $cart['subtotal'] ?? 0,
                'shipping'              => $cart['shipping'] ?? 0,
                'total'                 => $cart['total'] ?? 0,
                'stripe_session_id'     => $session->id,
                'stripe_payment_intent' => $session->payment_intent,
                'locale'                => $locale,
                'notes'                 => $compiledNotes,
            ]);

            if (!empty($cart['discount_code'])) {
                DiscountCode::where('code', $cart['discount_code'])->increment('used_count');
            }

            foreach ($cart['items'] as $item) {
                $product = Product::find($item['product_id']);
                $order->items()->create([
                    'product_id'   => $item['product_id'],
                    'product_name' => $product?->name ?? 'Produit #' . $item['product_id'],
                    'price'        => $item['price'],
                    'quantity'     => $item['quantity'],
                    'total'        => $item['price'] * $item['quantity'],
                ]);

                if ($product) {
                    // Décrémente sans passer en négatif
                    $newStock = max(0, $product->stock - $item['quantity']);
                    $product->update(['stock' => $newStock]);
                }
            }

            return $order;
        });

        $order->load('items', 'customer');

        $customer = $order->customer;
        if ($customer?->email) {
            Mail::to($customer->email)->send(new OrderConfirmationMail($order));
        }

        $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL'));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new OrderNotificationMail($order));

            // Alerte stock faible : vérifier les produits commandés
            $threshold = (int) config('shop.low_stock_threshold', 5);
            $lowStockProducts = [];
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product && $product->stock <= $threshold) {
                    $lowStockProducts[] = [
                        'name'      => $product->name,
                        'stock'     => $product->stock,
                        'threshold' => $threshold,
                    ];
                }
            }
            if (!empty($lowStockProducts)) {
                Mail::to($adminEmail)->send(new LowStockMail($lowStockProducts, $order->number));
            }
        }
    }

    private function handleAsyncPaymentFailed($session): void
    {
        Log::warning('Stripe async payment failed', [
            'session_id' => $session->id,
            'customer'   => $session->customer_details?->email ?? 'unknown',
        ]);

        $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL'));
        if ($adminEmail) {
            Mail::raw(
                "Échec de paiement async Stripe.\n\nSession ID : {$session->id}\nClient : " . ($session->customer_details?->email ?? 'inconnu'),
                fn($m) => $m->to($adminEmail)->subject('Paiement échoué — ' . config('app.name'))
            );
        }
    }

    private function handleChargeRefunded($charge): void
    {
        // Synchronise le statut si le remboursement a été fait depuis le dashboard Stripe
        $order = Order::where('stripe_payment_intent', $charge->payment_intent)->first();

        if (!$order || $order->status === 'refunded') {
            return;
        }

        $refundedAmount = $charge->amount_refunded / 100;

        $order->update([
            'status'          => 'refunded',
            'refunded_amount' => $refundedAmount,
            'refund_reason'   => 'Refunded via Stripe dashboard',
        ]);

        // Remettre le stock en place
        $order->load('items');
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        if ($order->customer?->email) {
            $order->load('customer');
            Mail::to($order->customer->email)->send(new OrderRefundedMail($order));
        }
    }

    private function handleDisputeCreated($dispute): void
    {
        $order = Order::where('stripe_payment_intent', $dispute->payment_intent)->first();

        if (!$order) {
            Log::warning('Dispute reçu pour un payment_intent inconnu', ['payment_intent' => $dispute->payment_intent]);
            return;
        }

        $order->update([
            'status'      => 'disputed',
            'disputed_at' => now(),
        ]);

        $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL'));
        if ($adminEmail) {
            Mail::raw(
                "Un litige (chargeback) a été ouvert par un client.\n\nCommande : {$order->number}\nMontant contesté : " . number_format($dispute->amount / 100, 2) . " CHF\nRaison : {$dispute->reason}\n\nConnectez-vous sur le dashboard Stripe pour y répondre.",
                fn($m) => $m->to($adminEmail)->subject('Litige Stripe — Commande ' . $order->number)
            );
        }
    }
}
