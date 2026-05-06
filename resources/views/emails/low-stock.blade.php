<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock faible</title>
    <style>
        body { font-family: 'Georgia', serif; background: #FAF8F4; margin: 0; padding: 0; }
        .wrapper { max-width: 580px; margin: 40px auto; background: white; border: 1px solid #E8E2D9; }
        .header { background: #1A1A1A; padding: 32px; text-align: center; }
        .header h1 { color: #C8A96E; font-size: 20px; margin: 0; font-weight: normal; letter-spacing: 0.15em; text-transform: uppercase; }
        .body { padding: 40px 32px; }
        .alert-box { background: #FFF7ED; border: 1px solid #FED7AA; padding: 16px; margin-bottom: 24px; }
        .alert-box p { margin: 0; color: #D97706; font-size: 14px; }
        .product-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .product-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9A9490; padding: 8px; border-bottom: 1px solid #E8E2D9; }
        .product-table td { padding: 12px 8px; font-size: 14px; color: #1A1A1A; border-bottom: 1px solid #F0EBE1; }
        .stock-low { color: #E07070; font-weight: bold; }
        .stock-zero { color: #dc2626; font-weight: bold; }
        .btn { display: inline-block; background: #1A1A1A; color: white; text-decoration: none; padding: 12px 28px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; }
        .footer { padding: 24px 32px; border-top: 1px solid #E8E2D9; text-align: center; }
        .footer p { font-size: 11px; color: #9A9490; margin: 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>SoukJannah — Alerte stock</h1>
        </div>
        <div class="body">
            <div class="alert-box">
                <p>⚠️ Suite à la commande <strong>{{ $orderNumber }}</strong>, {{ count($lowStockProducts) }} produit(s) ont un stock faible ou épuisé.</p>
            </div>

            <table class="product-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Stock restant</th>
                        <th>Seuil</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($lowStockProducts as $p)
                    <tr>
                        <td>{{ $p['name'] }}</td>
                        <td class="{{ $p['stock'] === 0 ? 'stock-zero' : 'stock-low' }}">
                            {{ $p['stock'] === 0 ? '⛔ Épuisé' : $p['stock'] . ' unité(s)' }}
                        </td>
                        <td style="color:#9A9490">≤ {{ $p['threshold'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <p style="text-align:center">
                <a href="{{ config('app.url') }}/admin/produits" class="btn">Gérer les produits</a>
            </p>
        </div>
        <div class="footer">
            <p>SoukJannah — Notification automatique</p>
        </div>
    </div>
</body>
</html>
