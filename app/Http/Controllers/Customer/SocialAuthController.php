<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerSocialAccount;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirect(string $provider)
    {
        $this->validateProvider($provider);
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider, Request $request)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('customer.login')
                ->with('error', 'La connexion via ' . ucfirst($provider) . ' a échoué. Veuillez réessayer.');
        }

        // Check if this social account already exists
        $socialAccount = CustomerSocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialAccount) {
            // Existing social login → log in
            $customer = $socialAccount->customer;
            $socialAccount->update(['avatar' => $socialUser->getAvatar()]);
        } else {
            // Check if a customer exists with this email
            $customer = Customer::where('email', $socialUser->getEmail())->first();

            if ($customer) {
                // Link social account to existing customer
                $customer->socialAccounts()->create([
                    'provider'    => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar'      => $socialUser->getAvatar(),
                ]);

                // Verify email if not already
                if (!$customer->email_verified_at) {
                    $customer->update(['email_verified_at' => now()]);
                }
            } else {
                // Create new customer
                $nameParts = explode(' ', $socialUser->getName() ?? '', 2);
                $firstName = $nameParts[0] ?? '';
                $lastName  = $nameParts[1] ?? '';

                $customer = Customer::create([
                    'first_name'          => $firstName,
                    'last_name'           => $lastName,
                    'email'               => $socialUser->getEmail(),
                    'password'            => null,
                    'email_verified_at'   => now(),
                    'address'             => '',
                    'city'                => '',
                    'postal_code'         => '',
                    'country'             => 'CH',
                ]);

                $customer->socialAccounts()->create([
                    'provider'    => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar'      => $socialUser->getAvatar(),
                ]);
            }
        }

        // Log the customer in
        session(['customer_id' => $customer->id]);

        return redirect()->intended(route('customer.dashboard'));
    }

    private function validateProvider(string $provider): void
    {
        if (!in_array($provider, ['google'])) {
            abort(404);
        }
    }
}
