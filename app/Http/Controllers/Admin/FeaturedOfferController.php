<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeaturedOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FeaturedOfferController extends Controller
{
    public function index()
    {
        $offers = FeaturedOffer::orderBy('sort_order')->orderBy('id')->get()
            ->map(fn($o) => array_merge($o->toArray(), [
                'image_url' => $o->image_url,
            ]));

        return Inertia::render('Admin/FeaturedOffers/Index', [
            'offers' => $offers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'items'          => 'nullable|string',
            'price'          => 'nullable|string|max:50',
            'original_price' => 'nullable|string|max:50',
            'url'            => 'nullable|string|max:255',
            'sort_order'     => 'nullable|integer',
            'is_active'      => 'boolean',
            'image'          => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('featured-offers', 'public');
        } else {
            unset($data['image']);
        }

        FeaturedOffer::create($data);

        return redirect()->route('admin.featured-offers.index')
            ->with('success', 'Offre phare créée avec succès.');
    }

    public function update(Request $request, FeaturedOffer $featuredOffer)
    {
        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'items'          => 'nullable|string',
            'price'          => 'nullable|string|max:50',
            'original_price' => 'nullable|string|max:50',
            'url'            => 'nullable|string|max:255',
            'sort_order'     => 'nullable|integer',
            'is_active'      => 'boolean',
            'image'          => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            if ($featuredOffer->image) {
                Storage::disk('public')->delete($featuredOffer->image);
            }
            $data['image'] = $request->file('image')->store('featured-offers', 'public');
        } else {
            unset($data['image']);
        }

        $featuredOffer->update($data);

        return redirect()->route('admin.featured-offers.index')
            ->with('success', 'Offre phare mise à jour.');
    }

    public function destroy(FeaturedOffer $featuredOffer)
    {
        if ($featuredOffer->image) {
            Storage::disk('public')->delete($featuredOffer->image);
        }
        $featuredOffer->delete();

        return redirect()->route('admin.featured-offers.index')
            ->with('success', 'Offre phare supprimée.');
    }
}
