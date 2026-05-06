import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

const RETURN_REASONS_FR = [
    'Produit endommagé à la réception',
    'Produit non conforme à la description',
    'Mauvais article reçu',
    'Produit défectueux',
    'Je ne suis pas satisfait(e)',
    'Autre',
];
const RETURN_REASONS_EN = [
    'Product damaged on receipt',
    'Product not as described',
    'Wrong item received',
    'Defective product',
    'Not satisfied',
    'Other',
];

const RETURN_STATUS_CONFIG = {
    pending:  { label_fr: 'En attente de traitement', label_en: 'Pending review', color: '#C8A96E', bg: '#FFF8ED' },
    approved: { label_fr: 'Retour approuvé',           label_en: 'Return approved', color: '#7B9E87', bg: '#F0F7F2' },
    rejected: { label_fr: 'Retour refusé',             label_en: 'Return rejected', color: '#E07070', bg: '#FEF2F2' },
};

function ReturnModal({ order, lang, onClose }) {
    const reasons = lang === 'fr' ? RETURN_REASONS_FR : RETURN_REASONS_EN;
    const { data, setData, post, processing, errors } = useForm({
        reason: reasons[0],
        message: '',
    });

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
                        {lang === 'fr' ? 'Demander un retour' : 'Request a return'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        {lang === 'fr'
                            ? `Commande ${order.number} — veuillez indiquer la raison de votre retour.`
                            : `Order ${order.number} — please indicate the reason for your return.`}
                    </p>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                            {lang === 'fr' ? 'Raison *' : 'Reason *'}
                        </label>
                        <select
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            className="w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                            style={{ borderColor: '#E8E2D9' }}
                        >
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                            {lang === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}
                        </label>
                        <textarea
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            rows={3}
                            placeholder={lang === 'fr' ? 'Décrivez votre problème...' : 'Describe your issue...'}
                            className="w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                            style={{ borderColor: '#E8E2D9' }}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-xs font-medium border" style={{ borderColor: '#E8E2D9', color: '#6B6560' }}>
                            {lang === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                        <button type="submit" disabled={processing} className="flex-1 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: '#1A1A1A', color: '#FAF8F4', opacity: processing ? 0.6 : 1 }}>
                            {processing
                                ? (lang === 'fr' ? 'Envoi...' : 'Sending...')
                                : (lang === 'fr' ? 'Envoyer la demande' : 'Submit request')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function OrderCard({ order, lang, t }) {
    const [open, setOpen] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const { props } = usePage();
    const flash = props.flash || {};

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
                        <div className="p-4 border mb-4" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: '#9A9490' }}>{t('account_tracking')}</p>
                            <p className="text-base font-semibold tracking-wider" style={{ color: '#1A1A1A' }}>{order.tracking_number}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap justify-end gap-3">
                        {/* Facture PDF */}
                        {['paid','preparing','shipped','delivered','refunded'].includes(order.status) && (
                            <a
                                href={`/mon-compte/commandes/${order.id}/facture`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors hover:bg-gray-50"
                                style={{ borderColor: '#E8E2D9', color: '#6B6560' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                {lang === 'fr' ? 'Télécharger la facture' : 'Download invoice'}
                            </a>
                        )}

                        {/* Demander un retour — seulement si livré et pas encore de demande */}
                        {order.status === 'delivered' && !order.return_request && (
                            <button
                                onClick={() => setShowReturnModal(true)}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors hover:bg-red-50"
                                style={{ borderColor: '#E07070', color: '#E07070' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                                {lang === 'fr' ? 'Demander un retour' : 'Request a return'}
                            </button>
                        )}
                    </div>

                    {/* Statut de la demande de retour existante */}
                    {order.return_request && (() => {
                        const cfg = RETURN_STATUS_CONFIG[order.return_request.status];
                        return (
                            <div className="mt-4 p-4 border" style={{ borderColor: '#E8E2D9', backgroundColor: cfg?.bg || '#FAF8F4', borderLeft: `3px solid ${cfg?.color || '#C8A96E'}` }}>
                                <p className="text-xs font-medium mb-1" style={{ color: cfg?.color || '#C8A96E' }}>
                                    {lang === 'fr' ? 'Demande de retour' : 'Return request'} —{' '}
                                    {lang === 'fr' ? cfg?.label_fr : cfg?.label_en}
                                </p>
                                {order.return_request.admin_notes && (
                                    <p className="text-xs font-light italic" style={{ color: '#6B6560' }}>
                                        "{order.return_request.admin_notes}"
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {showReturnModal && (
                <ReturnModal order={order} lang={lang} onClose={() => setShowReturnModal(false)} />
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
