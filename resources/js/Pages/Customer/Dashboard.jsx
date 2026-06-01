import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

const CUSTOMER_ORDER_STATUS_STYLES = {
    paid: { color: '#16a34a', bg: '#F0F9F0' },
    shipped: { color: '#2563eb', bg: '#EFF6FF' },
    refunded: { color: '#d97706', bg: '#FFF7ED' },
    cancelled: { color: '#dc2626', bg: '#FEF2F2' },
    disputed: { color: '#9333ea', bg: '#FDF4FF' },
};

const DEFAULT_STATUS_STYLE = { color: '#6B6560', bg: '#F5F2EE' };

function StatusBadge({ status, t }) {
    const s = CUSTOMER_ORDER_STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;
    const key = `tracking_order_status_${status}`;
    const translated = t(key);
    const label = translated === key ? status : translated;
    return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
            {label}
        </span>
    );
}

export default function CustomerDashboard({ customer, orders, stats }) {
    const { t } = useT();
    const recent = orders.slice(0, 3);

    return (
        <CustomerLayout>
            <Head title={docTitle(t, t('account_dashboard_title'))} />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: t('account_stat_orders'), value: stats.total },
                    { label: t('account_stat_shipped'), value: stats.shipped },
                    { label: t('account_stat_spent'), value: `${stats.spent.toFixed(2)} CHF` },
                ].map((s) => (
                    <div key={s.label} className="border p-4" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                        <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>{s.label}</p>
                        <p className="font-serif text-xl font-normal" style={{ color: '#1A1A1A' }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Commandes récentes */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#1A1A1A' }}>{t('account_recent_orders')}</p>
                <Link href="/mon-compte/commandes" className="text-xs underline transition-opacity hover:opacity-60" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>
                    {t('account_view_all')} →
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 border" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-3xl mb-3">🛍</p>
                    <p className="text-sm font-light mb-5" style={{ color: '#9A9490' }}>{t('account_no_orders')}</p>
                    <Link href="/boutique" className="inline-block px-8 py-3 text-xs font-medium uppercase" style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}>
                        {t('account_shop_now')}
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {recent.map(order => (
                        <div key={order.id} className="border p-4 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                            <div>
                                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{order.number}</p>
                                <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{order.created_at} · {parseFloat(order.total).toFixed(2)} CHF</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={order.status} t={t} />
                                {order.tracking_number && (
                                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>
                                        📦 {order.tracking_number}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {orders.length > 3 && (
                        <Link href="/mon-compte/commandes" className="block text-center py-3 text-xs font-medium uppercase border transition-colors hover:border-amber-600" style={{ borderColor: '#E8E2D9', color: '#6B6560', letterSpacing: '0.1em' }}>
                            {t('account_view_all_orders')}
                        </Link>
                    )}
                </div>
            )}
        </CustomerLayout>
    );
}
