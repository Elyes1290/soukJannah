<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $recentOrders = Order::with('customer')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'         => $o->id,
                'number'     => $o->number,
                'status'     => $o->status,
                'total'      => $o->total,
                'customer'   => $o->customer?->full_name ?? 'Client inconnu',
                'created_at' => $o->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'orders'    => Order::count(),
                'products'  => Product::count(),
                'customers' => Customer::distinct('email')->count('email'),
                'revenue'   => Order::whereIn('status', ['paid', 'preparing', 'shipped', 'delivered'])->sum('total'),
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
