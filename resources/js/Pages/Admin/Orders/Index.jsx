import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const STATUS_CONFIG = {
    pending:   { label: 'En attente',     bg: 'rgba(200,169,110,0.12)', color: '#C8A96E' },
    paid:      { label: 'Payée',          bg: 'rgba(139,158,200,0.12)', color: '#8B9EC8' },
    preparing: { label: 'En préparation', bg: 'rgba(155,135,200,0.12)', color: '#9B87C8' },
    shipped:   { label: 'Expédiée',       bg: 'rgba(107,101,96,0.12)',  color: '#6B6560' },
    delivered: { label: 'Livrée',         bg: 'rgba(123,158,135,0.12)', color: '#7B9E87' },
    cancelled: { label: 'Annulée',        bg: 'rgba(224,112,112,0.12)', color: '#E07070' },
    refunded:  { label: 'Remboursée',     bg: 'rgba(154,148,144,0.12)', color: '#9A9490' },
};

export default function OrdersIndex({ orders }) {
    return (
        <AdminLayout title="Commandes">
            <Head title="Commandes" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                    {orders.length} commande{orders.length > 1 ? 's' : ''}
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white border p-16 text-center" style={{ borderColor: '#E8E2D9' }}>
                    <div className="h-px w-8 mx-auto mb-6" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>Aucune commande</p>
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>Les commandes apparaîtront ici après les premiers achats.</p>
                </div>
            ) : (
                <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: '#F0EBE1' }}>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>N° commande</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Client</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Date</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Total</th>
                                <th className="px-5 py-3.5 text-left text-xs font-medium tracking-wider uppercase" style={{ color: '#9A9490' }}>Statut</th>
                                <th className="px-5 py-3.5"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.refunded;
                                return (
                                    <tr key={order.id} className="border-b group hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#F5F2EE' }}>
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-sm font-medium" style={{ color: '#1A1A1A' }}>
                                                {order.number}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-light" style={{ color: '#6B6560' }}>{order.customer}</td>
                                        <td className="px-5 py-4 text-xs font-light" style={{ color: '#9A9490' }}>{order.created_at}</td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                                                {parseFloat(order.total).toFixed(2)} CHF
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-block px-2.5 py-1 text-xs font-medium rounded-full"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/admin/commandes/${order.id}`}
                                                className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 justify-end"
                                                style={{ color: '#C8A96E' }}
                                            >
                                                Voir
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
