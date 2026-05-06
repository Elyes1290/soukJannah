<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nouvelle demande de retour</title>
</head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EE;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:#1A1A1A;padding:28px 40px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:22px;color:#C8A96E;letter-spacing:2px;">SoukJannah</span>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px;">
          <h2 style="font-family:Georgia,serif;font-size:20px;color:#1A1A1A;margin:0 0 20px;">
            Nouvelle demande de retour
          </h2>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;border:1px solid #E8E2D9;margin-bottom:24px;">
            <tr>
              <td style="padding:20px;">
                <p style="margin:0 0 8px;font-size:13px;color:#9A9490;">Commande</p>
                <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#1A1A1A;font-family:monospace;">
                  {{ $returnRequest->order->number }}
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#9A9490;">Client</p>
                <p style="margin:0 0 16px;font-size:14px;color:#1A1A1A;">
                  {{ $returnRequest->customer->full_name }} — {{ $returnRequest->customer->email }}
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#9A9490;">Raison</p>
                <p style="margin:0 0 16px;font-size:14px;color:#1A1A1A;">{{ $returnRequest->reason }}</p>
                @if($returnRequest->message)
                <p style="margin:0 0 8px;font-size:13px;color:#9A9490;">Message</p>
                <p style="margin:0;font-size:14px;color:#1A1A1A;font-style:italic;">
                  "{{ $returnRequest->message }}"
                </p>
                @endif
              </td>
            </tr>
          </table>

          <p style="text-align:center;margin:0;">
            <a href="{{ config('app.url') }}/admin/retours"
               style="display:inline-block;background:#1A1A1A;color:#FAF8F4;padding:12px 28px;font-size:13px;text-decoration:none;letter-spacing:1px;">
              TRAITER LA DEMANDE
            </a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px;border-top:1px solid #E8E2D9;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9A9490;">© {{ date('Y') }} SoukJannah — Administration</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
