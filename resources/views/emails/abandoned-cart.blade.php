@php $fr = ($mailLocale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Vous avez oublié quelque chose' : 'You left something behind' }}</title>
    <style>
        body { font-family: 'Georgia', serif; background: #F5F2EE; margin: 0; padding: 0; color: #1A1A1A; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #FFFFFF; }
        .header { background: #1A1A1A; padding: 32px 40px; text-align: center; }
        .header span { color: #C8A96E; font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; }
        .content { padding: 40px; }
        h1 { font-size: 22px; font-weight: normal; margin: 0 0 16px; color: #1A1A1A; }
        p { font-size: 15px; line-height: 1.7; color: #4A4540; margin: 0 0 16px; font-weight: 300; }
        .items { border: 1px solid #E8E2D9; margin: 24px 0; }
        .item { display: flex; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #F0EBE1; font-size: 14px; }
        .item:last-child { border-bottom: none; }
        .item-name { color: #1A1A1A; }
        .item-meta { color: #9A9490; font-weight: 300; }
        .item-price { color: #C8A96E; font-weight: 600; }
        .cta-wrap { text-align: center; margin: 32px 0; }
        .cta { display: inline-block; background: #1A1A1A; color: #FFFFFF !important; text-decoration: none; padding: 14px 36px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; }
        .footer { background: #F0EBE1; padding: 24px 40px; text-align: center; font-size: 12px; color: #9A9490; line-height: 1.6; font-weight: 300; }
        .divider { border: none; border-top: 1px solid #E8E2D9; margin: 24px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <span>SoukJannah</span>
    </div>

    <div class="content">
        <h1>{{ $fr ? 'Bonjour ' . $customer->first_name . ',' : 'Hello ' . $customer->first_name . ',' }}</h1>

        <p>
            {{ $fr
                ? 'Vous avez laissé des articles dans votre panier. Ils vous attendent toujours !'
                : 'You left some items in your cart. They\'re still waiting for you!'
            }}
        </p>

        <div class="items">
            @foreach ($cartItems as $item)
            <div class="item">
                <div>
                    <div class="item-name">{{ $item['name'] }}</div>
                    <div class="item-meta">{{ $fr ? 'Qté' : 'Qty' }} : {{ $item['quantity'] }}</div>
                </div>
                <div class="item-price">{{ number_format($item['price'] * $item['quantity'], 2) }} CHF</div>
            </div>
            @endforeach
        </div>

        <p style="font-size: 13px; color: #9A9490;">
            {{ $fr
                ? '⚡ Les stocks sont limités — ne tardez pas trop.'
                : '⚡ Stock is limited — don\'t wait too long.'
            }}
        </p>

        <div class="cta-wrap">
            <a href="{{ $cartUrl }}" class="cta">
                {{ $fr ? 'Reprendre mon panier' : 'Return to my cart' }}
            </a>
        </div>

        <hr class="divider">

        <p style="font-size: 13px; color: #9A9490; text-align: center; margin: 0;">
            {{ $fr
                ? 'Une question ? Contactez-nous à'
                : 'Any question? Contact us at'
            }}
            <a href="mailto:{{ config('mail.from.address') }}" style="color: #C8A96E;">{{ config('mail.from.address') }}</a>
        </p>
    </div>

    <div class="footer">
        <strong style="color: #1A1A1A;">SoukJannah</strong><br>
        {{ $fr ? 'Vous recevez cet email car vous avez un panier non finalisé.' : 'You\'re receiving this email because you have an unfinished cart.' }}<br>
        © {{ date('Y') }} SoukJannah. {{ $fr ? 'Tous droits réservés.' : 'All rights reserved.' }}
    </div>
</div>
</body>
</html>
