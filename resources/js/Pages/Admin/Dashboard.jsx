import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

const STATUS_CONFIG = {
    pending:   { color: '#C8A96E', label: 'En attente' },
    paid:      { color: '#8B9EC8', label: 'Payée' },
    preparing: { color: '#9B87C8', label: 'En prép.' },
    shipped:   { color: '#6B6560', label: 'Expédiée' },
    delivered: { color: '#7B9E87', label: 'Livrée' },
    cancelled: { color: '#E07070', label: 'Annulée' },
    refunded:  { color: '#9A9490', label: 'Remboursée' },
    disputed:  { color: '#E08C3C', label: 'Litige' },
};

function StatCard({ label, value, sub, tone, href }) {
    const colors = { gold: '#C8A96E', green: '#7B9E87', blue: '#8B9EC8', red: '#E07070', gray: '#9A9490' };
    const c = colors[tone] || colors.gold;
    const content = (
        <div className="bg-white border p-5 h-full" style={{ borderColor: '#E8E2D9' }}>
            <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>{label}</p>
            <p className="text-2xl font-serif" style={{ color: '#1A1A1A' }}>{value}</p>
            {sub && <p className="text-xs mt-1 font-light" style={{ color: c }}>{sub}</p>}
        </div>
    );
    return href ? <Link href={href} className="block">{content}</Link> : <div>{content}</div>;
}

function RevenueChart({ months }) {
    const max = Math.max(...months.map(m => m.revenue), 1);
    return (
        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
            <p className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#9A9490' }}>
                Revenus — 6 derniers mois
            </p>
            <div className="flex items-end gap-2 h-32">
                {months.map((m, i) => {
                    const pct = Math.max((m.revenue / max) * 100, 2);
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-light" style={{ color: '#9A9490', fontSize: '10px' }}>
                                {m.revenue > 0 ? `${m.revenue.toFixed(0)}` : ''}
                            </span>
                            <div className="w-full rounded-sm" style={{ height: `${pct}%`, backgroundColor: i === months.length - 1 ? '#C8A96E' : '#E8E2D9', minHeight: 4 }} />
                            <span className="text-xs font-light capitalize" style={{ color: '#9A9490', fontSize: '10px' }}>{m.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, monthlyRevenue = [], topProducts = [], recentOrders = [] }) {
    const growth = stats.month_growth;
    const growthLabel = growth !== null && growth !== undefined
        ? (growth >= 0 ? `+${growth}% vs mois dernier` : `${growth}% vs mois dernier`)
        : null;
    const growthColor = growth >= 0 ? '#7B9E87' : '#E07070';

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* ── Section principale ───────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <StatCard label="Commandes totales"   value={stats.orders}    sub={`${stats.orders_month} ce mois`} tone="gold"  href="/admin/commandes" />
                <StatCard label="Clients uniques"     value={stats.customers} tone="blue" href="/admin/commandes" />
                <StatCard label="Produits"            value={stats.products}  tone="green" href="/admin/produits" />
                <StatCard
                    label="Panier moyen"
                    value={`${parseFloat(stats.avg_order).toFixed(2)} CHF`}
                    tone="gold"
                />
            </div>

            {/* ── Comptabilité ─────────────────────────────────── */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>Comptabilité</p>
                    <a
                        href="/admin/commandes/export/csv"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 transition-colors"
                        style={{ backgroundColor: '#1A1A1A', color: '#FAF8F4' }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Exporter CSV
                    </a>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                        label="Revenus ce mois"
                        value={`${parseFloat(stats.revenue_month).toFixed(2)} CHF`}
                        sub={growthLabel}
                        tone={growth >= 0 ? 'green' : 'red'}
                    />
                    <StatCard
                        label="Revenus cette année"
                        value={`${parseFloat(stats.revenue_year).toFixed(2)} CHF`}
                        tone="gold"
                    />
                    <StatCard
                        label="Revenus total"
                        value={`${parseFloat(stats.revenue).toFixed(2)} CHF`}
                        tone="gold"
                    />
                    <StatCard
                        label="Remboursements"
                        value={`${parseFloat(stats.refunded_amount).toFixed(2)} CHF`}
                        sub={`${stats.refunded_count} commande${stats.refunded_count > 1 ? 's' : ''}`}
                        tone="red"
                    />
                </div>
            </div>

            {/* ── Graphique + Top produits ──────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <RevenueChart months={monthlyRevenue} />

                <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                    <div className="px-6 py-4 border-b" style={{ borderColor: '#F0EBE1' }}>
                        <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>Top 5 produits</p>
                    </div>
                    {topProducts.length === 0 ? (
                        <p className="p-6 text-xs font-light" style={{ color: '#9A9490' }}>Aucune vente pour l'instant.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ borderColor: '#F5F2EE' }}>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Produit</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Qté</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>CA (CHF)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <tr key={i} className="border-b last:border-0" style={{ borderColor: '#F5F2EE' }}>
                                        <td className="px-5 py-3 text-xs font-light line-clamp-1" style={{ color: '#1A1A1A' }}>{p.name}</td>
                                        <td className="px-5 py-3 text-xs text-right font-light" style={{ color: '#6B6560' }}>{p.qty}</td>
                                        <td className="px-5 py-3 text-xs text-right font-medium" style={{ color: '#C8A96E' }}>{p.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Répartition statuts ───────────────────────────── */}
            {Object.keys(stats.by_status || {}).length > 0 && (
                <div className="bg-white border mb-4 p-5" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#9A9490' }}>Répartition par statut</p>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(stats.by_status).map(([status, count]) => {
                            const cfg = STATUS_CONFIG[status] || { color: '#9A9490', label: status };
                            return (
                                <div key={status} className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
                                    <span className="text-xs font-light" style={{ color: '#6B6560' }}>{cfg.label}</span>
                                    <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Commandes récentes ────────────────────────────── */}
            {recentOrders.length > 0 && (
                <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#F0EBE1' }}>
                        <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>Dernières commandes</p>
                        <Link href="/admin/commandes" className="text-xs hover:opacity-60 transition-opacity" style={{ color: '#C8A96E' }}>Voir tout →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ borderColor: '#F5F2EE' }}>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>N°</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Client</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium hidden sm:table-cell" style={{ color: '#9A9490' }}>Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Statut</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => {
                                    const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.refunded;
                                    return (
                                        <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: '#F5F2EE' }}>
                                            <td className="px-5 py-3">
                                                <Link href={`/admin/commandes/${order.id}`} className="font-mono text-xs font-medium hover:opacity-70" style={{ color: '#C8A96E' }}>
                                                    {order.number}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-light" style={{ color: '#1A1A1A' }}>{order.customer}</td>
                                            <td className="px-5 py-3 text-xs font-light hidden sm:table-cell" style={{ color: '#9A9490' }}>{order.created_at}</td>
                                            <td className="px-5 py-3">
                                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: `${sc.color}18`, color: sc.color }}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-medium text-right" style={{ color: '#1A1A1A' }}>
                                                {parseFloat(order.total).toFixed(2)} CHF
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
