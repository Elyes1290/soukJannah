import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';

const STATUS_STYLES = {
    paid:      { label_en: 'Paid',      label_fr: 'Payé',      color: '#16a34a', bg: '#F0F9F0', border: '#bbf7d0' },
    shipped:   { label_en: 'Shipped',   label_fr: 'Expédié',   color: '#2563eb', bg: '#EFF6FF', border: '#bfdbfe' },
    refunded:  { label_en: 'Refunded',  label_fr: 'Remboursé', color: '#d97706', bg: '#FFF7ED', border: '#fed7aa' },
    cancelled: { label_en: 'Cancelled', label_fr: 'Annulé',    color: '#dc2626', bg: '#FEF2F2', border: '#fecaca' },
    disputed:  { label_en: 'Disputed',  label_fr: 'Contesté',  color: '#9333ea', bg: '#FDF4FF', border: '#e9d5ff' },
};

function StatusBadge({ status, lang }) {
    const s = STATUS_STYLES[status] || { label_en: status, label_fr: status, color: '#6B6560', bg: '#F5F2EE', border: '#E8E2D9' };
    return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}>
            {lang === 'fr' ? s.label_fr : s.label_en}
        </span>
    );
}

function OrderCard({ order, lang, t }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border" style={{ borderColor: '#E8E2D9' }}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 cursor-pointer" style={{ backgroundColor: open ? '#F0EBE1' : '#FAF8F4' }} onClick={() => setOpen(!open)}>
                <div className="flex flex-wrap gap-6">
                    <div>
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{t('account_order_number')}</p>
                        <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{order.number}</p>
                    </div>
                    <div>
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{t('account_order_date')}</p>
                        <p className="text-sm font-light" style={{ color: '#1A1A1A' }}>{order.created_at}</p>
                    </div>
                    <div>
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>Total</p>
                        <p className="text-sm font-semibold" style={{ color: '#C8A96E' }}>{parseFloat(order.total).toFixed(2)} CHF</p>
                    </div>
                    <div>
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{t('account_order_items_count')}</p>
                        <p className="text-sm font-light" style={{ color: '#1A1A1A' }}>{order.items.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} lang={lang} />
                    <svg className="w-4 h-4 transition-transform flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#9A9490' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {open && (
                <div className="p-5 border-t" style={{ borderColor: '#E8E2D9' }}>
                    <div className="space-y-2 mb-5">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm py-2 border-b" style={{ borderColor: '#F0EBE1' }}>
                                <span style={{ color: '#1A1A1A' }}>
                                    {item.product_name}
                                    <span className="ml-2 font-light" style={{ color: '#9A9490' }}>×{item.quantity}</span>
                                </span>
                                <span className="font-medium" style={{ color: '#1A1A1A' }}>{parseFloat(item.total).toFixed(2)} CHF</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-light" style={{ color: '#9A9490' }}>{t('account_shipping')}</span>
                        <span style={{ color: order.shipping == 0 ? '#C8A96E' : '#1A1A1A' }}>
                            {order.shipping == 0 ? (lang === 'fr' ? 'Gratuite ✓' : 'Free ✓') : `${parseFloat(order.shipping).toFixed(2)} CHF`}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2 mb-4" style={{ borderColor: '#E8E2D9' }}>
                        <span style={{ color: '#1A1A1A' }}>Total</span>
                        <span style={{ color: '#C8A96E' }}>{parseFloat(order.total).toFixed(2)} CHF</span>
                    </div>

                    {order.tracking_number && (
                        <div className="p-4 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: '#9A9490' }}>{t('account_tracking')}</p>
                            <p className="text-base font-semibold tracking-wider" style={{ color: '#1A1A1A' }}>{order.tracking_number}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const FILTERS = (t) => [
    { key: 'all',       label: t('account_filter_all') },
    { key: 'paid',      label: t('account_filter_paid') },
    { key: 'shipped',   label: t('account_filter_shipped') },
    { key: 'refunded',  label: t('account_filter_refunded') },
    { key: 'cancelled', label: t('account_filter_cancelled') },
];

export default function CustomerOrders({ orders }) {
    const { t, lang } = useT();
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);

    return (
        <CustomerLayout title={t('account_my_orders')}>
            <Head title={`${t('account_nav_orders')} — SoukJannah`} />

            {/* Filtres */}
            <div className="flex gap-2 flex-wrap mb-6">
                {FILTERS(t).map(f => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className="px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors"
                        style={{
                            borderColor: activeFilter === f.key ? '#1A1A1A' : '#E8E2D9',
                            backgroundColor: activeFilter === f.key ? '#1A1A1A' : 'transparent',
                            color: activeFilter === f.key ? 'white' : '#6B6560',
                            letterSpacing: '0.08em',
                        }}
                    >
                        {f.label}
                        {f.key !== 'all' && orders.filter(o => o.status === f.key).length > 0 && (
                            <span className="ml-1.5 text-[10px] opacity-70">({orders.filter(o => o.status === f.key).length})</span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 border" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-3xl mb-3">🛍</p>
                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                        {activeFilter === 'all' ? t('account_no_orders') : t('account_no_orders_filter')}
                    </p>
                    {activeFilter === 'all' && (
                        <Link href="/boutique" className="inline-block mt-5 px-8 py-3 text-xs font-medium uppercase" style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}>
                            {t('account_shop_now')}
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <OrderCard key={order.id} order={order} lang={lang} t={t} />
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
