<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Inertia\Inertia;

class NewsletterAdminController extends Controller
{
    public function index()
    {
        $subscribers = NewsletterSubscriber::orderByDesc('subscribed_at')->get();

        return Inertia::render('Admin/Newsletter/Index', [
            'subscribers' => $subscribers,
            'total'       => $subscribers->count(),
            'active'      => $subscribers->where('is_active', true)->count(),
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();
        return back()->with('success', 'Abonné supprimé.');
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->orderByDesc('subscribed_at')
            ->get(['email', 'locale', 'subscribed_at']);

        $csv = "Email,Langue,Date d'inscription\n";
        foreach ($subscribers as $s) {
            $csv .= "{$s->email},{$s->locale},{$s->subscribed_at}\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }
}
