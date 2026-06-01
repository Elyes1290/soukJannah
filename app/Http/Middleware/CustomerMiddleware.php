<?php

namespace App\Http\Middleware;

use App\Models\Customer;
use Closure;
use Illuminate\Http\Request;

class CustomerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $customerId = $request->session()->get('customer_id');

        if (! $customerId || ! Customer::find($customerId)) {
            $request->session()->forget('customer_id');

            return redirect()->route('customer.login')
                ->with('error', 'guest_login_required');
        }

        return $next($request);
    }
}
