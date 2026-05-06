@php $fr = ($order->locale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Votre commande est en route' : 'Your order is on its way' }}</title>
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
                                <span style="font-size:28px;">📦</span>
                            </div>
                            <h1 style="margin:0 0 12px;font-size:22px;font-weight:400;color:#1A1A1A;letter-spacing:-0.02em;">
                                {{ $fr ? 'Votre commande est en route' : 'Your order is on its way' }}
                            </h1>
                            <p style="margin:0;font-size:14px;color:#9A9490;font-weight:300;line-height:1.6;">
                                {{ $fr ? 'Bonjour' : 'Hello' }} {{ $order->customer->first_name }},<br>
                                {{ $fr ? 'votre commande' : 'your order' }}
                                <strong style="color:#1A1A1A;font-weight:500;">{{ $order->number }}</strong>
                                {{ $fr ? 'vient d\'être expédiée.' : 'has just been shipped.' }}
                            </p>
                        </td>
                    </tr>

                    {{-- Numéro de suivi --}}
                    @if($order->tracking_number)
                    <tr>
                        <td style="padding:32px 40px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#F5F2EE;border:1px solid #E8E2D9;border-left:3px solid #C8A96E;padding:20px 24px;">
                                        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9A9490;font-weight:400;">
                                            {{ $fr ? 'Numéro de suivi' : 'Tracking number' }}
                                        </p>
                                        <p style="margin:0;font-size:20px;font-weight:600;letter-spacing:0.08em;color:#1A1A1A;">
                                            {{ $order->tracking_number }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

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
                                <tr>
                                    <td colspan="2" style="padding:16px 0 4px;font-size:13px;color:#9A9490;font-weight:300;">
                                        {{ $fr ? 'Livraison' : 'Shipping' }}
                                    </td>
                                    <td style="padding:16px 0 4px;font-size:13px;color:#9A9490;text-align:right;">
                                        {{ $order->shipping == 0 ? ($fr ? 'Gratuite ✓' : 'Free ✓') : number_format($order->shipping, 2) . ' CHF' }}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding:4px 0 0;font-size:14px;font-weight:500;color:#1A1A1A;border-top:1px solid #E8E2D9;">
                                        Total
                                    </td>
                                    <td style="padding:4px 0 0;font-size:16px;font-weight:600;color:#C8A96E;text-align:right;border-top:1px solid #E8E2D9;">
                                        {{ number_format($order->total, 2) }} CHF
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Message --}}
                    <tr>
                        <td style="padding:32px 40px;">
                            <p style="margin:0;font-size:14px;color:#6B6560;font-weight:300;line-height:1.7;">
                                @if($fr)
                                    Votre colis devrait arriver dans <strong style="color:#1A1A1A;font-weight:500;">2 à 5 jours ouvrés</strong> selon votre adresse de livraison.<br><br>
                                    Nous espérons que vous serez pleinement satisfait(e) de votre achat. N'hésitez pas à nous contacter si vous avez des questions.
                                @else
                                    Your parcel should arrive within <strong style="color:#1A1A1A;font-weight:500;">2 to 5 business days</strong> depending on your delivery address.<br><br>
                                    We hope you are fully satisfied with your purchase. Feel free to contact us if you have any questions.
                                @endif
                            </p>
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
