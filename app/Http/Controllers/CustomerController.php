<?php

namespace App\Http\Controllers;

use App\Mail\CustomerVerificationMail;
use App\Mail\ReturnDecisionMail;
use App\Mail\ReturnRequestMail;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\ReturnRequest;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomerController extends Controller
{
    // ── Authentification ──────────────────────────────────────────────────────

    public function showLogin(Request $request)
    {
        $customerId = session('customer_id');
        if ($customerId && Customer::find($customerId)) {
            $redirect = $request->query('redirect');
            return redirect($redirect && str_starts_with($redirect, '/') ? $redirect : route('customer.dashboard'));
        }

        // Session orpheline (client supprimé) → on nettoie
        if ($customerId) {
            $request->session()->forget('customer_id');
        }

        return Inertia::render('Customer/Login', [
            'redirectTo' => $request->query('redirect', ''),
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $customer = Customer::where('email', $request->email)
            ->whereNotNull('password')
            ->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return back()->withErrors(['email' => 'Email ou mot de passe incorrect.']);
        }

        if (!$customer->isVerified()) {
            return back()->withErrors(['email' => 'Veuillez vérifier votre adresse email avant de vous connecter. Consultez votre boîte mail.']);
        }

        $request->session()->put('customer_id', $customer->id);
        $request->session()->regenerate();

        $redirect = $request->input('redirect_to', '');
        if ($redirect && str_starts_with($redirect, '/')) {
            return redirect($redirect);
        }

        return redirect()->route('customer.dashboard');
    }

    public function logout(Request $request)
    {
        $request->session()->forget('customer_id');
        return redirect()->route('customer.login');
    }

    // ── Inscription ───────────────────────────────────────────────────────────

    public function showRegister()
    {
        if (session('customer_id')) {
            return redirect()->route('customer.dashboard');
        }
        return Inertia::render('Customer/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email',
            'password'   => 'required|string|min:8|confirmed',
        ]);

        $locale = $request->input('locale', 'en');
        $token  = Str::random(64);

        $customer = Customer::where('email', $request->email)->first();

        if ($customer) {
            if ($customer->hasAccount()) {
                return back()->withErrors(['email' => 'Un compte existe déjà avec cette adresse email. Connectez-vous.']);
            }
            $customer->update([
                'first_name'                => $request->first_name,
                'last_name'                 => $request->last_name,
                'password'                  => Hash::make($request->password),
                'email_verified_at'         => null,
                'email_verification_token'  => $token,
            ]);
        } else {
            $customer = Customer::create([
                'first_name'                => $request->first_name,
                'last_name'                 => $request->last_name,
                'email'                     => $request->email,
                'password'                  => Hash::make($request->password),
                'email_verification_token'  => $token,
                'address'                   => '',
                'city'                      => '',
                'postal_code'               => '',
                'country'                   => 'CH',
            ]);
        }

        $verificationUrl = route('customer.verify', ['token' => $token]);

        try {
            Mail::to($customer->email)->send(
                new CustomerVerificationMail($customer, $verificationUrl, $locale)
            );
        } catch (\Exception $e) {
            Log::error('Verification email failed: ' . $e->getMessage());
        }

        return redirect()->route('customer.check-email')
            ->with('check_email', $customer->email);
    }

    // ── Vérification email ────────────────────────────────────────────────────

    public function checkEmail(Request $request)
    {
        return Inertia::render('Customer/CheckEmail', [
            'email' => $request->session()->get('check_email', ''),
        ]);
    }

    public function verify(Request $request, string $token)
    {
        $customer = Customer::where('email_verification_token', $token)->first();

        if (!$customer) {
            return redirect()->route('customer.login')
                ->with('error', 'Lien de vérification invalide ou expiré.');
        }

        $customer->update([
            'email_verified_at'         => now(),
            'email_verification_token'  => null,
        ]);

        $request->session()->put('customer_id', $customer->id);
        $request->session()->regenerate();

        return redirect()->route('customer.dashboard')
            ->with('success', 'Votre compte est activé. Bienvenue !');
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    public function dashboard(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));
        $orders   = $this->getCustomerOrders($customer);

        $stats = [
            'total'   => $orders->count(),
            'shipped' => $orders->whereIn('status', ['shipped', 'delivered'])->count(),
            'spent'   => $orders->whereIn('status', ['paid', 'preparing', 'shipped', 'delivered'])->sum('total'),
        ];

        return Inertia::render('Customer/Dashboard', [
            'customer' => $this->customerData($customer),
            'orders'   => $orders->values(),
            'stats'    => $stats,
        ]);
    }

    // ── Commandes ─────────────────────────────────────────────────────────────

    public function orders(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));
        $orders   = $this->getCustomerOrders($customer);

        return Inertia::render('Customer/Orders', [
            'customer' => $this->customerData($customer),
            'orders'   => $orders->values(),
        ]);
    }

    // ── Profil ────────────────────────────────────────────────────────────────

    public function showProfile(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        return Inertia::render('Customer/Profile', [
            'customer' => $this->customerData($customer),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'phone'      => 'nullable|string|max:30',
        ]);

        $customer->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'phone'      => $request->phone ?? '',
        ]);

        return back()->with('success', 'Profil mis à jour.');
    }

    // ── Sécurité / mot de passe ───────────────────────────────────────────────

    public function showSecurity(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        return Inertia::render('Customer/Security', [
            'customer'     => $this->customerData($customer),
            'has_password' => !is_null($customer->password),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        // Customer without a password (e.g. social login): set a new one directly
        if (is_null($customer->password)) {
            $request->validate([
                'password' => 'required|string|min:8|confirmed',
            ]);
            $customer->update(['password' => Hash::make($request->password)]);
            return back()->with('success', 'Mot de passe défini avec succès.');
        }

        // Customer with existing password: require current password
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $customer->password)) {
            return back()->withErrors(['current_password' => 'Mot de passe actuel incorrect.']);
        }

        $customer->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Mot de passe modifié.');
    }

    // ── Adresses ──────────────────────────────────────────────────────────────

    public function showAddresses(Request $request)
    {
        $customer  = Customer::findOrFail(session('customer_id'));
        $addresses = CustomerAddress::where('customer_id', $customer->id)
            ->orderByDesc('is_default')
            ->orderBy('id')
            ->get();

        return Inertia::render('Customer/Addresses', [
            'customer'  => $this->customerData($customer),
            'addresses' => $addresses,
        ]);
    }

    public function storeAddress(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        $request->validate([
            'label'       => 'nullable|string|max:60',
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'required|string|max:100',
            'address'     => 'required|string|max:255',
            'address2'    => 'nullable|string|max:255',
            'city'        => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country'     => 'required|string|size:2',
            'phone'       => 'nullable|string|max:30',
            'is_default'  => 'boolean',
        ]);

        if ($request->boolean('is_default')) {
            CustomerAddress::where('customer_id', $customer->id)->update(['is_default' => false]);
        }

        $isFirst = CustomerAddress::where('customer_id', $customer->id)->count() === 0;

        CustomerAddress::create([
            'customer_id' => $customer->id,
            'label'       => $request->label ?: 'Domicile',
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'address'     => $request->address,
            'address2'    => $request->address2,
            'city'        => $request->city,
            'postal_code' => $request->postal_code,
            'country'     => strtoupper($request->country),
            'phone'       => $request->phone,
            'is_default'  => $isFirst || $request->boolean('is_default'),
        ]);

        return back()->with('success', 'Adresse ajoutée.');
    }

    public function updateAddress(Request $request, CustomerAddress $address)
    {
        $customer = Customer::findOrFail(session('customer_id'));
        abort_if($address->customer_id !== $customer->id, 403);

        $request->validate([
            'label'       => 'nullable|string|max:60',
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'required|string|max:100',
            'address'     => 'required|string|max:255',
            'address2'    => 'nullable|string|max:255',
            'city'        => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country'     => 'required|string|size:2',
            'phone'       => 'nullable|string|max:30',
            'is_default'  => 'boolean',
        ]);

        if ($request->boolean('is_default')) {
            CustomerAddress::where('customer_id', $customer->id)->update(['is_default' => false]);
        }

        $address->update([
            'label'       => $request->label ?: 'Domicile',
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'address'     => $request->address,
            'address2'    => $request->address2,
            'city'        => $request->city,
            'postal_code' => $request->postal_code,
            'country'     => strtoupper($request->country),
            'phone'       => $request->phone,
            'is_default'  => $request->boolean('is_default'),
        ]);

        return back()->with('success', 'Adresse mise à jour.');
    }

    public function destroyAddress(CustomerAddress $address)
    {
        $customer = Customer::findOrFail(session('customer_id'));
        abort_if($address->customer_id !== $customer->id, 403);
        $address->delete();
        return back()->with('success', 'Adresse supprimée.');
    }

    public function setDefaultAddress(CustomerAddress $address)
    {
        $customer = Customer::findOrFail(session('customer_id'));
        abort_if($address->customer_id !== $customer->id, 403);
        CustomerAddress::where('customer_id', $customer->id)->update(['is_default' => false]);
        $address->update(['is_default' => true]);
        return back()->with('success', 'Adresse par défaut mise à jour.');
    }

    // ── Avis ──────────────────────────────────────────────────────────────────

    public function showReviews(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        $myReviews = Review::with('product')
            ->where('customer_id', $customer->id)
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'rating'       => $r->rating,
                'content'      => $r->content,
                'is_active'    => $r->is_active,
                'created_at'   => $r->created_at->format('d/m/Y'),
                'product_name' => $r->product?->name,
                'product_slug' => $r->product?->slug,
            ]);

        // Produits livrés que le client n'a pas encore notés (un avis par produit)
        $reviewedProductIds = Review::where('customer_id', $customer->id)->pluck('product_id')->filter();

        $deliveredOrders = Order::with('items')
            ->where(function ($q) use ($customer) {
                $q->where('customer_id', $customer->id)
                  ->orWhereHas('customer', fn($sq) => $sq->where('email', $customer->email));
            })
            ->whereIn('status', ['shipped', 'delivered'])
            ->latest()
            ->get();

        // Construire la liste de produits reviewables : 1 entrée par (order_item.product_id)
        $reviewableProducts = collect();
        foreach ($deliveredOrders as $order) {
            foreach ($order->items as $item) {
                if (!$item->product_id) continue;
                if ($reviewedProductIds->contains($item->product_id)) continue;
                // Éviter les doublons si produit commandé dans plusieurs commandes
                if ($reviewableProducts->contains('product_id', $item->product_id)) continue;
                $reviewableProducts->push([
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product_name,
                    'order_id'     => $order->id,
                    'order_number' => $order->number,
                ]);
            }
        }

        return Inertia::render('Customer/Reviews', [
            'customer'           => $this->customerData($customer),
            'reviews'            => $myReviews,
            'reviewableProducts' => $reviewableProducts->values(),
        ]);
    }

    public function storeReview(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'required|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'content'    => 'required|string|min:10|max:1000',
        ]);

        // Vérifier que la commande appartient au client
        $order = Order::with('items')->findOrFail($request->order_id);
        $ownsOrder = $order->customer_id === $customer->id
            || ($order->customer && $order->customer->email === $customer->email);
        abort_if(!$ownsOrder, 403);

        // Vérifier que le produit était bien dans cette commande
        $hasProduct = $order->items->contains('product_id', (int) $request->product_id);
        abort_if(!$hasProduct, 403);

        // Un seul avis par produit par client
        $alreadyReviewed = Review::where('customer_id', $customer->id)
            ->where('product_id', $request->product_id)
            ->exists();
        if ($alreadyReviewed) {
            return back()->withErrors(['content' => 'Vous avez déjà laissé un avis pour ce produit.']);
        }

        Review::create([
            'customer_id'       => $customer->id,
            'order_id'          => $request->order_id,
            'product_id'        => $request->product_id,
            'author'            => $customer->first_name . ' ' . substr($customer->last_name, 0, 1) . '.',
            'rating'            => $request->rating,
            'content'           => $request->content,
            'is_active'         => false,
            'verified_purchase' => true,
        ]);

        return back()->with('success', 'Merci pour votre avis ! Il sera visible après validation.');
    }

    // ── Codes promo ───────────────────────────────────────────────────────────

    public function showPromos(Request $request)
    {
        $customer = Customer::findOrFail(session('customer_id'));

        $promos = DiscountCode::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')->orWhereColumn('used_count', '<', 'max_uses');
            })
            ->select('code', 'type', 'value', 'min_amount', 'expires_at')
            ->get()
            ->map(fn($c) => [
                'code'             => $c->code,
                'type'             => $c->type,
                'value'            => $c->value,
                'min_order_amount' => $c->min_amount,
                'expires_at'       => $c->expires_at?->format('d/m/Y'),
            ]);

        return Inertia::render('Customer/Promos', [
            'customer' => $this->customerData($customer),
            'promos'   => $promos,
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function getCustomerOrders(Customer $customer)
    {
        return Order::where(function ($q) use ($customer) {
                $q->where('customer_id', $customer->id)
                  ->orWhereHas('customer', fn($sq) => $sq->where('email', $customer->email));
            })
            ->with(['items', 'returnRequest'])
            ->latest()
            ->get()
            ->map(fn($o) => [
                'id'              => $o->id,
                'number'          => $o->number,
                'status'          => $o->status,
                'total'           => $o->total,
                'shipping'        => $o->shipping,
                'tracking_number' => $o->tracking_number,
                'created_at'      => $o->created_at->format('d/m/Y'),
                'return_request'  => $o->returnRequest ? [
                    'status'      => $o->returnRequest->status,
                    'admin_notes' => $o->returnRequest->admin_notes,
                ] : null,
                'items'           => $o->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'quantity'     => $i->quantity,
                    'total'        => $i->total,
                ]),
            ]);
    }

    // ── Retours ───────────────────────────────────────────────────────────────

    public function storeReturn(Request $request, Order $order)
    {
        $customerId = (int) session('customer_id');
        $customer   = Customer::findOrFail($customerId);
        $order->loadMissing('customer');

        // Vérifie que la commande appartient au client (par ID ou par email)
        $ownsOrder = (int) $order->customer_id === $customerId
            || ($order->customer && $order->customer->email === $customer->email);

        if (!$ownsOrder || $order->status !== 'delivered') {
            abort(403);
        }

        // Un seul retour par commande
        if ($order->returnRequest()->exists()) {
            return back()->with('error', 'Une demande de retour existe déjà pour cette commande.');
        }

        $data = $request->validate([
            'reason'  => 'required|string|max:255',
            'message' => 'nullable|string|max:1000',
        ]);

        $returnRequest = ReturnRequest::create([
            'order_id'    => $order->id,
            'customer_id' => $customerId,
            'reason'      => $data['reason'],
            'message'     => $data['message'] ?? null,
            'status'      => 'pending',
        ]);

        // Notification à l'admin
        $adminEmail = config('mail.admin_address', env('ADMIN_EMAIL', env('MAIL_FROM_ADDRESS')));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new ReturnRequestMail($returnRequest));
        }

        return back()->with('success', 'Votre demande de retour a bien été envoyée. Nous vous répondrons sous 48h.');
    }

    private function customerData(Customer $customer): array
    {
        return [
            'first_name' => $customer->first_name,
            'last_name'  => $customer->last_name,
            'email'      => $customer->email,
            'phone'      => $customer->phone ?? '',
        ];
    }
}
