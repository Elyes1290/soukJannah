<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountCodeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DiscountCodes/Index', [
            'codes' => DiscountCode::orderByDesc('created_at')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'       => 'required|string|max:50|unique:discount_codes,code',
            'type'       => 'required|in:percent,fixed',
            'value'      => 'required|numeric|min:0.01|max:100',
            'min_amount' => 'nullable|numeric|min:0',
            'max_uses'   => 'nullable|integer|min:1',
            'is_active'  => 'boolean',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $data['code'] = strtoupper($data['code']);
        $data['min_amount'] = $data['min_amount'] ?? 0;

        DiscountCode::create($data);

        return back()->with('success', 'Code promo créé.');
    }

    public function update(Request $request, DiscountCode $discountCode)
    {
        $data = $request->validate([
            'code'       => 'required|string|max:50|unique:discount_codes,code,' . $discountCode->id,
            'type'       => 'required|in:percent,fixed',
            'value'      => 'required|numeric|min:0.01|max:100',
            'min_amount' => 'nullable|numeric|min:0',
            'max_uses'   => 'nullable|integer|min:1',
            'is_active'  => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $data['code'] = strtoupper($data['code']);
        $data['min_amount'] = $data['min_amount'] ?? 0;

        $discountCode->update($data);

        return back()->with('success', 'Code promo mis à jour.');
    }

    public function destroy(DiscountCode $discountCode)
    {
        $discountCode->delete();
        return back()->with('success', 'Code promo supprimé.');
    }
}
