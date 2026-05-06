<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $paidStatuses = ['paid', 'preparing', 'shipped', 'delivered'];
        $now          = now();

        // ── Revenus globaux ──────────────────────────────────────────────────
        $revenueTotal     = Order::whereIn('status', $paidStatuses)->sum('total');
        $revenueThisMonth = Order::whereIn('status', $paidStatuses)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('total');
        $revenueLastMonth = Order::whereIn('status', $paidStatuses)
            ->whereYear('created_at', $now->copy()->subMonth()->year)
            ->whereMonth('created_at', $now->copy()->subMonth()->month)
            ->sum('total');
        $revenueThisYear  = Order::whereIn('status', $paidStatuses)
            ->whereYear('created_at', $now->year)
            ->sum('total');

        // Variation mois vs mois précédent
        $monthGrowth = $revenueLastMonth > 0
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : null;

        // ── Commandes ────────────────────────────────────────────────────────
        $ordersCount       = Order::count();
        $ordersThisMonth   = Order::whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)->count();
        $paidOrdersCount   = Order::whereIn('status', $paidStatuses)->count();
        $avgOrderValue     = $paidOrdersCount > 0 ? round($revenueTotal / $paidOrdersCount, 2) : 0;
        $refundedAmount    = Order::where('status', 'refunded')->sum('total');
        $refundedCount     = Order::where('status', 'refunded')->count();

        // Répartition par statut
        $byStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // ── Revenus 6 derniers mois ──────────────────────────────────────────
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $rev   = Order::whereIn('status', $paidStatuses)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total');
            $monthlyRevenue[] = [
                'label'   => $month->locale('fr')->isoFormat('MMM YY'),
                'revenue' => round((float) $rev, 2),
            ];
        }

        // ── Top 5 produits ───────────────────────────────────────────────────
        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->whereIn('orders.status', $paidStatuses)
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as qty'),
                DB::raw('SUM(order_items.price * order_items.quantity) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'name'    => $p->name,
                'qty'     => (int) $p->qty,
                'revenue' => round((float) $p->revenue, 2),
            ]);

        // ── Commandes récentes ───────────────────────────────────────────────
        $recentOrders = Order::with('customer')
            ->orderByDesc('created_at')
            ->limit(8)
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
                'orders'           => $ordersCount,
                'orders_month'     => $ordersThisMonth,
                'products'         => Product::count(),
                'customers'        => Customer::distinct('email')->count('email'),
                'revenue'          => round((float) $revenueTotal, 2),
                'revenue_month'    => round((float) $revenueThisMonth, 2),
                'revenue_year'     => round((float) $revenueThisYear, 2),
                'revenue_last_month' => round((float) $revenueLastMonth, 2),
                'month_growth'     => $monthGrowth,
                'avg_order'        => $avgOrderValue,
                'refunded_amount'  => round((float) $refundedAmount, 2),
                'refunded_count'   => $refundedCount,
                'by_status'        => $byStatus,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'topProducts'    => $topProducts,
            'recentOrders'   => $recentOrders,
        ]);
    }
}
