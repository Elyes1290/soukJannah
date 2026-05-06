<?php

namespace App\Http\Controllers;

use App\Models\DiscountCode;
use App\Services\CartService;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function apply(Request $request, CartService $cart)
    {
        $request->validate(['code' => 'required|string|max:50']);

        $code = DiscountCode::where('code', strtoupper(trim($request->code)))->first();

        if (!$code) {
            return back()->with('discount_error', 'Code promo invalide.');
        }

        if (!$code->isValid($cart->subtotal())) {
            if ($code->min_amount > 0 && $cart->subtotal() < $code->min_amount) {
                return back()->with('discount_error', "Ce code est valable dès {$code->min_amount} CHF d'achat.");
            }
            return back()->with('discount_error', 'Ce code promo n\'est plus valide.');
        }

        // Stocker le code en session
        session(['discount_code' => $code->code]);

        return back()->with('discount_success', "Code « {$code->code} » appliqué avec succès !");
    }

    public function remove()
    {
        session()->forget('discount_code');
        return back()->with('discount_success', 'Code promo retiré.');
    }
}
