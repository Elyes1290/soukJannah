import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';

function Section({ title, children }) {
    return (
        <div className="mb-10">
            <h2 className="font-serif text-xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{title}</h2>
            <div className="h-px w-8 mb-5" style={{ backgroundColor: '#C8A96E' }}></div>
            <div className="space-y-3 text-sm font-light leading-relaxed" style={{ color: '#6B6560' }}>
                {children}
            </div>
        </div>
    );
}

export default function Livraison() {
    const { t } = useT();

    return (
        <PublicLayout>
            <Head title={`${t('delivery_title')} — SoukJannah`}>
                <meta head-key="description" name="description" content={t('meta_delivery')} />
            </Head>
            {/* Fil d'ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        <Link href="/" className="hover:opacity-60 transition-opacity">{t('common_home')}</Link>
                        <span className="mx-2" style={{ color: '#C8A96E' }}>›</span>
                        <span style={{ color: '#1A1A1A' }}>{t('delivery_title')}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('delivery_practical_tag')}</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('delivery_h1')}</h1>
                    <div className="h-px w-10" style={{ backgroundColor: '#C8A96E' }}></div>
                </div>

                <Section title={t('delivery_times_title')}>
                    <p>{t('delivery_times_p1')}</p>
                    <p>{t('delivery_times_p2')}</p>
                    <ul className="mt-3 space-y-2">
                        {[
                            [t('delivery_country_ch'), t('delivery_delay_ch')],
                            [t('delivery_country_fr'), t('delivery_delay_fr')],
                            [t('delivery_country_be'), t('delivery_delay_be')],
                            [t('delivery_country_eu'), t('delivery_delay_eu')],
                        ].map(([country, delay]) => (
                            <li key={country} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#F0EBE1' }}>
                                <span>{country}</span>
                                <span className="font-medium" style={{ color: '#1A1A1A' }}>{delay}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title={t('delivery_costs_title')}>
                    <p>{t('delivery_costs_p1')}</p>
                    <p>{t('delivery_costs_p2')}</p>
                </Section>

                <Section title={t('delivery_tracking_title')}>
                    <p>{t('delivery_tracking_p1')}</p>
                    <p>{t('delivery_tracking_p2')}</p>
                </Section>

                <Section title={t('delivery_returns_title')}>
                    <p>{t('delivery_returns_p1')}</p>
                    <p>{t('delivery_returns_p2')}</p>
                    <ul className="mt-2 space-y-1 pl-4">
                        <li>— {t('delivery_returns_li1')}</li>
                        <li>— {t('delivery_returns_li2')}</li>
                        <li>— {t('delivery_returns_li3')}</li>
                    </ul>
                    <p className="mt-3">{t('delivery_returns_p3')}</p>
                </Section>

                <Section title={t('delivery_procedure_title')}>
                    <p>
                        {t('delivery_procedure_p1').split('contact page')[0]}
                        <Link href="/contact" className="underline hover:opacity-70 transition-opacity" style={{ color: '#C8A96E' }}>contact</Link>
                        {t('delivery_procedure_p1').includes('contact page') ? t('delivery_procedure_p1').split('contact page')[1] : ''}
                    </p>
                    <p>{t('delivery_procedure_p2')}</p>
                </Section>

                <Section title={t('delivery_refund_title')}>
                    <p>{t('delivery_refund_p1')}</p>
                </Section>

                <div className="mt-12 p-6 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                    <p className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>{t('delivery_question')}</p>
                    <p className="text-sm font-light mb-4" style={{ color: '#6B6560' }}>{t('delivery_question_desc')}</p>
                    <Link href="/contact" className="btn-primary text-xs" style={{ letterSpacing: '0.15em' }}>{t('delivery_contact_btn')}</Link>
                </div>
            </div>
        </PublicLayout>
    );
}
