<?php

return [
    /*
     * Email affiché au public (page Contact, mentions légales via Inertia).
     * Peut différer de MAIL_FROM_ADDRESS (expéditeur transactional).
     */
    'support_contact_email' => env('SUPPORT_CONTACT_EMAIL', 'support@soukjannah.com'),

    /*
     * Seuil en dessous duquel une alerte email est envoyée à l'admin
     * après chaque commande. Modifiable via la variable d'environnement.
     */
    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 5),

    /*
     * Mode « ouverture prochaine » : page boutique rassurante sans grille vide.
     * true = forcé ; false = auto si aucun produit actif en base.
     */
    'catalog_coming_soon' => env('SHOP_CATALOG_COMING_SOON', false),
];
