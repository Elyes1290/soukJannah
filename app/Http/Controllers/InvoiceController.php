<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    // Téléchargement admin — toutes les commandes
    public function adminDownload(Order $order)
    {
        $order->load(['items', 'customer']);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("facture-{$order->number}.pdf");
    }

    // Téléchargement client — uniquement ses propres commandes
    public function customerDownload(Request $request, Order $order)
    {
        $customerId = session('customer_id');

        if ($order->customer_id !== $customerId) {
            abort(403);
        }

        // Seules les commandes payées peuvent être téléchargées
        if (!in_array($order->status, ['paid', 'preparing', 'shipped', 'delivered', 'refunded'])) {
            abort(403);
        }

        $order->load(['items', 'customer']);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("facture-{$order->number}.pdf");
    }
}
