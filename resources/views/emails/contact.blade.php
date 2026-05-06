<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica Neue', sans-serif; background: #F5F2EE; margin: 0; padding: 40px 20px; }
        .card { background: white; max-width: 560px; margin: 0 auto; padding: 40px; border-top: 3px solid #C8A96E; }
        h1 { font-size: 22px; font-weight: 400; color: #1A1A1A; margin: 0 0 24px; }
        .label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #9A9490; margin-bottom: 4px; }
        .value { font-size: 14px; color: #1A1A1A; margin-bottom: 20px; }
        .message-box { background: #F5F2EE; padding: 20px; font-size: 14px; color: #6B6560; line-height: 1.7; white-space: pre-wrap; }
        .footer { font-size: 11px; color: #9A9490; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E8E2D9; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Nouveau message de contact</h1>

        <div class="label">Nom</div>
        <div class="value">{{ $name }}</div>

        <div class="label">Email</div>
        <div class="value"><a href="mailto:{{ $email }}" style="color:#C8A96E;">{{ $email }}</a></div>

        <div class="label">Sujet</div>
        <div class="value">{{ $subject }}</div>

        <div class="label">Message</div>
        <div class="message-box">{{ $body }}</div>

        <div class="footer">
            Message reçu via le formulaire de contact de votre boutique.<br>
            Répondez directement à cet email pour contacter {{ $name }}.
        </div>
    </div>
</body>
</html>
