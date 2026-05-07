<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: 'DejaVu Sans', sans-serif;
        font-size: 12px;
        color: #1A1A1A;
        background: #fff;
        padding: 40px;
    }

    /* En-tête */
    .header { display: table; width: 100%; margin-bottom: 36px; }
    .header-left  { display: table-cell; vertical-align: top; width: 50%; }
    .header-right { display: table-cell; vertical-align: top; width: 50%; text-align: right; }

    .brand-name {
        font-size: 22px;
        font-weight: 700;
        color: #1A1A1A;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
    }
    .brand-tagline {
        font-size: 10px;
        color: #9A9490;
        text-transform: uppercase;
        letter-spacing: 0.2em;
    }

    .invoice-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #C8A96E;
        margin-bottom: 4px;
    }
    .invoice-number {
        font-size: 18px;
        font-weight: 700;
        color: #1A1A1A;
        font-family: monospace;
    }
    .invoice-date {
        font-size: 11px;
        color: #9A9490;
        margin-top: 4px;
    }

    /* Ligne dorée */
    .gold-line {
        height: 2px;
        background-color: #C8A96E;
        margin-bottom: 28px;
    }

    /* Adresses */
    .addresses { display: table; width: 100%; margin-bottom: 28px; }
    .address-block { display: table-cell; width: 50%; vertical-align: top; }
    .address-title {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #9A9490;
        margin-bottom: 8px;
    }
    .address-name  { font-weight: 600; font-size: 13px; margin-bottom: 3px; }
    .address-line  { font-size: 11px; color: #4A4540; line-height: 1.6; }

    /* Statut */
    .status-box {
        background: #F0EBE1;
        border-left: 3px solid #C8A96E;
        padding: 10px 16px;
        margin-bottom: 28px;
        font-size: 11px;
    }
    .status-box strong { color: #1A1A1A; }

    /* Tableau articles */
    table.items {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
    }
    table.items thead tr {
        background: #1A1A1A;
        color: #fff;
    }
    table.items thead th {
        padding: 10px 12px;
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 500;
    }
    table.items thead th.right { text-align: right; }
    table.items tbody tr { border-bottom: 1px solid #F0EBE1; }
    table.items tbody tr:nth-child(even) { background: #FAF8F4; }
    table.items tbody td { padding: 10px 12px; font-size: 12px; }
    table.items tbody td.right { text-align: right; }
    table.items tbody td.qty { text-align: center; }

    /* Totaux */
    .totals { float: right; width: 280px; }
    .totals table { width: 100%; border-collapse: collapse; }
    .totals td { padding: 6px 0; font-size: 12px; }
    .totals td.label { color: #6B6560; }
    .totals td.value { text-align: right; font-weight: 500; }
    .totals .total-row td {
        border-top: 2px solid #1A1A1A;
        padding-top: 10px;
        font-weight: 700;
        font-size: 14px;
        color: #1A1A1A;
    }
    .totals .gold { color: #C8A96E; }

    .clearfix::after { content: ''; display: table; clear: both; }

    /* Code promo */
    .promo-row td { color: #7B9E87; }

    /* Pied de page */
    .footer {
        margin-top: 48px;
        padding-top: 16px;
        border-top: 1px solid #E8E2D9;
        font-size: 10px;
        color: #9A9490;
        text-align: center;
        line-height: 1.6;
    }
    .footer strong { color: #1A1A1A; }

    /* Mention payé */
    .paid-stamp {
        float: right;
        border: 2px solid #7B9E87;
        color: #7B9E87;
        padding: 6px 14px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-weight: 700;
        transform: rotate(-5deg);
        margin-top: -8px;
    }
</style>
</head>
<body>

    <!-- En-tête -->
    <div class="header">
        <div class="header-left">
            <div class="brand-name">SoukJannah</div>
            <div class="brand-tagline">Your halal essentials</div>
        </div>
        <div class="header-right">
            <div class="invoice-label">Facture</div>
            <div class="invoice-number">{{ $order->number }}</div>
            <div class="invoice-date">Émise le {{ $order->created_at->format('d/m/Y') }}</div>
        </div>
    </div>

    <div class="gold-line"></div>

    <!-- Adresses -->
    <div class="addresses">
        <div class="address-block">
            <div class="address-title">Vendeur</div>
            <div class="address-name">SoukJannah</div>
            <div class="address-line">{{ config('mail.from.address') }}</div>
            <div class="address-line">Suisse</div>
        </div>
        <div class="address-block" style="text-align:right;">
            <div class="address-title">Client</div>
            <div class="address-name">{{ $order->customer->full_name }}</div>
            <div class="address-line">{{ $order->customer->email }}</div>
            @if($order->customer->address)
            <div class="address-line">{{ $order->customer->address }}</div>
            <div class="address-line">{{ $order->customer->postal_code }} {{ $order->customer->city }}</div>
            <div class="address-line">{{ $order->customer->country }}</div>
            @endif
        </div>
    </div>

    <!-- Statut -->
    <div class="status-box">
        Statut : <strong>
        @php
            $labels = ['pending'=>'En attente','paid'=>'Payée','preparing'=>'En préparation','shipped'=>'Expédiée','delivered'=>'Livrée','cancelled'=>'Annulée','refunded'=>'Remboursée'];
        @endphp
        {{ $labels[$order->status] ?? $order->status }}
        </strong>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        Date de commande : <strong>{{ $order->created_at->format('d/m/Y à H:i') }}</strong>
        @if($order->tracking_number)
        &nbsp;&nbsp;|&nbsp;&nbsp;
        N° de suivi : <strong>{{ $order->tracking_number }}</strong>
        @endif
    </div>

    <!-- Articles -->
    <table class="items">
        <thead>
            <tr>
                <th>Produit</th>
                <th class="qty">Qté</th>
                <th class="right">Prix unitaire</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td class="qty">{{ $item->quantity }}</td>
                <td class="right">{{ number_format($item->price, 2) }} CHF</td>
                <td class="right">{{ number_format($item->price * $item->quantity, 2) }} CHF</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totaux -->
    <div class="clearfix">
        @if($order->status === 'refunded')
        <div class="paid-stamp" style="border-color:#9A9490;color:#9A9490;">Remboursé</div>
        @elseif($order->status === 'cancelled')
        <div class="paid-stamp" style="border-color:#E07070;color:#E07070;">Annulée</div>
        @elseif(in_array($order->status, ['paid','preparing','shipped','delivered']))
        <div class="paid-stamp">Payé</div>
        @endif

        <div class="totals">
            <table>
                <tr>
                    <td class="label">Sous-total</td>
                    <td class="value">{{ number_format($order->subtotal, 2) }} CHF</td>
                </tr>
                <tr>
                    <td class="label">Frais de livraison</td>
                    <td class="value">
                        @if($order->shipping == 0)
                            Offerts
                        @else
                            {{ number_format($order->shipping, 2) }} CHF
                        @endif
                    </td>
                </tr>
                @if($order->refunded_amount > 0)
                <tr class="promo-row">
                    <td class="label">Remboursé</td>
                    <td class="value" style="color:#dc2626;">- {{ number_format($order->refunded_amount, 2) }} CHF</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td class="label gold">Total</td>
                    @php $netTotal = max(0, $order->total - ($order->refunded_amount ?? 0)); @endphp
                    <td class="value gold">{{ number_format($netTotal, 2) }} CHF</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- Pied de page -->
    <div class="footer">
        <strong>SoukJannah</strong> — Votre boutique d'essentiels halal premium<br>
        @php
            $publicHost = parse_url(config('app.url'), PHP_URL_HOST) ?: 'soukjannah.com';
        @endphp
        {{ config('mail.from.address') }} · {{ $publicHost }}<br>
        Ce document est une facture officielle. Merci pour votre confiance.
    </div>

</body>
</html>
