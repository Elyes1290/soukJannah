import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';
import { docTitle, withBrand } from '../i18n/docTitle';
import { localizePost, formatPostDate } from '../utils/postLocale';

function FeaturedProduct({ product }) {
    const { t } = useT();

    return (
        <Link href={`/boutique/${product.slug}`} className="group block rounded-2xl bg-white p-3 sm:p-3.5 border border-transparent shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[rgb(232,229,217)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96E]">
            <div className="aspect-square overflow-hidden mb-4 rounded-xl bg-[#F0EBE1]" style={{ boxShadow: 'inset 0 0 0 1px rgba(232,226,217,0.6)' }}>
                {product.main_image_url ? (
                    <img src={product.main_image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#C8A96E' }}>
                        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[10px] sm:text-xs tracking-widest uppercase font-medium truncate" style={{ color: '#B8955A' }}>
                    {product.category ?? t('common_fallback_premium')}
                </p>
                <span className="text-[10px] tracking-wider uppercase shrink-0 opacity-0 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" style={{ color: '#C8A96E' }}>
                    ✦
                </span>
            </div>
            <h3 className="font-serif text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#5C4F3A] transition-colors mb-3 leading-snug">{product.name}</h3>
            <div className="flex items-center gap-2">
                {product.sale_price ? (
                    <>
                        <span className="text-sm font-medium" style={{ color: '#C8A96E' }}>{product.sale_price} CHF</span>
                        <span className="text-xs line-through" style={{ color: '#9A9490' }}>{product.price} CHF</span>
                    </>
                ) : (
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{product.price} CHF</span>
                )}
            </div>
        </Link>
    );
}

function CategoryIcon() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    );
}

export default function Home({ featured, categories = [], featuredOffers = [], reviews = [], latestPosts = [], stats = {} }) {
    const { t, lang } = useT();
    const { catalogComingSoon } = usePage().props;

    const BENEFITS = [
        { icon: '✦', title: t('home_benefit1_title'), desc: t('home_benefit1_desc') },
        { icon: '◈', title: t('home_benefit2_title'), desc: t('home_benefit2_desc') },
        { icon: '◇', title: t('home_benefit3_title'), desc: t('home_benefit3_desc') },
        { icon: '○', title: t('home_benefit4_title'), desc: t('home_benefit4_desc') },
    ];

    return (
        <PublicLayout>
            <Head>
                <title>{docTitle(t, t('meta_home_doc_segment'))}</title>
                <meta name="description" content={t('meta_home', withBrand(t))} />
            </Head>

            {/* Hero — home-hero-banner.png (même visuel, cadrage CSS mobile / desktop) */}
            <section className="relative overflow-hidden md:min-h-[85vh] min-h-[min(76svh,680px)]" style={{ backgroundColor: '#F0EBE1' }}>
                <div className="absolute inset-0 z-0 w-full">
                    <img
                        src="/images/home-hero-banner.png"
                        alt={t('home_hero_banner_alt')}
                        className="hero-banner-cover"
                        draggable={false}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                {/* Voile : vertical sur mobile, diagonal sur desktop */}
                <div
                    className="pointer-events-none absolute inset-0 z-[1] md:hidden"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(240, 235, 225, 0.96) 0%, rgba(240, 235, 225, 0.78) 28%, rgba(240, 235, 225, 0.35) 55%, rgba(240, 235, 225, 0.08) 100%)',
                    }}
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
                    style={{
                        background:
                            'linear-gradient(105deg, rgba(240, 235, 225, 0.94) 0%, rgba(240, 235, 225, 0.55) 42%, rgba(240, 235, 225, 0.12) 68%, transparent 100%)',
                    }}
                    aria-hidden
                />
                <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-40 flex flex-col justify-center md:min-h-[85vh]">
                    <div className="max-w-xl md:max-w-2xl">
                        <p className="text-xs tracking-[0.4em] uppercase mb-6 sm:mb-8 font-medium" style={{ color: '#B8955A' }}>
                            {t('home_hero_tag')}
                        </p>
                        <h1
                            className="font-serif font-normal leading-[1.08] mb-6 sm:mb-8 drop-shadow-[0_2px_24px_rgba(250,248,244,0.45)]"
                            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', color: '#141210', maxWidth: '34rem' }}
                        >
                            {t('home_hero_h1a')}<br />
                            <em className="text-[#2C2824]">{t('home_hero_h1b')}</em>
                        </h1>
                        <p className="mb-8 sm:mb-10 font-light leading-relaxed max-w-md" style={{ color: '#4A4540', fontSize: '1.0625rem' }}>
                            {t('home_hero_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                            <Link href="/boutique" className="btn-primary btn-home-hero flex justify-center sm:inline-flex text-center">
                                {t(catalogComingSoon ? 'home_hero_cta_soon' : 'home_hero_cta')}
                            </Link>
                            <Link href="/boutique" className="btn-hero-secondary flex justify-center sm:inline-flex">
                                {t('home_hero_gift')}
                            </Link>
                        </div>
                        <p className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-2 gap-x-4 text-[11px] sm:text-xs font-light tracking-wide leading-relaxed" style={{ color: '#5C5650' }}>
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 shrink-0 text-[#C8A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {t('footer_free_shipping')}
                            </span>
                            <span className="hidden sm:inline opacity-30 select-none" aria-hidden>·</span>
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 shrink-0 text-[#C8A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M3.75 4.5h16.5c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125H3.75A1.125 1.125 0 012.625 19.125V5.625C2.625 5.004 3.129 4.5 3.75 4.5z" />
                                </svg>
                                {t('footer_payment')}
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Compteurs de confiance */}
            {(stats.orders_shipped > 0 || stats.happy_customers > 0 || stats.products_count > 0) && (
                <section className="relative border-y" style={{ backgroundColor: '#1A1A1A', borderColor: '#2C2C2C' }}>
                    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
                        <div className="grid grid-cols-3 divide-x" style={{ divideColor: '#333' }}>
                            {[
                                {
                                    value: stats.orders_shipped >= 100
                                        ? `+${Math.floor(stats.orders_shipped / 10) * 10}`
                                        : stats.orders_shipped,
                                    labelKey: 'home_stats_orders_shipped',
                                },
                                {
                                    value: stats.happy_customers >= 50
                                        ? `+${Math.floor(stats.happy_customers / 10) * 10}`
                                        : stats.happy_customers,
                                    labelKey: 'home_stats_happy_customers',
                                },
                                {
                                    value: stats.products_count,
                                    labelKey: 'home_stats_products',
                                },
                            ].map((s, i) => (
                                <div key={i} className="text-center py-3 px-3 sm:py-4 sm:px-4" style={{ borderColor: '#333' }}>
                                    <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal mb-2 tabular-nums" style={{ color: '#D4B87A' }}>{s.value}</p>
                                    <p className="text-[10px] sm:text-xs font-medium tracking-widest uppercase leading-tight" style={{ color: '#8A8580' }}>
                                        {t(s.labelKey)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Catégories */}
            {categories.length > 0 && (
                <section className="py-20 sm:py-24 border-b" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D9' }}>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-14">
                            <div>
                                <p className="text-xs tracking-[0.4em] uppercase mb-2 font-light" style={{ color: '#C8A96E' }}>{t('home_cats_tag')}</p>
                                <h2 className="font-serif text-2xl font-normal" style={{ color: '#1A1A1A' }}>{t('home_cats_title')}</h2>
                            </div>
                            <Link href="/boutique" className="text-xs font-medium tracking-wider flex items-center gap-1.5 hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>
                                {t('common_view_all')}
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            <Link href="/boutique" className="group flex flex-col items-center justify-center text-center p-6 sm:p-7 border-2 rounded-2xl bg-[#F7F3EB] transition-all duration-300 hover:border-[#C8A96E] hover:shadow-lg hover:shadow-[#C8A96E]/10 hover:-translate-y-0.5" style={{ borderColor: '#E8E2D9', minHeight: '140px' }}>
                                <div className="mb-3 transition-transform group-hover:scale-110" style={{ color: '#C8A96E' }}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg>
                                </div>
                                <p className="font-serif text-sm font-normal" style={{ color: '#1A1A1A' }}>{t('home_cats_all')}</p>
                                <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{t('home_cats_all_sub')}</p>
                            </Link>
                            {categories.map((cat) => (
                                <Link key={cat.id} href={`/boutique?categorie=${cat.slug}`} className="group flex flex-col items-center justify-center text-center p-6 sm:p-7 border-2 rounded-2xl bg-white transition-all duration-300 hover:border-[#C8A96E] hover:shadow-lg hover:shadow-[#C8A96E]/10 hover:-translate-y-0.5" style={{ borderColor: '#EBE6DC', minHeight: '140px' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCF9'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
                                    <div className="mb-3 transition-transform group-hover:scale-110" style={{ color: '#C8A96E' }}>
                                        <CategoryIcon />
                                    </div>
                                    <p className="font-serif text-sm font-normal leading-tight" style={{ color: '#1A1A1A' }}>{cat.name}</p>
                                    <p className="text-xs font-light mt-1" style={{ color: '#9A9490' }}>
                                        {cat.products_count} {cat.products_count > 1 ? t('common_items_plural') : t('common_items')}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Produits en vedette */}
            {featured.length > 0 && (
                <section
                    className="relative py-24 sm:py-28 overflow-hidden"
                    style={{
                        background: 'linear-gradient(165deg, #FAF8F4 0%, #F5F0E7 42%, #FAF8F4 72%, #F8F5EF 100%)',
                    }}
                >
                    <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.35) 0%, transparent 70%)' }} aria-hidden />
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
                        <div className="text-center mb-14 sm:mb-16 max-w-2xl mx-auto">
                            <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#B8955A' }}>
                                {t('home_bestsellers_tag')}
                            </p>
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] font-normal mb-5 leading-tight" style={{ color: '#1A1A1A' }}>
                                {t('home_bestsellers_title')}
                            </h2>
                            <div className="h-0.5 w-14 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                            <p className="mt-6 text-sm font-light max-w-md mx-auto" style={{ color: '#6B6560' }}>
                                {t('home_bestsellers_sub')}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {featured.map((product) => (
                            <FeaturedProduct key={product.id} product={product} />
                        ))}
                    </div>
                        <div className="text-center mt-14 sm:mt-16">
                            <Link href="/boutique" className="btn-primary btn-home-hero inline-flex justify-center items-center mx-auto">
                                {t('home_bestsellers_cta')}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Offres phares */}
            {featuredOffers.map((offer, idx) => (
                <section key={offer.id} style={{ backgroundColor: idx % 2 === 0 ? '#1A1A1A' : '#111111' }}>
                    <div className="max-w-6xl mx-auto px-4 py-24">
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
                            <div style={{ direction: 'ltr' }}>
                                <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('home_offer_tag')}</p>
                                <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight mb-6" style={{ color: '#FAF8F4' }}>
                                    <em>{offer.title}</em>
                                </h2>
                                <div className="h-px w-10 mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                                {offer.description && <p className="mb-8 font-light leading-relaxed" style={{ color: '#9A9490' }}>{offer.description}</p>}
                                {offer.items_list?.length > 0 && (
                                    <ul className="space-y-3 mb-8">
                                        {offer.items_list.map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-sm font-light" style={{ color: '#9A9490' }}>
                                                <span style={{ color: '#C8A96E' }}>—</span>{item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {offer.price && (
                                    <div className="flex items-baseline gap-3 mb-8">
                                        <span className="font-serif text-2xl" style={{ color: '#C8A96E' }}>{offer.price}</span>
                                        {offer.original_price && <span className="text-sm line-through font-light" style={{ color: '#5A5550' }}>{offer.original_price}</span>}
                                    </div>
                                )}
                                <Link href={offer.url || '/boutique'} style={{ backgroundColor: '#C8A96E', color: '#1A1A1A', letterSpacing: '0.15em' }} className="btn-primary hover:opacity-90">
                                    {t('home_offer_cta')}
                                </Link>
                            </div>
                            <div className="aspect-square overflow-hidden rounded-2xl ring-1 ring-white/5" style={{ backgroundColor: '#2C2C2C', boxShadow: '0 20px 50px rgb(0 0 0 / 0.35)' }}>
                                {offer.image_url ? (
                                    <img src={offer.image_url} alt={offer.title} loading="lazy" className="w-full h-full object-cover opacity-90" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="opacity-10">
                                            <svg viewBox="0 0 100 100" className="w-24 h-24" fill="none">
                                                <circle cx="50" cy="50" r="40" stroke="#C8A96E" strokeWidth="0.5"/>
                                                <circle cx="50" cy="50" r="30" stroke="#C8A96E" strokeWidth="0.5"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Bénéfices */}
            <section className="py-24 sm:py-28" style={{ backgroundColor: '#F6F4EF' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16 sm:mb-20 max-w-xl mx-auto">
                        <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#B8955A' }}>{t('home_benefits_tag')}</p>
                        <h2 className="font-serif text-3xl sm:text-[2.15rem] font-normal leading-snug" style={{ color: '#1A1A1A' }}>{t('home_benefits_title')}</h2>
                        <div className="h-0.5 w-14 mx-auto mt-6 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                        {BENEFITS.map((b) => (
                            <div
                                key={b.title}
                                className="text-center rounded-2xl bg-white px-7 py-9 sm:py-10 border border-[rgb(237,232,223)] shadow-sm hover:shadow-lg hover:border-[#E0D9CC] hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="text-2xl mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full" style={{ color: '#B8955A', backgroundColor: 'rgba(200,169,110,0.08)' }}>
                                    {b.icon}
                                </div>
                                <h3 className="font-serif text-[1.05rem] mb-3" style={{ color: '#1A1A1A' }}>{b.title}</h3>
                                <p className="text-xs sm:text-[0.8125rem] leading-relaxed font-light" style={{ color: '#5C574F' }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Témoignages */}
            {reviews.length > 0 && (
                <section className="py-24 sm:py-28" style={{ backgroundColor: '#F0EBE1' }}>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-14 sm:mb-16 max-w-xl mx-auto">
                            <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#B8955A' }}>{t('home_reviews_tag')}</p>
                            <h2 className="font-serif text-3xl font-normal leading-snug" style={{ color: '#1A1A1A' }}>{t('home_reviews_title')}</h2>
                            <div className="h-0.5 w-14 mx-auto mt-6 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {reviews.map((r) => (
                                <div
                                    key={r.id}
                                    className="bg-white rounded-2xl p-8 sm:p-9 border border-[#EDE8DD] shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="flex gap-0.5 mb-5">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-sm" style={{ color: i < r.rating ? '#C8A96E' : '#D4CFC8' }}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-light leading-relaxed mb-6 italic" style={{ color: '#6B6560' }}>"{r.content}"</p>
                                    <div className="border-t pt-4" style={{ borderColor: '#E8E2D9' }}>
                                        <p className="font-serif text-sm" style={{ color: '#1A1A1A' }}>{r.author}</p>
                                        {r.location && <p className="text-xs mt-0.5 font-light" style={{ color: '#9A9490' }}>{r.location}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Blog */}
            {latestPosts.length > 0 && (
                <section className="py-24" style={{ backgroundColor: '#FAF8F4' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('home_blog_tag')}</p>
                                <h2 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('home_blog_title')}</h2>
                            </div>
                            <Link href="/blog" className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60 hidden md:block" style={{ color: '#6B6560' }}>
                                {t('home_blog_cta')}
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.map(post => {
                                const localized = localizePost(post, lang);
                                return (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                    <div className="aspect-video overflow-hidden mb-4" style={{ backgroundColor: '#F0EBE1' }}>
                                        {post.cover_image_url ? (
                                            <img src={post.cover_image_url} alt={localized.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#D4CFC8' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-light mb-2" style={{ color: '#9A9490' }}>{formatPostDate(post.published_at, lang)} · {localized.reading_time} {t('common_min_read')}</p>
                                    <h3 className="font-serif text-lg font-normal leading-snug group-hover:opacity-70 transition-opacity" style={{ color: '#1A1A1A' }}>{localized.title}</h3>
                                </Link>
                                );
                            })}
                        </div>
                        <div className="text-center mt-10 md:hidden">
                            <Link href="/blog" className="text-xs tracking-widest uppercase font-medium" style={{ color: '#C8A96E' }}>{t('home_blog_cta_mobile')}</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Final */}
            <section className="relative py-24 sm:py-28 md:py-32 text-center overflow-hidden" style={{ backgroundColor: '#141210' }}>
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(200,169,110,0.5) 0%, transparent 55%)',
                    }}
                    aria-hidden
                />
                <div className="max-w-lg mx-auto px-4 relative z-[1]">
                    <p className="text-xs tracking-[0.45em] uppercase mb-5 font-semibold" style={{ color: '#D4B87A' }}>{t('home_cta_tag')}</p>
                    <h2 className="font-serif text-[1.875rem] sm:text-[2.125rem] md:text-[2.35rem] font-normal mb-8 leading-snug text-[#FAF8F4]">{t('home_cta_title')}</h2>
                    <div className="h-0.5 w-14 mx-auto mb-10 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,184,122,0.9), transparent)' }} />
                    <p className="mb-11 font-light leading-relaxed text-[#A8A29A]" style={{ fontSize: '1rem' }}>{t('home_cta_desc')}</p>
                    <Link href="/boutique" className="btn-home-close">{t('home_cta_btn')}</Link>
                </div>
            </section>
        </PublicLayout>
    );
}
