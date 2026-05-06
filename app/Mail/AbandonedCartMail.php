<?php

namespace App\Mail;

use App\Models\Customer;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AbandonedCartMail extends Mailable
{
    public string $mailLocale;

    public function __construct(
        public Customer $customer,
        public array $cartItems,
        public string $cartUrl,
        string $locale = 'en'
    ) {
        $this->mailLocale = $locale;
    }

    public function envelope(): Envelope
    {
        $subject = $this->mailLocale === 'fr'
            ? 'Vous avez oublié quelque chose 🛍'
            : 'You left something behind 🛍';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.abandoned-cart');
    }
}
