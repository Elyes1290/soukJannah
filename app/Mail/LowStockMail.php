<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowStockMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $lowStockProducts,
        public string $orderNumber
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ Stock faible — ' . count($this->lowStockProducts) . ' produit(s) à réapprovisionner',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock',
        );
    }
}
