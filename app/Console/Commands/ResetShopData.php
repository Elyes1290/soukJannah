<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetShopData extends Command
{
    protected $signature   = 'shop:reset {--force : Skip confirmation prompt}';
    protected $description = 'Réinitialise toutes les données boutique (produits, commandes, clients...) — conserve admin + paramètres.';

    public function handle(): int
    {
        if (!$this->option('force')) {
            $this->warn('⚠️  Cette commande supprime DÉFINITIVEMENT :');
            $this->line('   • Produits + images');
            $this->line('   • Catégories');
            $this->line('   • Commandes + articles');
            $this->line('   • Clients');
            $this->line('   • Avis clients');
            $this->line('   • Codes promo');
            $this->line('   • Offres phares');
            $this->line('   • Articles de blog');
            $this->line('   • Abonnés newsletter');
            $this->line('   • Demandes de retour');
            $this->line('   • Alertes stock');
            $this->line('   • Wishlists');
            $this->line('   • Logs de recherche');
            $this->newLine();
            $this->line('✅  Conservé : compte(s) admin + paramètres boutique.');
            $this->newLine();

            if (!$this->confirm('Confirmer la réinitialisation complète ?', false)) {
                $this->info('Annulé.');
                return 0;
            }
        }

        $this->info('Réinitialisation en cours...');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Commandes
        DB::table('return_requests')->truncate();
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();

        // Clients + dépendances
        DB::table('stock_alerts')->truncate();
        DB::table('wishlists')->truncate();
        DB::table('customer_addresses')->truncate();
        DB::table('customer_social_accounts')->truncate();
        DB::table('customers')->truncate();

        // Catalogue
        DB::table('reviews')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('product_images')->truncate();
        DB::table('products')->truncate();
        DB::table('categories')->truncate();

        // Marketing
        DB::table('discount_codes')->truncate();
        DB::table('featured_offers')->truncate();
        DB::table('newsletter_subscribers')->truncate();
        DB::table('search_logs')->truncate();

        // Blog
        DB::table('posts')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Supprimer les images produits uploadées
        $storagePath = storage_path('app/public');
        $dirs = ['products', 'categories', 'featured', 'blog'];
        foreach ($dirs as $dir) {
            $path = $storagePath . '/' . $dir;
            if (is_dir($path)) {
                $files = glob($path . '/*');
                foreach ($files as $file) {
                    if (is_file($file)) unlink($file);
                }
                $this->line("   🗑  Images /{$dir} supprimées.");
            }
        }

        $this->newLine();
        $this->info('✅  Réinitialisation terminée !');
        $this->line('   → Compte admin conservé.');
        $this->line('   → Paramètres boutique conservés.');
        $this->line('   → Le site est prêt pour les vraies données.');
        $this->newLine();

        return 0;
    }
}
