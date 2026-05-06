<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public NewsletterSubscriber $subscriber
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->subscriber->locale === 'fr'
            ? 'Bienvenue chez SoukJannah !'
            : 'Welcome to SoukJannah!';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-welcome',
            with: [
                'subscriber' => $this->subscriber,
                'fr'         => $this->subscriber->locale === 'fr',
                'unsubUrl'   => url('/newsletter/unsubscribe/' . $this->subscriber->token),
                'shopUrl'    => url('/boutique'),
            ]
        );
    }
}
