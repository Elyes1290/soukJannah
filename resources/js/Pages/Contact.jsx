import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';
import { docTitle, withBrand } from '../i18n/docTitle';

export default function Contact() {
    const { t, lang } = useT();
    const { flash, supportEmail } = usePage().props;
    const sent = flash?.contact_success || false;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        locale: lang,
    });

    useEffect(() => setData('locale', lang), [lang]);

    const submit = (e) => {
        e.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    const inputStyle = {
        width: '100%',
        border: '1px solid #D4CFC8',
        backgroundColor: 'white',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        color: '#1A1A1A',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const CONTACT_INFO = [
        {
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
            label: t('contact_email_label'),
            value: supportEmail || 'support@soukjannah.com',
        },
        {
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: t('contact_response_label'),
            value: t('contact_response_value'),
        },
        {
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            ),
            label: t('contact_location_label'),
            value: t('country_CH'),
        },
    ];

    const FAQ = [
        { q: t('contact_faq_q1'), a: t('contact_faq_a1') },
        { q: t('contact_faq_q2'), a: t('contact_faq_a2') },
        { q: t('contact_faq_q3'), a: t('contact_faq_a3') },
        { q: t('contact_faq_q4'), a: t('contact_faq_a4') },
    ];

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('contact_title'))}>
                <meta head-key="description" name="description" content={t('meta_contact', withBrand(t))} />
            </Head>
            <section className="border-b py-24 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('contact_tag')}</p>
                <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('contact_h1')}</h1>
                <div className="h-px w-10 mx-auto mt-4 mb-5" style={{ backgroundColor: '#C8A96E' }}></div>
                <p className="text-sm font-light" style={{ color: '#9A9490' }}>{t('contact_reply')}</p>
            </section>

            <div className="max-w-5xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    <div className="space-y-10">
                        <div>
                            <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('contact_details_tag')}</p>
                            <div className="space-y-5">
                                {CONTACT_INFO.map((info) => (
                                    <div key={info.label} className="flex items-start gap-3">
                                        <span className="mt-0.5 flex-shrink-0" style={{ color: '#C8A96E' }}>{info.icon}</span>
                                        <div>
                                            <p className="text-xs font-light mb-0.5" style={{ color: '#9A9490' }}>{info.label}</p>
                                            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{info.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('contact_faq_tag')}</p>
                            <div className="space-y-5">
                                {FAQ.map((item) => (
                                    <div key={item.q} className="border-b pb-5" style={{ borderColor: '#E8E2D9' }}>
                                        <p className="text-xs font-medium mb-2" style={{ color: '#1A1A1A' }}>{item.q}</p>
                                        <p className="text-xs font-light leading-relaxed" style={{ color: '#6B6560' }}>{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <p className="text-xs tracking-[0.4em] uppercase mb-8 font-light" style={{ color: '#C8A96E' }}>{t('contact_form_tag')}</p>

                        {sent ? (
                            <div className="py-12 px-8 border text-center" style={{ borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.05)' }}>
                                <svg className="w-10 h-10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#C8A96E' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-serif text-xl mb-2" style={{ color: '#1A1A1A' }}>{t('contact_success_title')}</p>
                                <p className="text-sm font-light" style={{ color: '#6B6560' }}>{t('contact_success_desc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>{t('contact_name')}</label>
                                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} style={{ ...inputStyle, borderColor: errors.name ? '#E07070' : '#D4CFC8' }} onFocus={(e) => e.target.style.borderColor = '#C8A96E'} onBlur={(e) => e.target.style.borderColor = errors.name ? '#E07070' : '#D4CFC8'} placeholder={t('contact_placeholder_name')} required />
                                        {errors.name && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>{t('contact_email')}</label>
                                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} style={{ ...inputStyle, borderColor: errors.email ? '#E07070' : '#D4CFC8' }} onFocus={(e) => e.target.style.borderColor = '#C8A96E'} onBlur={(e) => e.target.style.borderColor = errors.email ? '#E07070' : '#D4CFC8'} placeholder={t('contact_placeholder_email')} required />
                                        {errors.email && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>{t('contact_subject')}</label>
                                    <select value={data.subject} onChange={(e) => setData('subject', e.target.value)} style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.subject ? '#E07070' : '#D4CFC8' }} onFocus={(e) => e.target.style.borderColor = '#C8A96E'} onBlur={(e) => e.target.style.borderColor = errors.subject ? '#E07070' : '#D4CFC8'} required>
                                        <option value="">{t('contact_subject_placeholder')}</option>
                                        <option value="commande">{t('contact_subject_order')}</option>
                                        <option value="produit">{t('contact_subject_product')}</option>
                                        <option value="livraison">{t('contact_subject_delivery')}</option>
                                        <option value="partenariat">{t('contact_subject_partner')}</option>
                                        <option value="autre">{t('contact_subject_other')}</option>
                                    </select>
                                    {errors.subject && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>{t('contact_message')}</label>
                                    <textarea value={data.message} onChange={(e) => setData('message', e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: '160px', borderColor: errors.message ? '#E07070' : '#D4CFC8' }} onFocus={(e) => e.target.style.borderColor = '#C8A96E'} onBlur={(e) => e.target.style.borderColor = errors.message ? '#E07070' : '#D4CFC8'} placeholder={t('contact_message_placeholder')} required />
                                    {errors.message && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.message}</p>}
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={processing} className="btn-primary" style={{ letterSpacing: '0.15em', opacity: processing ? 0.6 : 1 }}>
                                        {processing ? t('contact_sending') : t('contact_send')}
                                    </button>
                                    <p className="text-xs font-light mt-3" style={{ color: '#9A9490' }}>{t('contact_guarantee')}</p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
