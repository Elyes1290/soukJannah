<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\TwoFactorMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()->is_admin && session('2fa_verified')) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials) && Auth::user()->is_admin) {
            $request->session()->regenerate();

            // Générer et envoyer le code 2FA
            $user = Auth::user();
            $code = $user->generateTwoFactorCode();

            try {
                Mail::to($user->email)->send(new TwoFactorMail($code, $user->name));
            } catch (\Exception $e) {
                Log::error('2FA mail failed: ' . $e->getMessage());
            }

            return redirect()->route('admin.2fa');
        }

        Auth::logout();

        return back()->withErrors([
            'email' => 'Identifiants incorrects ou accès non autorisé.',
        ]);
    }

    public function showTwoFactor()
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return redirect()->route('admin.login');
        }

        if (session('2fa_verified')) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/TwoFactor', [
            'email' => Auth::user()->email,
        ]);
    }

    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return redirect()->route('admin.login');
        }

        if (
            $user->two_factor_code !== $request->code ||
            !$user->two_factor_expires_at ||
            $user->two_factor_expires_at->isPast()
        ) {
            return back()->withErrors(['code' => 'Code incorrect ou expiré.']);
        }

        $user->clearTwoFactorCode();
        $request->session()->put('2fa_verified', true);

        return redirect()->route('admin.dashboard');
    }

    public function resendTwoFactor(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return redirect()->route('admin.login');
        }

        $code = $user->generateTwoFactorCode();

        try {
            Mail::to($user->email)->send(new TwoFactorMail($code, $user->name));
        } catch (\Exception $e) {
            Log::error('2FA resend failed: ' . $e->getMessage());
            return back()->withErrors(['code' => 'Impossible d\'envoyer le code. Réessayez.']);
        }

        return back()->with('success', 'Nouveau code envoyé.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
