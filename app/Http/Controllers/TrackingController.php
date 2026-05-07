<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Tracking/Index', [
            'order' => null,
            'error' => null,
            'trackingError' => null,
            'prefillNumber' => $request->query('number', ''),
        ]);
    }

    public function track(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'email' => 'required|email',
        ]);

        $number = strtoupper(trim($request->number));
        $email = strtolower(trim($request->email));

        $order = Order::with(['items', 'customer'])
            ->where('number', $number)
            ->first();

        if (! $order) {
            return Inertia::render('Tracking/Index', [
                'order' => null,
                'error' => null,
                'trackingError' => 'unknown_order',
                'prefillNumber' => $number,
            ]);
        }

        if (strtolower($order->customer->email ?? '') !== $email) {
            return Inertia::render('Tracking/Index', [
                'order' => null,
                'error' => null,
                'trackingError' => 'email_mismatch',
                'prefillNumber' => $number,
            ]);
        }

        $statusLabels = [
            'pending' => ['label' => 'En attente',    'step' => 1],
            'paid' => ['label' => 'Payée',          'step' => 2],
            'preparing' => ['label' => 'En préparation', 'step' => 3],
            'shipped' => ['label' => 'Expédiée',       'step' => 4],
            'delivered' => ['label' => 'Livrée',         'step' => 5],
            'cancelled' => ['label' => 'Annulée',        'step' => 0],
            'refunded' => ['label' => 'Remboursée',     'step' => 0],
        ];

        return Inertia::render('Tracking/Index', [
            'order' => [
                'number' => $order->number,
                'status' => $order->status,
                'status_label' => $statusLabels[$order->status]['label'] ?? $order->status,
                'status_step' => $statusLabels[$order->status]['step'] ?? 0,
                'tracking_number' => $order->tracking_number,
                'total' => $order->total,
                'created_at' => $order->created_at->format('d/m/Y'),
                'items' => $order->items->map(fn ($i) => [
                    'name' => $i->product_name,
                    'qty' => $i->qty,
                    'price' => $i->price,
                ]),
            ],
            'error' => null,
            'trackingError' => null,
        ]);
    }
}
