<?php

namespace App\Mail;

use App\Models\Customer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $mailLocale;

    public function __construct(
        public Customer $customer,
        string $locale = 'en'
    ) {
        $this->mailLocale = $locale === 'fr' ? 'fr' : 'en';
    }

    public function envelope(): Envelope
    {
        $subject = $this->mailLocale === 'fr'
            ? 'Bienvenue sur SoukJannah'
            : 'Welcome to SoukJannah';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.customer-welcome');
    }
}
