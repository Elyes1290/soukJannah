<?php

namespace App\Mail;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReturnDecisionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ReturnRequest $returnRequest) {}

    public function envelope(): Envelope
    {
        $order  = $this->returnRequest->order;
        $label  = $this->returnRequest->status === 'approved' ? 'approuvée' : 'refusée';
        return new Envelope(subject: '[SoukJannah] Votre demande de retour a été ' . $label . ' — ' . $order->number);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.return-decision');
    }
}
