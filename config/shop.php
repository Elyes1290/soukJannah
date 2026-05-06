<?php

return [
    /*
     * Seuil en dessous duquel une alerte email est envoyée à l'admin
     * après chaque commande. Modifiable via la variable d'environnement.
     */
    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 5),
];
