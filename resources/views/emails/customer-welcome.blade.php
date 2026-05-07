@php $fr = ($mailLocale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Bienvenue sur SoukJannah' : 'Welcome to SoukJannah' }}</title>
</head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1A1A1A;">

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #E8E2D9;">

                    <tr>
                        <td style="background:#1A1A1A;padding:20px 40px;text-align:center;">
                            <img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name', 'SoukJannah') }}" width="48" height="48" style="display:inline-block;margin-bottom:8px;" />
                            <p style="margin:0;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#C8A96E;font-weight:400;">
                                {{ config('app.name', 'SoukJannah') }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:48px 40px 0;text-align:center;">
                            <h1 style="margin:0 0 12px;font-size:22px;font-weight:400;color:#1A1A1A;">
                                {{ $fr ? 'Bienvenue' : 'Welcome' }}, {{ $customer->first_name }}
                            </h1>
                            <p style="margin:0;font-size:14px;color:#9A9490;font-weight:300;line-height:1.6;">
                                {{ $fr
                                    ? 'Votre compte est activé. Vous pouvez parcourir la boutique, enregistrer vos adresses et suivre vos commandes depuis votre espace client.'
                                    : 'Your account is active. You can browse the shop, save addresses and track orders from your customer area.' }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 40px 32px;text-align:center;">
                            <a href="{{ url('/boutique') }}"
                               style="display:inline-block;padding:14px 36px;background:#1A1A1A;color:#FFFFFF;text-decoration:none;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;">
                                {{ $fr ? 'Voir la boutique' : 'Explore the shop' }}
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 32px;">
                            <div style="height:1px;background:linear-gradient(to right,transparent,#C8A96E,transparent);"></div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 28px;text-align:center;">
                            <p style="margin:0;font-size:11px;color:#C8A96E;">
                                © {{ date('Y') }} {{ config('app.name', 'SoukJannah') }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
