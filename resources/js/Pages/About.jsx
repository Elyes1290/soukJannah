import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';
import { docTitle, withBrand } from '../i18n/docTitle';

export default function About() {
    const { t } = useT();

    const VALUES = [
        { icon: '◇', title: t('about_val1_title2'), desc: t('about_val1_desc2') },
        { icon: '◈', title: t('about_val2_title2'), desc: t('about_val2_desc2') },
        { icon: '○', title: t('about_val3_title2'), desc: t('about_val3_desc2') },
        { icon: '✦', title: t('about_val4_title2'), desc: t('about_val4_desc2') },
    ];

    const cardStory =
        'rounded-2xl bg-white px-8 py-9 sm:p-10 border shadow-sm hover:shadow-md hover:border-[#E0D9CC] transition-all duration-300';

    const cardValue =
        'text-center rounded-2xl bg-white px-7 py-9 sm:py-10 border border-[rgb(237,232,223)] shadow-sm hover:shadow-lg hover:border-[#E0D9CC] hover:-translate-y-0.5 transition-all duration-300';

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('about_title'))}>
                <meta head-key="description" name="description" content={t('meta_about', withBrand(t))} />
            </Head>

            {/* Fil d'Ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        <Link href="/" className="hover:opacity-60 transition-opacity">
                            {t('common_home')}
                        </Link>
                        <span className="mx-2" style={{ color: '#C8A96E' }}>
                            ›
                        </span>
                        <span style={{ color: '#1A1A1A' }}>{t('about_title')}</span>
                    </p>
                </div>
            </div>

            {/* Hero + bannière (espace de prière — sans livres) */}
            <section
                className="relative overflow-hidden border-b md:min-h-[min(88vh,920px)] min-h-[min(72vh,640px)]"
                style={{
                    borderColor: '#E8E2D9',
                    backgroundColor: '#EDE8DD',
                }}
            >
                <div className="pointer-events-none absolute inset-0 z-0">
                    <img
                        src="/images/about-hero-banner.png"
                        alt={t('about_hero_banner_alt')}
                        className="hero-about-cover absolute inset-0 w-full h-full"
                        draggable={false}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <div
                    className="pointer-events-none absolute inset-0 z-[1] md:hidden"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(250, 248, 244, 0.94) 0%, rgba(250, 248, 244, 0.72) 32%, rgba(250, 248, 244, 0.38) 58%, rgba(250, 248, 244, 0.12) 100%)',
                    }}
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
                    style={{
                        background:
                            'linear-gradient(103deg, rgba(250, 248, 244, 0.96) 0%, rgba(250, 248, 244, 0.78) 38%, rgba(250, 248, 244, 0.28) 58%, transparent 74%)',
                    }}
                    aria-hidden
                />
                <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center md:min-h-[min(88vh,920px)] min-h-[min(72vh,640px)] py-14 sm:py-16 md:py-28">
                    <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
                        <p
                            className="text-xs tracking-[0.4em] uppercase mb-5 sm:mb-6 font-medium drop-shadow-[0_1px_12px_rgba(250,248,244,0.9)]"
                            style={{ color: '#B8955A' }}
                        >
                            {t('about_tag')}
                        </p>
                        <h1
                            className="font-serif text-4xl md:text-[2.85rem] font-normal mb-7 sm:mb-8 leading-[1.1] drop-shadow-[0_2px_28px_rgba(250,248,244,0.85)]"
                            style={{ color: '#141210', maxWidth: '34rem' }}
                        >
                            {t('about_h1')}
                        </h1>
                        <div
                            className="h-0.5 w-14 mb-8 rounded-full mx-auto md:mx-0"
                            style={{ background: 'linear-gradient(90deg, #C8A96E 0%, rgba(200,169,110,0.35) 100%)' }}
                        />
                        <p
                            className="font-light leading-relaxed max-w-lg mx-auto md:mx-0 drop-shadow-[0_1px_16px_rgba(250,248,244,0.95)]"
                            style={{ color: '#3A3632', fontSize: '1.0625rem' }}
                        >
                            {t('about_intro')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Histoire + vision (cartes) */}
            <section className="py-20 md:py-24" style={{ backgroundColor: '#FAF8F4' }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        <article className={cardStory} style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>
                                {t('about_project_tag')}
                            </p>
                            <h2 className="font-serif text-xl sm:text-2xl font-normal mb-5" style={{ color: '#1A1A1A' }}>
                                {t('about_project_h2')}
                            </h2>
                            <div className="h-px w-8 mb-6" style={{ backgroundColor: '#C8A96E' }} />
                            <div className="space-y-4 font-light leading-relaxed" style={{ color: '#6B6560', fontSize: '0.9375rem' }}>
                                <p>{t('about_project_p1', withBrand(t))}</p>
                                <p>{t('about_project_p2')}</p>
                            </div>
                        </article>
                        <article className={cardStory} style={{ borderColor: '#E8E2D9' }}>
                            <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>
                                {t('about_vision_tag')}
                            </p>
                            <h2 className="font-serif text-xl sm:text-2xl font-normal mb-5" style={{ color: '#1A1A1A' }}>
                                {t('about_vision_h2').split('\n').map((line, i) => (
                                    <span key={line}>
                                        {line}
                                        {i === 0 && <br />}
                                    </span>
                                ))}
                            </h2>
                            <div className="h-px w-8 mb-6" style={{ backgroundColor: '#C8A96E' }} />
                            <div className="space-y-4 font-light leading-relaxed" style={{ color: '#6B6560', fontSize: '0.9375rem' }}>
                                <p>{t('about_vision_p1')}</p>
                                <p>{t('about_vision_p2')}</p>
                            </div>
                        </article>
                    </div>

                    {/* Citation */}
                    <figure className="mt-12 lg:mt-14 max-w-2xl mx-auto text-center px-4 sm:px-6">
                        <blockquote
                            className="font-serif text-lg sm:text-xl font-normal italic leading-snug pl-6 sm:pl-8 py-6 border-l-[3px] text-left rounded-r-xl"
                            style={{
                                borderColor: '#C8A96E',
                                color: '#2C2824',
                                background: 'linear-gradient(90deg, rgba(200,169,110,0.06) 0%, transparent 100%)',
                            }}
                        >
                            {t('about_pullquote')}
                        </blockquote>
                    </figure>
                </div>
            </section>

            {/* Valeurs */}
            <section className="py-20 md:py-24 border-y" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-14 md:mb-16 max-w-xl mx-auto">
                        <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#B8955A' }}>
                            {t('about_values_heading')}
                        </p>
                        <h2 className="font-serif text-3xl sm:text-[2.15rem] font-normal leading-snug" style={{ color: '#1A1A1A' }}>
                            {t('about_values_title2')}
                        </h2>
                        <div className="h-0.5 w-14 mx-auto mt-6 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                        {VALUES.map((v) => (
                            <div key={v.title} className={cardValue}>
                                <div
                                    className="text-xl mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full mx-auto"
                                    style={{ color: '#B8955A', backgroundColor: 'rgba(200,169,110,0.08)' }}
                                >
                                    {v.icon}
                                </div>
                                <h3 className="font-serif text-[1.05rem] mb-3" style={{ color: '#1A1A1A' }}>
                                    {v.title}
                                </h3>
                                <p className="text-xs sm:text-[0.8125rem] leading-relaxed font-light" style={{ color: '#5C574F' }}>
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-24 text-center border-b" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D9' }}>
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#B8955A' }}>
                        {t('about_join_tag')}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-[1.85rem] font-normal mb-5 leading-snug" style={{ color: '#1A1A1A' }}>
                        {t('about_join_h2')}
                    </h2>
                    <div className="h-0.5 w-14 mx-auto mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-8 text-[11px] sm:text-xs font-light" style={{ color: '#9A9490' }}>
                        <span className="opacity-70" aria-hidden>
                            ◆
                        </span>
                        <span>{t('about_join_desc')}</span>
                        <span className="opacity-70" aria-hidden>
                            ◆
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
                        <Link href="/boutique" className="btn-primary text-center justify-center" style={{ letterSpacing: '0.15em' }}>
                            {t('about_join_shop')}
                        </Link>
                        <Link href="/contact" className="btn-secondary text-center justify-center" style={{ letterSpacing: '0.15em' }}>
                            {t('about_join_contact')}
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
