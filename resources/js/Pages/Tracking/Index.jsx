import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle, withBrand } from '../../i18n/docTitle';

const STEP_KEYS = ['paid', 'preparing', 'shipped', 'delivered'];

function StatusBar({ step, t }) {
    if (step === 0) return null;
    return (
        <div className="w-full mb-8">
            <div className="flex items-center">
                {STEP_KEYS.map((stepKey, i) => {
                    const done = step > i + 1;
                    const current = step === i + 2;
                    const active = done || current;
                    return (
                        <div key={stepKey} className="flex-1 flex flex-col items-center">
                            <div className="flex items-center w-full">
                                {i > 0 && (
                                    <div className="flex-1 h-0.5" style={{ backgroundColor: done ? '#C8A96E' : '#E8E2D9' }} />
                                )}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors"
                                    style={{
                                        backgroundColor: active ? '#C8A96E' : '#F0EBE1',
                                        color: active ? '#fff' : '#9A9490',
                                        border: current ? '2px solid #C8A96E' : 'none',
                                    }}>
                                    {done ? '✓' : i + 2}
                                </div>
                                {i < STEP_KEYS.length - 1 && (
                                    <div className="flex-1 h-0.5" style={{ backgroundColor: done ? '#C8A96E' : '#E8E2D9' }} />
                                )}
                            </div>
                            <span className="text-xs mt-2 text-center font-medium"
                                style={{ color: active ? '#1A1A1A' : '#9A9490' }}>
                                {t(`tracking_step_${stepKey}`)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/** Statuts envoyés par le backend — libellés localisés côté front */
const ORDER_STATUSES_TRANSLATED = new Set([
    'pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed',
]);

function localizedOrderStatus(t, status, fallbackLabel) {
    const key = `tracking_order_status_${status}`;
    if (!ORDER_STATUSES_TRANSLATED.has(status)) {
        return fallbackLabel ?? status ?? '';
    }
    return t(key);
}

export default function TrackingIndex({ order, error, prefillNumber = '', trackingError = null }) {
    const { t } = useT();
    const { data, setData, post, processing } = useForm({ number: prefillNumber || '', email: '' });

    useEffect(() => {
        if (prefillNumber) {
            setData('number', prefillNumber);
        }
    }, [prefillNumber]);

    const submit = (e) => {
        e.preventDefault();
        post('/suivi');
    };

    const isCancelled = order?.status === 'cancelled' || order?.status === 'refunded';

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('tracking_page_title'))}>
                <meta head-key="description" name="description" content={t('meta_tracking', withBrand(t))} />
            </Head>
            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('brand_name')}</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('tracking_page_title')}</h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-2xl mx-auto px-4 py-16">

                <div className="bg-white border p-8 mb-10" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#C8A96E' }}>
                        {t('tracking_form_heading')}
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="tracking-order-number" className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                {t('tracking_order_number')}
                            </label>
                            <input
                                id="tracking-order-number"
                                type="text"
                                value={data.number}
                                onChange={e => setData('number', e.target.value.toUpperCase())}
                                placeholder={t('tracking_order_placeholder')}
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors uppercase"
                                style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                            <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                {t('tracking_order_hint')}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="tracking-order-email" className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                {t('tracking_order_email')}
                            </label>
                            <input
                                id="tracking-order-email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder={t('account_email_placeholder')}
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors"
                                style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                        </div>

                        {(error || trackingError) && (
                            <div className="p-3 border text-sm font-light" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                {error ?? (trackingError ? t(`tracking_err_${trackingError}`) : '')}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 text-xs font-medium uppercase transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}
                            onMouseEnter={e => !processing && (e.target.style.backgroundColor = '#C8A96E')}
                            onMouseLeave={e => !processing && (e.target.style.backgroundColor = '#1A1A1A')}
                        >
                            {processing ? '...' : t('tracking_submit')}
                        </button>
                    </form>
                </div>

                {order && (
                    <div className="space-y-6">
                        <div className="border p-6" style={{ borderColor: isCancelled ? '#dc2626' : '#C8A96E', borderLeftWidth: '4px' }}>
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: '#9A9490' }}>
                                        {t('tracking_result_order')}
                                    </p>
                                    <p className="text-xl font-mono font-semibold" style={{ color: '#1A1A1A' }}>
                                        {order.number}
                                    </p>
                                    <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                        {t('tracking_placed_on')} {order.created_at}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full"
                                        style={{
                                            backgroundColor: isCancelled ? '#fef2f2' : (order.status === 'delivered' ? 'rgba(123,158,135,0.12)' : 'rgba(200,169,110,0.12)'),
                                            color: isCancelled ? '#dc2626' : (order.status === 'delivered' ? '#7B9E87' : '#C8A96E'),
                                        }}>
                                        {localizedOrderStatus(t, order.status, order.status_label)}
                                    </span>
                                    <p className="text-sm font-medium mt-2" style={{ color: '#1A1A1A' }}>
                                        {Number(order.total).toFixed(2)} CHF
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!isCancelled && <StatusBar step={order.status_step} t={t} />}

                        {isCancelled && (
                            <div className="p-4 border text-sm font-light" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                {order.status === 'refunded' ? t('tracking_notes_refunded') : t('tracking_notes_cancelled')}
                            </div>
                        )}

                        {order.tracking_number && (
                            <div className="p-5 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                <p className="text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#C8A96E' }}>
                                    {t('tracking_carrier_heading')}
                                </p>
                                <p className="font-mono text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                                    {order.tracking_number}
                                </p>
                                <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                    {t('tracking_carrier_hint')}
                                </p>
                            </div>
                        )}

                        <div className="border" style={{ borderColor: '#E8E2D9' }}>
                            <div className="px-6 py-4 border-b" style={{ borderColor: '#F0EBE1', backgroundColor: '#FAF8F4' }}>
                                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#1A1A1A' }}>
                                    {t('tracking_items_heading')}
                                </p>
                            </div>
                            <div className="divide-y" style={{ borderColor: '#F0EBE1' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                                style={{ backgroundColor: '#F0EBE1', color: '#C8A96E' }}>
                                                {item.qty}
                                            </span>
                                            <span className="text-sm font-light" style={{ color: '#1A1A1A' }}>{item.name}</span>
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                                            {Number(item.price * item.qty).toFixed(2)} CHF
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                                {t('tracking_help_intro')}{' '}
                                <a href="/contact" className="underline hover:opacity-70 transition-opacity" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>
                                    {t('tracking_help_contact')}
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
