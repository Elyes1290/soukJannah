<?php

namespace App\Mail;

use App\Models\Customer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $mailLocale;

    public function __construct(
        public Customer $customer,
        public string $verificationUrl,
        string $locale = 'en'
    ) {
        $this->mailLocale = $locale;
    }

    public function envelope(): Envelope
    {
        $subject = $this->locale === 'fr'
            ? 'Confirmez votre adresse email'
            : 'Please verify your email address';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.customer-verification');
    }
}
