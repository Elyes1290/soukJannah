<?php

namespace App\Mail;

use App\Models\Product;
use App\Models\StockAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StockAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Product    $product,
        public StockAlert $alert
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->alert->locale === 'fr'
            ? "🎉 {$this->product->name} est de retour en stock !"
            : "🎉 {$this->product->name} is back in stock!";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.stock-alert',
            with: [
                'product'    => $this->product,
                'alert'      => $this->alert,
                'fr'         => $this->alert->locale === 'fr',
                'productUrl' => url('/boutique/' . $this->product->slug),
            ]
        );
    }
}
