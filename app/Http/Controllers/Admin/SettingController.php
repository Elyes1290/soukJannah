<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $keys = [
            'shop_name', 'shop_email',
            'meta_pixel_id', 'tiktok_pixel_id', 'ga4_id',
        ];

        $settings = collect($keys)
            ->mapWithKeys(fn($key) => [$key => Setting::get($key, '')])
            ->toArray();

        return Inertia::render('Admin/Settings', compact('settings'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'shop_name'       => 'nullable|string|max:100',
            'shop_email'      => 'nullable|email|max:100',
            'meta_pixel_id'   => 'nullable|string|max:50',
            'tiktok_pixel_id' => 'nullable|string|max:50',
            'ga4_id'          => 'nullable|string|max:50',
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value ?? '');
        }

        return back()->with('success', 'Paramètres enregistrés.');
    }
}
