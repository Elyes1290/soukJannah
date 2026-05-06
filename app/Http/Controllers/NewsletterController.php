<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcomeMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $existing = NewsletterSubscriber::where('email', $request->email)->first();

        if ($existing) {
            if (!$existing->is_active) {
                // Réactivation : on envoie à nouveau le mail de bienvenue
                $existing->update(['is_active' => true]);
                $this->sendWelcome($existing);
            }
            // Déjà inscrit et actif — on répond ok sans révéler l'existence
            return back()->with('newsletter_success', true);
        }

        $subscriber = NewsletterSubscriber::create([
            'email'  => $request->email,
            'locale' => $request->input('locale', 'fr'),
            'token'  => Str::random(40),
        ]);

        $this->sendWelcome($subscriber);

        return back()->with('newsletter_success', true);
    }

    // Désabonnement via lien email (token dans l'URL)
    public function unsubscribeByToken(string $token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->first();

        if ($subscriber) {
            $subscriber->update(['is_active' => false]);
        }

        return redirect('/')->with('newsletter_unsubscribed', true);
    }

    private function sendWelcome(NewsletterSubscriber $subscriber): void
    {
        try {
            Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
        } catch (\Throwable $e) {
            // Ne pas bloquer l'inscription si l'email échoue
            \Log::warning('Newsletter welcome email failed: ' . $e->getMessage());
        }
    }
}
