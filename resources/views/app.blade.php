<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Open Graph par défaut (écrasé par Inertia Head par page) --}}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="{{ config('app.name', 'SoukJannah') }}" />
        <meta property="og:title" content="{{ config('app.name', 'SoukJannah') }} — Premium Muslim essentials" />
        <meta property="og:description" content="A carefully curated selection of modern Islamic accessories. Premium prayer rugs, halal gift sets and more. Delivery in Switzerland, France and Europe." />
        <meta property="og:url" content="{{ url()->current() }}" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content="{{ asset('images/og-default.jpg') }}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ config('app.name', 'SoukJannah') }} — Premium Muslim essentials" />
        <meta name="twitter:description" content="A carefully curated selection of modern Islamic accessories. Premium prayer rugs, halal gift sets and more." />
        <meta name="twitter:image" content="{{ asset('images/og-default.jpg') }}" />

        {{-- Favicon --}}
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}" sizes="512x512" />
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="antialiased bg-white text-gray-900">
        @inertia
    </body>
</html>
