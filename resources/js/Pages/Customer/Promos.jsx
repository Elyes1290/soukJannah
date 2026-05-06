import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';

function copyToClipboard(text, onCopied) {
    navigator.clipboard?.writeText(text).then(() => onCopied(text));
}

export default function CustomerPromos({ promos }) {
    const { t, lang } = useT();
    const [copied, setCopied] = useState('');

    const handleCopy = (code) => {
        copyToClipboard(code, (c) => {
            setCopied(c);
            setTimeout(() => setCopied(''), 2000);
        });
    };

    const formatValue = (type, value) => {
        if (type === 'percent') return `${value}%`;
        return `${value} CHF`;
    };

    return (
        <CustomerLayout title={t('account_nav_promos')}>
            <Head title={`${t('account_nav_promos')} — SoukJannah`} />

            {promos.length === 0 ? (
                <div className="text-center py-12 border" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-3xl mb-3">🎟</p>
                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>{t('promo_none')}</p>
                </div>
            ) : (
                <>
                    <p className="text-sm font-light mb-6" style={{ color: '#6B6560' }}>{t('promo_intro')}</p>
                    <div className="space-y-4">
                        {promos.map(promo => (
                            <div key={promo.code} className="border flex flex-wrap items-center justify-between gap-4 p-5" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                <div className="flex items-start gap-4">
                                    {/* Badge réduction */}
                                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center" style={{ backgroundColor: '#C8A96E' }}>
                                        <span className="text-white font-bold text-lg leading-none">{formatValue(promo.type, promo.value)}</span>
                                    </div>
                                    <div>
                                        <p className="font-mono text-base font-bold tracking-widest" style={{ color: '#1A1A1A' }}>{promo.code}</p>
                                        <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>
                                            {promo.type === 'percent'
                                                ? `${lang === 'fr' ? `${promo.value}% de réduction` : `${promo.value}% off`}`
                                                : `${promo.value} CHF ${lang === 'fr' ? 'de réduction' : 'discount'}`
                                            }
                                            {promo.min_order_amount > 0 && ` · ${lang === 'fr' ? `Dès ${promo.min_order_amount} CHF` : `From ${promo.min_order_amount} CHF`}`}
                                        </p>
                                        {promo.expires_at && (
                                            <p className="text-xs font-light mt-0.5" style={{ color: '#d97706' }}>
                                                {lang === 'fr' ? `Expire le ${promo.expires_at}` : `Expires ${promo.expires_at}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCopy(promo.code)}
                                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider border transition-colors"
                                    style={{
                                        borderColor: copied === promo.code ? '#16a34a' : '#D4CDBF',
                                        color: copied === promo.code ? '#16a34a' : '#1A1A1A',
                                        backgroundColor: copied === promo.code ? '#F0F9F0' : 'transparent',
                                    }}
                                >
                                    {copied === promo.code ? (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {t('promo_copied')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            {t('promo_copy')}
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </CustomerLayout>
    );
}
