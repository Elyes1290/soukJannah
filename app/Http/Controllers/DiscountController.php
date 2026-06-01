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

        if (! $code) {
            return back()->with('discount_error', [
                'key' => 'discount_err_invalid',
            ]);
        }

        if (! $code->isValid($cart->subtotal())) {
            if ($code->min_amount > 0 && $cart->subtotal() < $code->min_amount) {
                return back()->with('discount_error', [
                    'key' => 'discount_err_min_amount',
                    'vars' => ['amount' => number_format((float) $code->min_amount, 2, '.', '\'')],
                ]);
            }

            return back()->with('discount_error', [
                'key' => 'discount_err_not_valid',
            ]);
        }

        // Stocker le code en session
        session(['discount_code' => $code->code]);

        return back()->with('discount_success', [
            'key' => 'discount_success_applied',
            'vars' => ['code' => $code->code],
        ]);
    }

    public function remove()
    {
        session()->forget('discount_code');

        return back()->with('discount_success', [
            'key' => 'discount_success_removed',
        ]);
    }
}
