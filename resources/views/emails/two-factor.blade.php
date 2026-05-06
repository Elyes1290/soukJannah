<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de connexion</title>
    <style>
        body { font-family: 'Georgia', serif; background: #F5F2EE; margin: 0; padding: 0; color: #1A1A1A; }
        .wrapper { max-width: 520px; margin: 40px auto; background: #FFFFFF; }
        .header { background: #1A1A1A; padding: 28px 40px; text-align: center; }
        .header span { color: #C8A96E; font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; }
        .content { padding: 40px; text-align: center; }
        h1 { font-size: 20px; font-weight: normal; margin: 0 0 12px; color: #1A1A1A; }
        p { font-size: 14px; line-height: 1.7; color: #4A4540; margin: 0 0 24px; font-weight: 300; }
        .code-box { display: inline-block; background: #F0EBE1; border: 2px solid #C8A96E; padding: 20px 40px; margin: 16px 0 24px; }
        .code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 0.3em; color: #1A1A1A; }
        .warning { font-size: 12px; color: #9A9490; font-weight: 300; }
        .footer { background: #F0EBE1; padding: 20px 40px; text-align: center; font-size: 12px; color: #9A9490; font-weight: 300; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <span>SoukJannah — Admin</span>
    </div>

    <div class="content">
        <h1>Bonjour {{ $name }},</h1>
        <p>Voici votre code de vérification pour accéder au panneau d'administration :</p>

        <div class="code-box">
            <div class="code">{{ $code }}</div>
        </div>

        <p class="warning">
            Ce code expire dans <strong>10 minutes</strong>.<br>
            Si vous n'avez pas tenté de vous connecter, ignorez cet email.
        </p>
    </div>

    <div class="footer">
        © {{ date('Y') }} SoukJannah. Usage interne uniquement.
    </div>
</div>
</body>
</html>
