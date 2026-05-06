@php $fr = ($order->locale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Confirmation de commande' : 'Order confirmation' }}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F5F2EE; margin: 0; padding: 0; color: #1a1a1a; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border: 1px solid #E8E2D9; }
        .header { background: #1a1a1a; padding: 20px 40px; text-align: center; }
        .header p { margin: 0; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; color: #C8A96E; font-weight: 400; }
        .body { padding: 48px 40px 0; }
        .body h1 { font-size: 22px; font-weight: 400; margin: 0 0 12px; letter-spacing: -0.02em; text-align: center; }
        .body .intro { font-size: 14px; color: #9A9490; font-weight: 300; line-height: 1.6; margin: 0 0 32px; text-align: center; }
        .order-info { background: #F5F2EE; border: 1px solid #E8E2D9; border-left: 3px solid #C8A96E; padding: 20px 24px; margin-bottom: 32px; }
        .order-info p { margin: 4px 0; font-size: 14px; color: #333; }
        .order-info strong { color: #1a1a1a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { text-align: left; font-size: 11px; color: #9A9490; text-transform: uppercase; letter-spacing: 0.15em; padding: 8px 0; border-bottom: 1px solid #E8E2D9; }
        td { padding: 12px 0; font-size: 13px; border-bottom: 1px solid #F0EBE1; vertical-align: top; }
        .total-row td { font-weight: 600; border-bottom: none; padding-top: 16px; color: #C8A96E; font-size: 16px; }
        .message { font-size: 14px; color: #6B6560; font-weight: 300; line-height: 1.7; margin: 0 0 32px; }
        .separator { height: 1px; background: linear-gradient(to right, transparent, #C8A96E, transparent); margin: 0 40px; }
        .footer { padding: 24px 40px; text-align: center; }
        .footer p { font-size: 11px; color: #9A9490; margin: 0 0 6px; font-weight: 300; }
        .footer .brand { color: #C8A96E; letter-spacing: 0.1em; text-transform: uppercase; }
        .outer-footer { margin: 20px 0 0; font-size: 11px; color: #C0B8B0; text-align: center; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F2EE;">
        <tr>
            <td align="center" style="padding:40px 16px;">

                <div class="container">
                    <div class="header">
                        <img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name', 'SoukJannah') }}" width="48" height="48" style="display:inline-block;margin-bottom:8px;" />
                        <p>{{ config('app.name', 'SoukJannah') }}</p>
                    </div>

                    <div class="body">
                        <div style="text-align:center;margin-bottom:32px;">
                            <div style="width:64px;height:64px;background:#F0EBE1;border-radius:50%;margin:0 auto 24px;line-height:64px;text-align:center;">
                                <span style="font-size:28px;">✓</span>
                            </div>
                            <h1>{{ $fr ? 'Merci pour votre commande !' : 'Thank you for your order!' }}</h1>
                            <p class="intro">
                                {{ $fr ? 'Bonjour' : 'Hello' }} {{ $order->customer->first_name }},<br>
                                {{ $fr ? 'Nous avons bien reçu votre commande et la préparons avec soin.' : 'We have received your order and are preparing it with care.' }}
                            </p>
                        </div>

                        <div class="order-info">
                            <p><strong>{{ $fr ? 'Numéro de commande :' : 'Order number:' }}</strong> {{ $order->number }}</p>
                            <p><strong>{{ $fr ? 'Date :' : 'Date:' }}</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
                            <p><strong>{{ $fr ? 'Statut :' : 'Status:' }}</strong> {{ $fr ? 'Payé ✓' : 'Paid ✓' }}</p>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>{{ $fr ? 'Produit' : 'Product' }}</th>
                                    <th>{{ $fr ? 'Qté' : 'Qty' }}</th>
                                    <th style="text-align:right">{{ $fr ? 'Prix' : 'Price' }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($order->items as $item)
                                <tr>
                                    <td>{{ $item->product_name }}</td>
                                    <td>{{ $item->quantity }}</td>
                                    <td style="text-align:right">{{ number_format($item->total, 2) }} CHF</td>
                                </tr>
                                @endforeach
                                <tr>
                                    <td colspan="2" style="font-size:13px;color:#9A9490;font-weight:300;">
                                        {{ $fr ? 'Livraison' : 'Shipping' }}
                                    </td>
                                    <td style="text-align:right;font-size:13px;color:#9A9490;">
                                        {{ $order->shipping == 0 ? ($fr ? 'Gratuite ✓' : 'Free ✓') : number_format($order->shipping, 2) . ' CHF' }}
                                    </td>
                                </tr>
                                <tr class="total-row">
                                    <td colspan="2">Total</td>
                                    <td style="text-align:right">{{ number_format($order->total, 2) }} CHF</td>
                                </tr>
                            </tbody>
                        </table>

                        <p class="message">
                            {{ $fr
                                ? 'Vous recevrez un email dès que votre commande sera expédiée, avec votre numéro de suivi.'
                                : 'You will receive an email as soon as your order is shipped with your tracking number.' }}
                        </p>

                        <div style="text-align:center;margin-top:20px;">
                            <a href="{{ config('app.url') }}/suivi?number={{ $order->number }}"
                               style="display:inline-block;background-color:#1A1A1A;color:#ffffff;padding:12px 28px;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
                                {{ $fr ? 'Suivre ma commande' : 'Track my order' }}
                            </a>
                        </div>
                    </div>

                    <div class="separator"></div>

                    <div class="footer">
                        <p>{{ $fr ? 'Merci pour votre confiance.' : 'Thank you for your trust.' }}</p>
                        <p class="brand">{{ config('app.name', 'SoukJannah') }}</p>
                    </div>
                </div>

                <p class="outer-footer">© {{ date('Y') }} {{ config('app.name', 'SoukJannah') }} — {{ $fr ? 'Tous droits réservés' : 'All rights reserved' }}</p>

            </td>
        </tr>
    </table>
</body>
</html>
