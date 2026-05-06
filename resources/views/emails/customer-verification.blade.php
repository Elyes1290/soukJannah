@php $fr = ($mailLocale ?? 'en') === 'fr'; @endphp
<!DOCTYPE html>
<html lang="{{ $fr ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $fr ? 'Confirmez votre adresse email' : 'Verify your email address' }}</title>
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
                                <span style="font-size:28px;">✉</span>
                            </div>
                            <h1 style="margin:0 0 12px;font-size:22px;font-weight:400;color:#1A1A1A;letter-spacing:-0.02em;">
                                {{ $fr ? 'Confirmez votre adresse email' : 'Verify your email address' }}
                            </h1>
                            <p style="margin:0;font-size:14px;color:#9A9490;font-weight:300;line-height:1.6;">
                                {{ $fr ? 'Bonjour' : 'Hello' }} {{ $customer->first_name }},<br>
                                {{ $fr
                                    ? 'Merci de vous être inscrit(e). Cliquez sur le bouton ci-dessous pour activer votre compte.'
                                    : 'Thank you for registering. Click the button below to activate your account.' }}
                            </p>
                        </td>
                    </tr>

                    {{-- Bouton de vérification --}}
                    <tr>
                        <td style="padding:40px 40px 0;text-align:center;">
                            <a href="{{ $verificationUrl }}"
                               style="display:inline-block;padding:16px 40px;background:#1A1A1A;color:#FFFFFF;text-decoration:none;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;">
                                {{ $fr ? 'Activer mon compte' : 'Activate my account' }}
                            </a>
                        </td>
                    </tr>

                    {{-- Lien alternatif --}}
                    <tr>
                        <td style="padding:24px 40px 0;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#9A9490;font-weight:300;line-height:1.6;">
                                {{ $fr ? 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :' : "If the button doesn't work, copy this link into your browser:" }}<br>
                                <a href="{{ $verificationUrl }}" style="color:#C8A96E;word-break:break-all;font-size:11px;">{{ $verificationUrl }}</a>
                            </p>
                        </td>
                    </tr>

                    {{-- Sécurité --}}
                    <tr>
                        <td style="padding:32px 40px;">
                            <p style="margin:0;font-size:12px;color:#9A9490;font-weight:300;line-height:1.6;text-align:center;">
                                {{ $fr
                                    ? 'Ce lien expire dans 24 heures. Si vous n\'avez pas créé de compte, ignorez cet email.'
                                    : "This link expires in 24 hours. If you didn't create an account, you can safely ignore this email." }}
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
