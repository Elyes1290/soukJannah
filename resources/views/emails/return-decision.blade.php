<!DOCTYPE html>
<html lang="{{ $returnRequest->order->locale ?? 'en' }}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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

      <!-- Status banner -->
      @if($returnRequest->status === 'approved')
      <tr>
        <td style="background:#7B9E8720;border-bottom:3px solid #7B9E87;padding:16px 40px;text-align:center;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#7B9E87;">
            ✓ &nbsp;
            @if(($returnRequest->order->locale ?? 'en') === 'fr')
              Votre demande de retour a été approuvée
            @else
              Your return request has been approved
            @endif
          </p>
        </td>
      </tr>
      @else
      <tr>
        <td style="background:#E0707020;border-bottom:3px solid #E07070;padding:16px 40px;text-align:center;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#E07070;">
            @if(($returnRequest->order->locale ?? 'en') === 'fr')
              Votre demande de retour n'a pas pu être approuvée
            @else
              Your return request could not be approved
            @endif
          </p>
        </td>
      </tr>
      @endif

      <!-- Body -->
      <tr>
        <td style="padding:40px;">
          @php $locale = $returnRequest->order->locale ?? 'en'; @endphp
          @php $fr = $locale === 'fr'; @endphp

          <p style="font-size:14px;color:#1A1A1A;margin:0 0 20px;">
            {{ $fr ? 'Bonjour' : 'Hello' }} <strong>{{ $returnRequest->customer->first_name }}</strong>,
          </p>

          @if($returnRequest->status === 'approved')
          <p style="font-size:14px;color:#6B6560;margin:0 0 20px;line-height:1.6;">
            @if($fr)
              Nous avons bien approuvé votre demande de retour pour la commande
              <strong style="color:#1A1A1A;">{{ $returnRequest->order->number }}</strong>.
              Notre équipe vous contactera sous 48h pour organiser le retour du colis.
            @else
              We have approved your return request for order
              <strong style="color:#1A1A1A;">{{ $returnRequest->order->number }}</strong>.
              Our team will contact you within 48 hours to arrange the return shipment.
            @endif
          </p>
          @else
          <p style="font-size:14px;color:#6B6560;margin:0 0 20px;line-height:1.6;">
            @if($fr)
              Malheureusement, nous ne pouvons pas approuver votre demande de retour pour la commande
              <strong style="color:#1A1A1A;">{{ $returnRequest->order->number }}</strong>.
            @else
              Unfortunately, we are unable to approve your return request for order
              <strong style="color:#1A1A1A;">{{ $returnRequest->order->number }}</strong>.
            @endif
          </p>
          @endif

          @if($returnRequest->admin_notes)
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;border-left:3px solid #C8A96E;margin-bottom:24px;">
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 6px;font-size:12px;color:#9A9490;text-transform:uppercase;letter-spacing:1px;">
                  {{ $fr ? 'Message de notre équipe' : 'Message from our team' }}
                </p>
                <p style="margin:0;font-size:14px;color:#1A1A1A;font-style:italic;">
                  "{{ $returnRequest->admin_notes }}"
                </p>
              </td>
            </tr>
          </table>
          @endif

          <p style="text-align:center;margin:24px 0 0;">
            <a href="{{ config('app.url') }}/mon-compte/commandes"
               style="display:inline-block;background:#1A1A1A;color:#FAF8F4;padding:12px 28px;font-size:13px;text-decoration:none;letter-spacing:1px;">
              {{ $fr ? 'MES COMMANDES' : 'MY ORDERS' }}
            </a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px;border-top:1px solid #E8E2D9;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9A9490;">
            © {{ date('Y') }} SoukJannah ·
            {{ $fr ? 'Des questions ? Contactez-nous' : 'Questions? Contact us' }} :
            <a href="mailto:support@soukjannah.com" style="color:#C8A96E;text-decoration:none;">support@soukjannah.com</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
