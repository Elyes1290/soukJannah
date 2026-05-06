<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nouvelle commande</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f9; margin: 0; padding: 0; color: #1a1a1a; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border: 1px solid #e5e5e5; }
        .header { background: #1a1a1a; padding: 24px 32px; }
        .header h1 { color: #fff; margin: 0; font-size: 18px; font-weight: 500; }
        .body { padding: 32px; }
        .body p { color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
        .info { background: #f9f9f9; border: 1px solid #e5e5e5; padding: 16px; margin-bottom: 20px; font-size: 14px; }
        .info p { margin: 4px 0; color: #333; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 12px; color: #888; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        td { padding: 10px 0; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
        .total { font-weight: 600; font-size: 15px; margin-top: 16px; text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ Nouvelle commande — {{ $order->number }}</h1>
        </div>
        <div class="body">
            <div class="info">
                <p><strong>Client :</strong> {{ $order->customer->full_name }}</p>
                <p><strong>Email :</strong> {{ $order->customer->email }}</p>
                <p><strong>Adresse :</strong> {{ $order->customer->address }}, {{ $order->customer->postal_code }} {{ $order->customer->city }}</p>
                <p><strong>Date :</strong> {{ $order->created_at->format('d/m/Y à H:i') }}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Qté</th>
                        <th style="text-align:right">Total</th>
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
                </tbody>
            </table>

            <p class="total">Total : {{ number_format($order->total, 2) }} CHF</p>
        </div>
    </div>
</body>
</html>
