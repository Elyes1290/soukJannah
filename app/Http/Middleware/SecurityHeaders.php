<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Empêche le clickjacking (iframe d'un autre domaine)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Empêche le sniffing de type MIME
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Contrôle les informations de référence envoyées lors des clics
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Force HTTPS pendant 1 an (seulement en production)
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Désactive les fonctionnalités inutiles (caméra, micro, géoloc sauf si activé)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")');

        // Content-Security-Policy : autorise les ressources tierces nécessaires
        // (Stripe, Google, Meta Pixel, TikTok Pixel, etc.)
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://analytics.tiktok.com https://accounts.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: blob: https: http:",
            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.googletagmanager.com",
            "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://analytics.tiktok.com",
            "object-src 'none'",
            "base-uri 'self'",
        ]);
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
