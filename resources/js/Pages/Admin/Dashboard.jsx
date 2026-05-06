import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

const STAT_CONFIG = [
    {
        key: 'orders',
        label: 'Commandes',
        color: '#C8A96E',
        href: '/admin/commandes',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
        ),
    },
    {
        key: 'products',
        label: 'Produits',
        color: '#7B9E87',
        href: '/admin/produits',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        ),
    },
    {
        key: 'customers',
        label: 'Clients',
        color: '#8B9EC8',
        href: '/admin/commandes',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        key: 'revenue',
        label: 'Revenus (CHF)',
        color: '#C8A96E',
        href: '/admin/commandes',
        suffix: ' CHF',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
    },
];

const QUICK_LINKS = [
    { label: 'Ajouter un produit', href: '/admin/produits/create', desc: 'Créer un nouveau produit dans la boutique' },
    { label: 'Voir les commandes', href: '/admin/commandes', desc: 'Gérer les commandes en cours' },
    { label: 'Paramètres', href: '/admin/parametres', desc: 'Configurer la boutique et les pixels' },
];

const STATUS_CONFIG = {
    pending:   { bg: 'rgba(200,169,110,0.12)', color: '#C8A96E', label: 'En attente' },
    paid:      { bg: 'rgba(139,158,200,0.12)', color: '#8B9EC8', label: 'Payée' },
    preparing: { bg: 'rgba(155,135,200,0.12)', color: '#9B87C8', label: 'En préparation' },
    shipped:   { bg: 'rgba(107,101,96,0.12)',  color: '#6B6560', label: 'Expédiée' },
    delivered: { bg: 'rgba(123,158,135,0.12)', color: '#7B9E87', label: 'Livrée' },
    cancelled: { bg: 'rgba(224,112,112,0.12)', color: '#E07070', label: 'Annulée' },
    refunded:  { bg: 'rgba(154,148,144,0.12)', color: '#9A9490', label: 'Remboursée' },
    disputed:  { bg: 'rgba(224,140,60,0.12)',  color: '#E08C3C', label: 'Litige' },
};

export default function Dashboard({ stats, recentOrders = [] }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {STAT_CONFIG.map((cfg) => (
                    <Link key={cfg.key} href={cfg.href} className="group block">
                        <div className="bg-white border p-6 transition-all group-hover:shadow-sm" style={{ borderColor: '#E8E2D9' }}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded" style={{ backgroundColor: `${cfg.color}15` }}>
                                    <span style={{ color: cfg.color }}>{cfg.icon}</span>
                                </div>
                                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9A9490' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                            <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>{cfg.label}</p>
                            <p className="text-2xl font-serif font-normal" style={{ color: '#1A1A1A' }}>
                                {cfg.key === 'revenue' ? parseFloat(stats[cfg.key] ?? 0).toFixed(2) : (stats[cfg.key] ?? 0)}
                                {cfg.suffix && <span className="text-sm font-sans font-light" style={{ color: '#9A9490' }}> CHF</span>}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Raccourcis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {QUICK_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className="group block bg-white border p-6 transition-all hover:shadow-sm" style={{ borderColor: '#E8E2D9' }}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{link.label}</p>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: '#C8A96E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                        <p className="text-xs font-light" style={{ color: '#9A9490' }}>{link.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Commandes récentes */}
            {recentOrders.length > 0 ? (
                <div className="mt-6 bg-white border" style={{ borderColor: '#E8E2D9' }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#F0EBE1' }}>
                        <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>Dernières commandes</p>
                        <Link href="/admin/commandes" className="text-xs hover:opacity-60 transition-opacity" style={{ color: '#C8A96E' }}>
                            Voir tout →
                        </Link>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: '#F5F2EE' }}>
                                <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Numéro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium hidden sm:table-cell" style={{ color: '#9A9490' }}>Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => {
                                const sc = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.refunded;
                                return (
                                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F5F2EE' }}>
                                        <td className="px-6 py-3">
                                            <Link href={`/admin/commandes/${order.id}`} className="font-mono text-xs font-medium hover:opacity-70" style={{ color: '#C8A96E' }}>
                                                {order.number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-xs font-light" style={{ color: '#1A1A1A' }}>{order.customer}</td>
                                        <td className="px-6 py-3 text-xs font-light hidden sm:table-cell" style={{ color: '#9A9490' }}>{order.created_at}</td>
                                        <td className="px-6 py-3">
                                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-xs font-medium text-right" style={{ color: '#1A1A1A' }}>
                                            {parseFloat(order.total).toFixed(2)} CHF
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                stats.orders === 0 && stats.products === 0 && (
                    <div className="mt-8 border p-8 text-center" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                        <div className="h-px w-8 mx-auto mb-6" style={{ backgroundColor: '#C8A96E' }}></div>
                        <p className="font-serif text-lg mb-2" style={{ color: '#1A1A1A' }}>Bienvenue dans votre espace admin</p>
                        <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                            Commencez par ajouter vos premiers produits pour lancer la boutique.
                        </p>
                    </div>
                )
            )}
        </AdminLayout>
    );
}
