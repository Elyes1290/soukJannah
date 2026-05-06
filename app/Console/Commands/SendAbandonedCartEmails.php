<?php

namespace App\Console\Commands;

use App\Mail\AbandonedCartMail;
use App\Models\Customer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAbandonedCartEmails extends Command
{
    protected $signature   = 'shop:abandoned-carts';
    protected $description = 'Envoie un email de récupération aux clients ayant un panier abandonné depuis 2h';

    public function handle(): void
    {
        // Clients avec un panier non vide, mis à jour il y a plus de 2h,
        // et dont l'email de rappel n'a pas encore été envoyé aujourd'hui
        $customers = Customer::whereNotNull('cart_snapshot')
            ->whereNotNull('cart_updated_at')
            ->where('cart_updated_at', '<=', now()->subHours(2))
            ->where(function ($q) {
                $q->whereNull('abandoned_cart_sent_at')
                  ->orWhere('abandoned_cart_sent_at', '<=', now()->subHours(24));
            })
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        $sent = 0;

        foreach ($customers as $customer) {
            try {
                $cartItems = collect($customer->cart_snapshot)->map(fn($item) => [
                    'name'     => $item['name']     ?? 'Produit',
                    'quantity' => $item['quantity']  ?? 1,
                    'price'    => $item['price']     ?? 0,
                ])->toArray();

                if (empty($cartItems)) {
                    $customer->update(['cart_snapshot' => null, 'cart_updated_at' => null]);
                    continue;
                }

                // Détermine la locale — on utilise celle du dernier ordre ou 'en' par défaut
                $locale = $customer->orders()->latest()->value('locale') ?? 'en';

                $cartUrl = config('app.url') . '/panier';

                Mail::to($customer->email)->send(
                    new AbandonedCartMail($customer, $cartItems, $cartUrl, $locale)
                );

                $customer->update(['abandoned_cart_sent_at' => now()]);
                $sent++;

                $this->line("Email envoyé à {$customer->email}");

            } catch (\Exception $e) {
                Log::error("Abandoned cart email failed for customer #{$customer->id}: " . $e->getMessage());
                $this->error("Erreur pour {$customer->email}: " . $e->getMessage());
            }
        }

        $this->info("✓ {$sent} email(s) de panier abandonné envoyé(s).");
    }
}
