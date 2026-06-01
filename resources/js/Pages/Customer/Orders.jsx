import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

const RETURN_REASON_IDS = [
    'damaged_receipt',
    'not_as_described',
    'wrong_item',
    'defective',
    'not_satisfied',
    'other',
];

const CUSTOMER_ORDER_STATUS_STYLES = {
    paid: { color: '#16a34a', bg: '#F0F9F0', border: '#bbf7d0' },
    shipped: { color: '#2563eb', bg: '#EFF6FF', border: '#bfdbfe' },
    refunded: { color: '#d97706', bg: '#FFF7ED', border: '#fed7aa' },
    cancelled: { color: '#dc2626', bg: '#FEF2F2', border: '#fecaca' },
    disputed: { color: '#9333ea', bg: '#FDF4FF', border: '#e9d5ff' },
};

const DEFAULT_STATUS_STYLE = { color: '#6B6560', bg: '#F5F2EE', border: '#E8E2D9' };

function StatusBadge({ status, t }) {
    const s = CUSTOMER_ORDER_STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;
    const key = `tracking_order_status_${status}`;
    const translated = t(key);
    const label = translated === key ? status : translated;
    return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full border" style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}>
            {label}
        </span>
    );
}

const RETURN_STATUS_STYLE = {
    pending: { color: '#C8A96E', bg: '#FFF8ED' },
    approved: { color: '#7B9E87', bg: '#F0F7F2' },
    rejected: { color: '#E07070', bg: '#FEF2F2' },
};

function ReturnModal({ order, onClose, t }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        reasonId: RETURN_REASON_IDS[0],
        message: '',
    });

    useEffect(() => {
        transform((d) => ({
            reason: t(`return_reason_${d.reasonId}`),
            message: d.message,
        }));
    }, [t, transform]);

    const submit = (e) => {
        e.preventDefault();
        post(`/mon-compte/commandes/${order.id}/retour`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white w-full max-w-md" style={{ borderColor: '#E8E2D9' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E8E2D9' }}>
                    <h3 className="font-serif text-base" style={{ color: '#1A1A1A' }}>
                        {t('account_return_modal_title')}
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        {t('account_return_intro', { number: order.number })}
                    </p>

                    <div>
                        <label htmlFor={`return-reason-${order.id}`} className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                            {t('account_return_reason_label')}
                        </label>
                        <select
                            id={`return-reason-${order.id}`}
                            value={data.reasonId}
                            onChange={e => setData('reasonId', e.target.value)}
                            className="w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                            style={{ borderColor: '#E8E2D9' }}
                        >
                            {RETURN_REASON_IDS.map(id => (
                                <option key={id} value={id}>{t(`return_reason_${id}`)}</option>
                            ))}
                        </select>
                        {errors.reason && <p className="text-xs mt-1 text-red-600">{errors.reason}</p>}
                    </div>

                    <div>
                        <label htmlFor={`return-msg-${order.id}`} className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                            {t('account_return_message_optional')}
                        </label>
                        <textarea
                            id={`return-msg-${order.id}`}
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            rows={3}
                            placeholder={t('account_return_placeholder')}
                            className="w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                            style={{ borderColor: '#E8E2D9' }}
                        />
                        {errors.message && <p className="text-xs mt-1 text-red-600">{errors.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-xs font-medium border" style={{ borderColor: '#E8E2D9', color: '#6B6560' }}>
                            {t('account_return_cancel')}
                        </button>
                        <button type="submit" disabled={processing} className="flex-1 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: '#1A1A1A', color: '#FAF8F4', opacity: processing ? 0.6 : 1 }}>
                            {processing ? t('account_return_sending') : t('account_return_submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function OrderCard({ order, t }) {
    const [open, setOpen] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);

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
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{t('account_order_total')}</p>
                        <p className="text-sm font-semibold" style={{ color: '#C8A96E' }}>{parseFloat(order.total).toFixed(2)} CHF</p>
                    </div>
                    <div>
                        <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{t('account_order_items_count')}</p>
                        <p className="text-sm font-light" style={{ color: '#1A1A1A' }}>{order.items.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} t={t} />
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
                            {order.shipping == 0 ? t('account_shipping_free') : `${parseFloat(order.shipping).toFixed(2)} CHF`}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2 mb-4" style={{ borderColor: '#E8E2D9' }}>
                        <span style={{ color: '#1A1A1A' }}>{t('account_order_total')}</span>
                        <span style={{ color: '#C8A96E' }}>{parseFloat(order.total).toFixed(2)} CHF</span>
                    </div>

                    {order.tracking_number && (
                        <div className="p-4 border mb-4" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: '#9A9490' }}>{t('account_tracking')}</p>
                            <p className="text-base font-semibold tracking-wider" style={{ color: '#1A1A1A' }}>{order.tracking_number}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-3">
                        {['paid','preparing','shipped','delivered','refunded'].includes(order.status) && (
                            <a
                                href={`/mon-compte/commandes/${order.id}/facture`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#E8E2D9', color: '#6B6560' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                {t('account_invoice_download')}
                            </a>
                        )}

                        {order.status === 'delivered' && !order.return_request && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setShowReturnModal(true); }}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors hover:bg-red-50"
                                style={{ borderColor: '#E07070', color: '#E07070' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                                {t('account_return_modal_title')}
                            </button>
                        )}
                    </div>

                    {order.return_request && (() => {
                        const statusKey = order.return_request.status;
                        const cfg = RETURN_STATUS_STYLE[statusKey] ?? { color: '#C8A96E', bg: '#FAF8F4' };
                        const rk = `return_status_${statusKey}`;
                        const statusLabel = t(rk) === rk ? statusKey : t(rk);
                        return (
                            <div className="mt-4 p-4 border" style={{ borderColor: '#E8E2D9', backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                                <p className="text-xs font-medium mb-1" style={{ color: cfg.color }}>
                                    {t('account_return_request_prefix')} — {statusLabel}
                                </p>
                                {order.return_request.admin_notes && (
                                    <p className="text-xs font-light italic" style={{ color: '#6B6560' }}>
                                        &quot;{order.return_request.admin_notes}&quot;
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {showReturnModal && (
                <ReturnModal order={order} onClose={() => setShowReturnModal(false)} t={t} />
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
    const { t } = useT();
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);

    return (
        <CustomerLayout title={t('account_my_orders')}>
            <Head title={docTitle(t, t('account_nav_orders'))} />

            <div className="flex gap-2 flex-wrap mb-6">
                {FILTERS(t).map(f => (
                    <button
                        key={f.key}
                        type="button"
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
                        <OrderCard key={order.id} order={order} t={t} />
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
