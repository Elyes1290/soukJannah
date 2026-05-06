<?php

namespace App\Mail;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReturnRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ReturnRequest $returnRequest) {}

    public function envelope(): Envelope
    {
        $order = $this->returnRequest->order;
        return new Envelope(subject: '[SoukJannah] Nouvelle demande de retour — ' . $order->number);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.return-request');
    }
}
