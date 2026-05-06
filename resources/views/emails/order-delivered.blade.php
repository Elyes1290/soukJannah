@php $fr = ($order->locale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Votre commande a été livrée' : 'Your order has been delivered' }}</title>
</head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1A1A1A;">

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #E8E2D9;">

                    {{-- En-tête --}}
                    <tr>
                        <td style="background:#1A1A1A;padding:20px 40px;text-align:center;">
                            <img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name', 'SoukJannah') }}" width="48" height="48" style="display:inline-block;margin-bottom:8px;" />
                            <p style="margin:0;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#C8A96E;font-weight:400;">
                                {{ config('app.name', 'SoukJannah') }}
                            </p>
                        </td>
                    </tr>

                    {{-- Icône + titre --}}
                    <tr>
                        <td style="padding:48px 40px 0;text-align:center;">
                            <div style="width:64px;height:64px;background:#F0EBE1;border-radius:50%;margin:0 auto 24px;line-height:64px;text-align:center;">
                                <span style="font-size:28px;">✅</span>
                            </div>
                            <h1 style="margin:0 0 12px;font-size:22px;font-weight:400;color:#1A1A1A;letter-spacing:-0.02em;">
                                {{ $fr ? 'Commande livrée !' : 'Order delivered!' }}
                            </h1>
                            <p style="margin:0;font-size:14px;color:#9A9490;font-weight:300;line-height:1.6;">
                                @if($fr)
                                    Bonjour {{ $order->customer->first_name }},<br>
                                    votre commande <strong style="color:#1A1A1A;font-weight:500;">{{ $order->number }}</strong> a bien été livrée. Nous espérons que tout vous a plu !
                                @else
                                    Hello {{ $order->customer->first_name }},<br>
                                    your order <strong style="color:#1A1A1A;font-weight:500;">{{ $order->number }}</strong> has been delivered. We hope you love everything!
                                @endif
                            </p>
                        </td>
                    </tr>

                    {{-- Récapitulatif articles --}}
                    <tr>
                        <td style="padding:32px 40px 0;">
                            <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9A9490;">
                                {{ $fr ? 'Récapitulatif' : 'Summary' }}
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E8E2D9;">
                                @foreach($order->items as $item)
                                <tr>
                                    <td style="padding:12px 0;font-size:13px;color:#1A1A1A;border-bottom:1px solid #F0EBE1;">
                                        {{ $item->product_name }}
                                    </td>
                                    <td style="padding:12px 0;font-size:13px;color:#9A9490;text-align:center;border-bottom:1px solid #F0EBE1;width:40px;">
                                        ×{{ $item->quantity }}
                                    </td>
                                    <td style="padding:12px 0;font-size:13px;color:#1A1A1A;text-align:right;border-bottom:1px solid #F0EBE1;white-space:nowrap;">
                                        {{ number_format($item->total, 2) }} CHF
                                    </td>
                                </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>

                    {{-- CTA Laisser un avis --}}
                    <tr>
                        <td style="padding:32px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;border:1px solid #E8E2D9;border-top:3px solid #C8A96E;">
                                <tr>
                                    <td style="padding:28px 32px;text-align:center;">
                                        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8A96E;font-weight:400;">
                                            {{ $fr ? 'Votre avis compte' : 'Your review matters' }}
                                        </p>
                                        <p style="margin:0 0 24px;font-size:15px;font-weight:400;color:#1A1A1A;line-height:1.5;">
                                            {{ $fr ? 'Partagez votre expérience sur chaque produit reçu.' : 'Share your experience on each product you received.' }}
                                        </p>

                                        {{-- Un bouton par produit --}}
                                        @foreach($order->items as $item)
                                            @if($item->product?->slug)
                                            <a href="{{ config('app.url') }}/boutique/{{ $item->product->slug }}"
                                               style="display:block;background:#1A1A1A;color:#FFFFFF;text-decoration:none;padding:13px 24px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;margin-bottom:10px;">
                                                {{ $fr ? 'Noter' : 'Review' }} — {{ $item->product_name }}
                                            </a>
                                            @endif
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Séparateur doré --}}
                    <tr>
                        <td style="padding:0 40px;">
                            <div style="height:1px;background:linear-gradient(to right,transparent,#C8A96E,transparent);"></div>
                        </td>
                    </tr>

                    {{-- Pied de page --}}
                    <tr>
                        <td style="padding:24px 40px;text-align:center;">
                            <p style="margin:0 0 6px;font-size:11px;color:#9A9490;font-weight:300;letter-spacing:0.05em;">
                                {{ $fr ? 'Merci pour votre confiance.' : 'Thank you for your trust.' }}
                            </p>
                            <p style="margin:0;font-size:11px;color:#C8A96E;letter-spacing:0.1em;text-transform:uppercase;">
                                {{ config('app.name', 'SoukJannah') }}
                            </p>
                        </td>
                    </tr>

                </table>

                <p style="margin:20px 0 0;font-size:11px;color:#C0B8B0;text-align:center;">
                    © {{ date('Y') }} {{ config('app.name', 'SoukJannah') }} — {{ $fr ? 'Tous droits réservés' : 'All rights reserved' }}
                </p>
            </td>
        </tr>
    </table>

</body>
</html>
