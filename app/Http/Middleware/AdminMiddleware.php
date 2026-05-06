<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            return redirect()->route('admin.login');
        }

        // Vérifier que le 2FA a été validé pour cette session
        if (!$request->session()->get('2fa_verified')) {
            return redirect()->route('admin.2fa');
        }

        return $next($request);
    }
}
