<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderCancelledMail;
use App\Mail\OrderDeliveredMail;
use App\Mail\OrderRefundedMail;
use App\Mail\OrderShippedMail;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Stripe;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('customer')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($o) => [
                'id'          => $o->id,
                'number'      => $o->number,
                'status'      => $o->status,
                'total'       => $o->total,
                'customer'    => $o->customer ? $o->customer->full_name : 'Client inconnu',
                'email'       => $o->customer?->email,
                'created_at'  => $o->created_at->format('d/m/Y H:i'),
                'disputed_at' => $o->disputed_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Orders/Index', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load('customer', 'items.product');

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id'               => $order->id,
                'number'           => $order->number,
                'status'           => $order->status,
                'subtotal'         => $order->subtotal,
                'shipping'         => $order->shipping,
                'total'            => $order->total,
                'refunded_amount'  => $order->refunded_amount,
                'refund_reason'    => $order->refund_reason,
                'disputed_at'      => $order->disputed_at?->format('d/m/Y H:i'),
                'tracking_number'  => $order->tracking_number,
                'notes'            => $order->notes,
                'stripe_payment_intent' => $order->stripe_payment_intent,
                'created_at'       => $order->created_at->format('d/m/Y H:i'),
                'customer'         => $order->customer,
                'items'            => $order->items->map(fn($i) => [
                    'id'           => $i->id,
                    'product_name' => $i->product_name,
                    'price'        => $i->price,
                    'quantity'     => $i->quantity,
                    'total'        => $i->total,
                ]),
            ],
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,preparing,shipped,delivered,cancelled,refunded,disputed',
        ]);

        $order->update(['status' => $request->status]);

        if ($order->customer?->email) {
            if ($request->status === 'shipped') {
                $order->load('items');
                Mail::to($order->customer->email)->send(new OrderShippedMail($order));
            } elseif ($request->status === 'delivered') {
                $order->load('items.product');
                Mail::to($order->customer->email)->send(new OrderDeliveredMail($order));
            }
        }

        return back()->with('success', 'Statut mis à jour.');
    }

    public function updateTracking(Request $request, Order $order)
    {
        $request->validate([
            'tracking_number' => 'required|string|max:100',
        ]);

        $order->update(['tracking_number' => $request->tracking_number]);

        return back()->with('success', 'Numéro de suivi enregistré.');
    }

    public function ship(Request $request, Order $order)
    {
        $request->validate([
            'tracking_number' => 'nullable|string|max:100',
        ]);

        $order->update([
            'status'          => 'shipped',
            'tracking_number' => $request->tracking_number ?? $order->tracking_number,
        ]);

        if ($order->customer?->email) {
            Mail::to($order->customer->email)->send(new OrderShippedMail($order));
        }

        return back()->with('success', 'Commande marquée expédiée — email envoyé au client.');
    }

    public function refund(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'nullable|numeric|min:0.01|max:' . $order->total,
            'reason' => 'nullable|string|max:255',
        ]);

        if (!$order->stripe_payment_intent) {
            return back()->with('error', 'Aucun paiement Stripe associé à cette commande.');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $amountToRefund = $request->amount
            ? (int) round($request->amount * 100)
            : null; // null = remboursement total

        try {
            $refundParams = ['payment_intent' => $order->stripe_payment_intent];
            if ($amountToRefund) {
                $refundParams['amount'] = $amountToRefund;
            }
            \Stripe\Refund::create($refundParams);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return back()->with('error', 'Erreur Stripe : ' . $e->getMessage());
        }

        $refundedAmount = $request->amount ?? $order->total;

        $order->update([
            'status'          => 'refunded',
            'refunded_amount' => $refundedAmount,
            'refund_reason'   => $request->reason,
        ]);

        // Remettre le stock en place
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        if ($order->customer?->email) {
            $order->load('items', 'customer');
            Mail::to($order->customer->email)->send(new OrderRefundedMail($order));
        }

        return back()->with('success', 'Remboursement de ' . number_format($refundedAmount, 2) . ' CHF effectué — email envoyé au client.');
    }

    public function cancel(Request $request, Order $order)
    {
        $refundIssued = false;

        // Si la commande est payée, déclencher un remboursement Stripe automatique
        if (in_array($order->status, ['paid', 'preparing']) && $order->stripe_payment_intent) {
            Stripe::setApiKey(config('services.stripe.secret'));

            try {
                \Stripe\Refund::create(['payment_intent' => $order->stripe_payment_intent]);
                $refundIssued = true;
            } catch (\Stripe\Exception\ApiErrorException $e) {
                return back()->with('error', 'Impossible d\'annuler via Stripe : ' . $e->getMessage());
            }

            $order->update([
                'refunded_amount' => $order->total,
                'refund_reason'   => 'Cancelled by admin',
            ]);
        }

        $order->update(['status' => 'cancelled']);

        // Remettre le stock en place
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->increment('stock', $item->quantity);
            }
        }

        if ($order->customer?->email) {
            $order->load('items', 'customer');
            Mail::to($order->customer->email)->send(new OrderCancelledMail($order));
        }

        $msg = $refundIssued
            ? 'Commande annulée et remboursement total déclenché sur Stripe — email envoyé au client.'
            : 'Commande annulée — email envoyé au client.';

        return back()->with('success', $msg);
    }
}
