import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';

export default function About() {
    const { t } = useT();

    const VALUES = [
        { icon: '◇', title: t('about_val1_title2'), desc: t('about_val1_desc2') },
        { icon: '◈', title: t('about_val2_title2'), desc: t('about_val2_desc2') },
        { icon: '○', title: t('about_val3_title2'), desc: t('about_val3_desc2') },
        { icon: '✦', title: t('about_val4_title2'), desc: t('about_val4_desc2') },
    ];

    return (
        <PublicLayout>
            <Head title={`${t('about_title')} — SoukJannah`} />

            {/* Hero */}
            <section className="border-b py-24 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('about_tag')}</p>
                <h1 className="font-serif text-4xl md:text-5xl font-normal mb-6" style={{ color: '#1A1A1A', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                    {t('about_h1')}
                </h1>
                <div className="h-px w-10 mx-auto" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            {/* Histoire */}
            <section className="max-w-3xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('about_project_tag')}</p>
                        <h2 className="font-serif text-2xl font-normal mb-6" style={{ color: '#1A1A1A' }}>{t('about_project_h2')}</h2>
                        <div className="h-px w-8 mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                        <div className="space-y-4 font-light leading-relaxed" style={{ color: '#6B6560', fontSize: '0.9375rem' }}>
                            <p>{t('about_project_p1')}</p>
                            <p>{t('about_project_p2')}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('about_vision_tag')}</p>
                        <h2 className="font-serif text-2xl font-normal mb-6" style={{ color: '#1A1A1A' }}>
                            {t('about_vision_h2').split('\n').map((line, i) => (
                                <span key={i}>{line}{i === 0 && <br />}</span>
                            ))}
                        </h2>
                        <div className="h-px w-8 mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                        <div className="space-y-4 font-light leading-relaxed" style={{ color: '#6B6560', fontSize: '0.9375rem' }}>
                            <p>{t('about_vision_p1')}</p>
                            <p>{t('about_vision_p2')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valeurs */}
            <section className="py-24" style={{ backgroundColor: '#F0EBE1' }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('about_values_heading')}</p>
                        <h2 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('about_values_title2')}</h2>
                        <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        {VALUES.map((v) => (
                            <div key={v.title} className="flex gap-5">
                                <span className="text-base flex-shrink-0 mt-0.5" style={{ color: '#C8A96E' }}>{v.icon}</span>
                                <div>
                                    <h3 className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>{v.title}</h3>
                                    <p className="text-sm font-light leading-relaxed" style={{ color: '#6B6560' }}>{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center" style={{ backgroundColor: '#FAF8F4' }}>
                <div className="max-w-md mx-auto px-4">
                    <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('about_join_tag')}</p>
                    <h2 className="font-serif text-2xl font-normal mb-6" style={{ color: '#1A1A1A' }}>{t('about_join_h2')}</h2>
                    <div className="h-px w-10 mx-auto mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/boutique" className="btn-primary" style={{ letterSpacing: '0.15em' }}>{t('about_join_shop')}</Link>
                        <Link href="/contact" className="btn-secondary" style={{ letterSpacing: '0.15em' }}>{t('about_join_contact')}</Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
