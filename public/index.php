<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Détecte si on est sur Infomaniak (dossier laravel/ au même niveau)
// ou en local (vendor/ un niveau au-dessus comme d'habitude)
if (file_exists(__DIR__ . '/laravel/vendor/autoload.php')) {
    // Production Infomaniak
    $base = __DIR__ . '/laravel';
} else {
    // Développement local
    $base = __DIR__ . '/..';
}

if (file_exists($maintenance = $base . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $base . '/vendor/autoload.php';

/** @var Application $app */
$app = require_once $base . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
