<?php

namespace App\Http\Controllers;

use App\Mail\StockAlertMail;
use App\Models\Product;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class StockAlertController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'email'      => 'required|email|max:255',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Si le produit est déjà en stock, pas besoin de s'inscrire
        if ($product->stock > 0) {
            return response()->json(['message' => 'in_stock'], 200);
        }

        $existing = StockAlert::where('product_id', $request->product_id)
            ->where('email', $request->email)
            ->first();

        if ($existing) {
            // Réinitialiser si déjà notifié dans le passé
            if ($existing->notified_at) {
                $existing->update(['notified_at' => null]);
            }
            return response()->json(['subscribed' => true]);
        }

        StockAlert::create([
            'product_id'  => $request->product_id,
            'email'       => $request->email,
            'customer_id' => session('customer_id'),
            'locale'      => $request->input('locale', 'fr'),
        ]);

        return response()->json(['subscribed' => true]);
    }

    // Appelé depuis l'admin quand le stock est réapprovisionné
    public static function notifyForProduct(Product $product): void
    {
        $alerts = StockAlert::where('product_id', $product->id)
            ->whereNull('notified_at')
            ->get();

        foreach ($alerts as $alert) {
            try {
                Mail::to($alert->email)->send(new StockAlertMail($product, $alert));
                $alert->update(['notified_at' => now()]);
            } catch (\Throwable $e) {
                \Log::warning("StockAlert email failed for {$alert->email}: " . $e->getMessage());
            }
        }
    }
}
