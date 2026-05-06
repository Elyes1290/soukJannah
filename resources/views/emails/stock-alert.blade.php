<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>{{ $fr ? 'Retour en stock' : 'Back in stock' }}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F3EF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F3EF;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:#ffffff;">

        {{-- Header --}}
        <tr>
          <td style="background-color:#1A1A1A;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.25em;color:#FAF8F4;text-transform:uppercase;">SoukJannah</p>
            <div style="width:32px;height:1px;background-color:#C8A96E;margin:10px auto 0;"></div>
          </td>
        </tr>

        {{-- Banner --}}
        <tr>
          <td style="background-color:#C8A96E;padding:10px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#1A1A1A;font-weight:500;">
              {{ $fr ? 'Retour en stock' : 'Back in stock' }}
            </p>
          </td>
        </tr>

        {{-- Body --}}
        <tr>
          <td style="padding:48px 40px 40px;">

            <h1 style="margin:0 0 8px;font-size:24px;font-weight:300;color:#1A1A1A;letter-spacing:0.05em;">
              {{ $fr ? 'Bonne nouvelle !' : 'Great news!' }}
            </h1>
            <div style="width:40px;height:2px;background-color:#C8A96E;margin-bottom:28px;"></div>

            <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4A4540;">
              {{ $fr
                ? 'Le produit que vous aviez mis en alerte est de nouveau disponible :'
                : 'The product you set an alert for is back in stock:' }}
            </p>

            {{-- Product card --}}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;border:1px solid #E8E4DE;">
              <tr>
                @if($product->main_image_url)
                <td width="100" style="padding:16px;vertical-align:top;">
                  <img src="{{ $product->main_image_url }}" alt="{{ $product->name }}"
                       style="width:80px;height:80px;object-fit:cover;display:block;" />
                </td>
                @endif
                <td style="padding:16px;vertical-align:middle;">
                  <p style="margin:0 0 4px;font-size:15px;font-weight:500;color:#1A1A1A;">{{ $product->name }}</p>
                  @if($product->sale_price)
                    <p style="margin:0;font-size:14px;color:#C8A96E;font-weight:500;">{{ number_format($product->sale_price, 2) }} CHF</p>
                  @else
                    <p style="margin:0;font-size:14px;color:#1A1A1A;font-weight:500;">{{ number_format($product->price, 2) }} CHF</p>
                  @endif
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#6B6560;">
              {{ $fr
                ? 'Dépêchez-vous, les stocks sont limités !'
                : 'Hurry, stock is limited!' }}
            </p>

            {{-- CTA --}}
            <div style="text-align:center;margin:32px 0;">
              <a href="{{ $productUrl }}"
                 style="display:inline-block;background-color:#1A1A1A;color:#FAF8F4;padding:14px 36px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.2em;text-decoration:none;">
                {{ $fr ? 'Commander maintenant' : 'Order now' }}
              </a>
            </div>

            <p style="margin:0;font-size:14px;line-height:1.7;color:#4A4540;">
              {{ $fr ? 'À très bientôt,' : 'See you soon,' }}<br>
              <strong style="color:#1A1A1A;">L'équipe SoukJannah</strong>
            </p>

          </td>
        </tr>

        {{-- Divider --}}
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background-color:#E8E4DE;"></div>
          </td>
        </tr>

        {{-- Footer --}}
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9A9490;">
              {{ $fr
                ? 'Vous recevez cet email car vous vous étiez inscrit(e) à une alerte de réapprovisionnement sur SoukJannah.'
                : 'You are receiving this email because you subscribed to a stock alert on SoukJannah.' }}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
