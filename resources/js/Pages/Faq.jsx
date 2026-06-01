import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';
import { docTitle, withBrand } from '../i18n/docTitle';

function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b" style={{ borderColor: '#E8E2D9' }}>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between py-4 text-left gap-4">
                <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{question}</span>
                <svg className="w-4 h-4 flex-shrink-0 transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'none', color: '#C8A96E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            {open && <p className="pb-5 text-sm font-light leading-relaxed" style={{ color: '#6B6560' }}>{answer}</p>}
        </div>
    );
}

export default function Faq() {
    const { t } = useT();

    const FAQS = [
        {
            category: t('faq_cat_orders'),
            items: [
                { q: t('faq_orders_q1'), a: t('faq_orders_a1') },
                { q: t('faq_orders_q2'), a: t('faq_orders_a2') },
                { q: t('faq_orders_q3'), a: t('faq_orders_a3') },
                { q: t('faq_orders_q4'), a: t('faq_orders_a4') },
            ],
        },
        {
            category: t('faq_cat_delivery'),
            items: [
                { q: t('faq_delivery_q1'), a: t('faq_delivery_a1') },
                { q: t('faq_delivery_q2'), a: t('faq_delivery_a2') },
                { q: t('faq_delivery_q3'), a: t('faq_delivery_a3') },
                { q: t('faq_delivery_q4'), a: t('faq_delivery_a4') },
            ],
        },
        {
            category: t('faq_cat_products'),
            items: [
                { q: t('faq_products_q1'), a: t('faq_products_a1') },
                { q: t('faq_products_q2'), a: t('faq_products_a2') },
                { q: t('faq_products_q3'), a: t('faq_products_a3') },
            ],
        },
        {
            category: t('faq_cat_returns'),
            items: [
                { q: t('faq_returns_q1'), a: t('faq_returns_a1') },
                { q: t('faq_returns_q2'), a: t('faq_returns_a2') },
            ],
        },
    ];

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('faq_title'))}>
                <meta head-key="description" name="description" content={t('meta_faq', withBrand(t))} />
            </Head>
            {/* Fil d'ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        <Link href="/" className="hover:opacity-60 transition-opacity">{t('common_home')}</Link>
                        <span className="mx-2" style={{ color: '#C8A96E' }}>›</span>
                        <span style={{ color: '#1A1A1A' }}>{t('faq_title')}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('faq_tag')}</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('faq_h1')}</h1>
                    <div className="h-px w-10" style={{ backgroundColor: '#C8A96E' }}></div>
                </div>

                <div className="space-y-10">
                    {FAQS.map((group) => (
                        <div key={group.category}>
                            <h2 className="text-xs tracking-[0.3em] uppercase font-medium mb-4" style={{ color: '#C8A96E' }}>{group.category}</h2>
                            <div>
                                {group.items.map((item) => (
                                    <FaqItem key={item.q} question={item.q} answer={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 p-6 border text-center" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                    <p className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>{t('faq_cannot_find')}</p>
                    <p className="text-sm font-light mb-5" style={{ color: '#6B6560' }}>{t('faq_team_reply')}</p>
                    <Link href="/contact" className="btn-primary text-xs" style={{ letterSpacing: '0.15em' }}>{t('faq_ask')}</Link>
                </div>
            </div>
        </PublicLayout>
    );
}
