<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>{{ $fr ? 'Bienvenue chez SoukJannah' : 'Welcome to SoukJannah' }}</title>
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

        {{-- Gold banner --}}
        <tr>
          <td style="background-color:#C8A96E;padding:10px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#1A1A1A;font-weight:500;">
              {{ $fr ? 'Newsletter — Bienvenue !' : 'Newsletter — Welcome!' }}
            </p>
          </td>
        </tr>

        {{-- Body --}}
        <tr>
          <td style="padding:48px 40px 40px;">

            {{-- Headline --}}
            <h1 style="margin:0 0 8px;font-size:26px;font-weight:300;color:#1A1A1A;letter-spacing:0.05em;">
              {{ $fr ? 'Bienvenue dans la famille' : 'Welcome to the family' }} 🌿
            </h1>
            <div style="width:40px;height:2px;background-color:#C8A96E;margin-bottom:28px;"></div>

            <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4A4540;">
              {{ $fr
                ? 'Merci de vous être inscrit(e) à notre newsletter. Vous rejoignez une communauté de personnes attachées à une alimentation halal de qualité.'
                : 'Thank you for subscribing to our newsletter. You\'re now part of a community of people who care about quality halal food.' }}
            </p>

            <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#4A4540;">
              {{ $fr
                ? 'En tant qu\'abonné(e), vous recevrez en avant-première :'
                : 'As a subscriber, you\'ll be the first to know about:' }}
            </p>

            {{-- Benefits list --}}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
              @foreach($fr ? [
                  ['🎁', 'Offres exclusives réservées aux abonnés'],
                  ['🆕', 'Nouveaux produits en avant-première'],
                  ['💬', 'Conseils et recettes halal'],
                  ['🚚', 'Promotions spéciales et frais de port offerts'],
              ] : [
                  ['🎁', 'Exclusive offers for subscribers only'],
                  ['🆕', 'New products before everyone else'],
                  ['💬', 'Halal tips and recipes'],
                  ['🚚', 'Special promotions and free shipping deals'],
              ] as [$icon, $text])
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:32px;font-size:18px;">{{ $icon }}</td>
                <td style="padding:8px 0;font-size:14px;color:#4A4540;line-height:1.6;">{{ $text }}</td>
              </tr>
              @endforeach
            </table>

            {{-- CTA --}}
            <div style="text-align:center;margin-bottom:40px;">
              <a href="{{ $shopUrl }}"
                 style="display:inline-block;background-color:#1A1A1A;color:#FAF8F4;padding:14px 36px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.2em;text-decoration:none;">
                {{ $fr ? 'Découvrir la boutique' : 'Explore the shop' }}
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
            <p style="margin:0 0 8px;font-size:11px;color:#9A9490;">
              {{ $fr
                ? 'Vous recevez cet email car vous vous êtes inscrit(e) sur SoukJannah.'
                : 'You are receiving this email because you subscribed on SoukJannah.' }}
            </p>
            <p style="margin:0;font-size:11px;">
              <a href="{{ $unsubUrl }}" style="color:#C8A96E;text-decoration:none;">
                {{ $fr ? 'Se désabonner' : 'Unsubscribe' }}
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
