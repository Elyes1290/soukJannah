import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';
import { docTitle, withBrand } from '../i18n/docTitle';

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

export default function MentionsLegales() {
    const { t, lang } = useT();
    const { supportEmail } = usePage().props;
    const mail = supportEmail || 'support@soukjannah.com';

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('legal_title'))}>
                <meta head-key="description" name="description" content={t('meta_legal', withBrand(t))} />
            </Head>
            {/* Fil d'ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        <Link href="/" className="hover:opacity-60 transition-opacity">{t('common_home')}</Link>
                        <span className="mx-2" style={{ color: '#C8A96E' }}>›</span>
                        <span style={{ color: '#1A1A1A' }}>{t('legal_title')}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('legal_transparency')}</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('legal_h1')}</h1>
                    <div className="h-px w-10 mb-2" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        {t('legal_updated')} {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <Section title={t('legal_publisher_title')}>
                    <p>{t('legal_publisher_p1')}</p>
                    <div className="mt-3 p-4 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                        <p><strong style={{ color: '#1A1A1A' }}>{t('brand_name')}</strong></p>
                        <p>{t('legal_publisher_country')}</p>
                        <p>{t('legal_publisher_email_label')} :{' '}
                            <a href={`mailto:${mail}`} className="underline hover:opacity-70" style={{ color: '#C8A96E' }}>{mail}</a>
                        </p>
                    </div>
                    <p className="mt-3 text-xs italic" style={{ color: '#9A9490' }}>{t('legal_publisher_note')}</p>
                </Section>

                <Section title={t('legal_hosting_title')}>
                    <p>{t('legal_hosting_p1')}</p>
                    <p className="mt-2">
                        <strong style={{ color: '#1A1A1A' }}>{t('legal_hosting_provider')}</strong><br />
                        {t('legal_hosting_address')}<br />
                        <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70" style={{ color: '#C8A96E' }}>{t('legal_hosting_site')}</a>
                    </p>
                </Section>

                <Section title={t('legal_ip_title')}>
                    <p>{t('legal_ip_p1', withBrand(t))}</p>
                    <p>{t('legal_ip_p2')}</p>
                </Section>

                <Section title={t('legal_data_title')}>
                    <p>{t('legal_data_p1')}</p>
                    <p>{t('legal_data_p2')}</p>
                    <p>{t('legal_data_p3')} <a href={`mailto:${mail}`} className="underline hover:opacity-70" style={{ color: '#C8A96E' }}>{mail}</a></p>
                </Section>

                <Section title={t('legal_cookies_title')}>
                    <p>{t('legal_cookies_p1')}</p>
                    <p>{t('legal_cookies_p2')}</p>
                </Section>

                <Section title={t('legal_payment_title')}>
                    <p>{t('legal_payment_p1')}</p>
                </Section>

                <Section title={t('legal_law_title')}>
                    <p>{t('legal_law_p1')}</p>
                </Section>
            </div>
        </PublicLayout>
    );
}
