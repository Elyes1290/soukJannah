<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class TwoFactorMail extends Mailable
{
    public function __construct(
        public string $code,
        public string $name
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Code de connexion — ' . config('app.name'));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.two-factor');
    }
}
