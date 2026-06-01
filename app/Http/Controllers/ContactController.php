<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'required|string|max:100',
            'message' => 'required|string|max:2000',
            'locale' => 'nullable|string|in:en,fr',
        ]);

        $locale = (($data['locale'] ?? '') === 'en') ? 'en' : 'fr';

        $subjectLabelsEn = [
            'commande' => 'My order',
            'produit' => 'Question about a product',
            'livraison' => 'Delivery & returns',
            'partenariat' => 'Partnership / Collaboration',
            'autre' => 'Other',
        ];

        $subjectLabelsFr = [
            'commande' => 'Ma commande',
            'produit' => 'Question sur un produit',
            'livraison' => 'Livraison & retours',
            'partenariat' => 'Partenariat / Collaboration',
            'autre' => 'Autre',
        ];

        $labelsMap = $locale === 'en' ? $subjectLabelsEn : $subjectLabelsFr;

        $subjectLabel = $labelsMap[$data['subject']] ?? $data['subject'];

        Mail::send([], [], function ($mail) use ($data, $subjectLabel) {
            $mail->to(config('mail.admin_address', env('ADMIN_EMAIL')))
                ->replyTo($data['email'], $data['name'])
                ->subject("[Contact] {$subjectLabel} — {$data['name']}")
                ->html(
                    view('emails.contact', [
                        'name' => $data['name'],
                        'email' => $data['email'],
                        'subject' => $subjectLabel,
                        'body' => $data['message'],
                    ])->render()
                );
        });

        return back()->with('contact_success', true);
    }
}
