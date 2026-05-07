import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import { useT } from '../contexts/LanguageContext';

function FeaturedProduct({ product }) {
    return (
        <Link href={`/boutique/${product.slug}`} className="group block">
            <div className="aspect-square overflow-hidden mb-4" style={{ backgroundColor: '#F0EBE1' }}>
                {product.main_image_url ? (
                    <img src={product.main_image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#C8A96E' }}>
                        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <p className="text-xs tracking-widest uppercase mb-1.5" style={{ color: '#C8A96E' }}>{product.category ?? 'Premium'}</p>
            <h3 className="font-serif text-base text-gray-900 group-hover:opacity-60 transition-opacity mb-2">{product.name}</h3>
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

    const BENEFITS = [
        { icon: '✦', title: t('home_benefit1_title'), desc: t('home_benefit1_desc') },
        { icon: '◈', title: t('home_benefit2_title'), desc: t('home_benefit2_desc') },
        { icon: '◇', title: t('home_benefit3_title'), desc: t('home_benefit3_desc') },
        { icon: '○', title: t('home_benefit4_title'), desc: t('home_benefit4_desc') },
    ];

    return (
        <PublicLayout>
            <Head>
                <title>{lang === 'fr' ? 'SoukJannah — Essentiels musulmans premium' : 'SoukJannah — Premium Muslim essentials'}</title>
                <meta name="description" content={t('meta_home')} />
            </Head>

            {/* Hero */}
            <section className="relative overflow-hidden" style={{ backgroundColor: '#F0EBE1', minHeight: '85vh' }}>
                <div className="max-w-6xl mx-auto px-4 py-24 md:py-40 flex flex-col justify-center h-full">
                    <p className="text-xs tracking-[0.4em] uppercase mb-8 font-light" style={{ color: '#C8A96E' }}>
                        {t('home_hero_tag')}
                    </p>
                    <h1 className="font-serif font-normal leading-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#1A1A1A', maxWidth: '700px' }}>
                        {t('home_hero_h1a')}<br />
                        <em>{t('home_hero_h1b')}</em>
                    </h1>
                    <p className="mb-12 font-light leading-relaxed" style={{ color: '#6B6560', maxWidth: '480px', fontSize: '1.0625rem' }}>
                        {t('home_hero_desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/boutique" className="btn-primary" style={{ letterSpacing: '0.15em' }}>
                            {t('home_hero_cta')}
                        </Link>
                        <Link href="/boutique" className="btn-secondary" style={{ letterSpacing: '0.15em' }}>
                            {t('home_hero_gift')}
                        </Link>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:flex items-center justify-center opacity-10">
                    <svg viewBox="0 0 200 200" className="w-96 h-96" fill="none">
                        <circle cx="100" cy="100" r="80" stroke="#C8A96E" strokeWidth="0.5"/>
                        <circle cx="100" cy="100" r="60" stroke="#C8A96E" strokeWidth="0.5"/>
                        <circle cx="100" cy="100" r="40" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="100" y1="20" x2="100" y2="180" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="20" y1="100" x2="180" y2="100" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="43" y1="43" x2="157" y2="157" stroke="#C8A96E" strokeWidth="0.5"/>
                        <line x1="157" y1="43" x2="43" y2="157" stroke="#C8A96E" strokeWidth="0.5"/>
                    </svg>
                </div>
            </section>

            {/* Compteurs de confiance */}
            {(stats.orders_shipped > 0 || stats.happy_customers > 0 || stats.products_count > 0) && (
                <section style={{ backgroundColor: '#1A1A1A' }}>
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-3 divide-x" style={{ divideColor: '#333' }}>
                            {[
                                {
                                    value: stats.orders_shipped >= 100
                                        ? `+${Math.floor(stats.orders_shipped / 10) * 10}`
                                        : stats.orders_shipped,
                                    label_en: 'Orders shipped',
                                    label_fr: 'Commandes expédiées',
                                },
                                {
                                    value: stats.happy_customers >= 50
                                        ? `+${Math.floor(stats.happy_customers / 10) * 10}`
                                        : stats.happy_customers,
                                    label_en: 'Happy customers',
                                    label_fr: 'Clients satisfaits',
                                },
                                {
                                    value: stats.products_count,
                                    label_en: 'Premium products',
                                    label_fr: 'Produits premium',
                                },
                            ].map((s, i) => (
                                <div key={i} className="text-center py-2 px-4" style={{ borderColor: '#333' }}>
                                    <p className="font-serif text-2xl md:text-3xl font-normal mb-1" style={{ color: '#C8A96E' }}>{s.value}</p>
                                    <p className="text-xs font-light tracking-wider uppercase" style={{ color: '#9A9490' }}>
                                        {lang === 'fr' ? s.label_fr : s.label_en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Catégories */}
            {categories.length > 0 && (
                <section className="py-16 border-b" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D9' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
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
                            <Link href="/boutique" className="group flex flex-col items-center justify-center text-center p-6 border transition-all hover:border-amber-300" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', minHeight: '130px' }}>
                                <div className="mb-3 transition-transform group-hover:scale-110" style={{ color: '#C8A96E' }}>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg>
                                </div>
                                <p className="font-serif text-sm font-normal" style={{ color: '#1A1A1A' }}>{t('home_cats_all')}</p>
                                <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{t('home_cats_all_sub')}</p>
                            </Link>
                            {categories.map((cat) => (
                                <Link key={cat.id} href={`/boutique?categorie=${cat.slug}`} className="group flex flex-col items-center justify-center text-center p-6 border transition-all hover:border-amber-300 bg-white" style={{ borderColor: '#E8E2D9', minHeight: '130px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0EBE1'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
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
                <section className="max-w-6xl mx-auto px-4 py-24">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('home_bestsellers_tag')}</p>
                        <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('home_bestsellers_title')}</h2>
                        <div className="h-px w-10 mx-auto" style={{ backgroundColor: '#C8A96E' }}></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {featured.map((product) => (
                            <FeaturedProduct key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/boutique" className="btn-secondary text-sm">{t('home_bestsellers_cta')}</Link>
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
                            <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#2C2C2C' }}>
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
            <section className="py-24" style={{ backgroundColor: '#FAF8F4' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('home_benefits_tag')}</p>
                        <h2 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('home_benefits_title')}</h2>
                        <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {BENEFITS.map((b) => (
                            <div key={b.title} className="text-center">
                                <div className="text-xl mb-5 font-light" style={{ color: '#C8A96E' }}>{b.icon}</div>
                                <h3 className="font-serif text-base mb-3" style={{ color: '#1A1A1A' }}>{b.title}</h3>
                                <p className="text-xs leading-relaxed font-light" style={{ color: '#6B6560' }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Témoignages */}
            {reviews.length > 0 && (
                <section className="py-24" style={{ backgroundColor: '#F0EBE1' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('home_reviews_tag')}</p>
                            <h2 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('home_reviews_title')}</h2>
                            <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {reviews.map((r) => (
                                <div key={r.id} className="bg-white p-8 border" style={{ borderColor: '#E8E2D9' }}>
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
                            {latestPosts.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                    <div className="aspect-video overflow-hidden mb-4" style={{ backgroundColor: '#F0EBE1' }}>
                                        {post.cover_image_url ? (
                                            <img src={post.cover_image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#D4CFC8' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-light mb-2" style={{ color: '#9A9490' }}>{post.published_at} · {post.reading_time} {t('common_min_read')}</p>
                                    <h3 className="font-serif text-lg font-normal leading-snug group-hover:opacity-70 transition-opacity" style={{ color: '#1A1A1A' }}>{post.title}</h3>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-10 md:hidden">
                            <Link href="/blog" className="text-xs tracking-widest uppercase font-medium" style={{ color: '#C8A96E' }}>{t('home_blog_cta_mobile')}</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Final */}
            <section className="py-28 text-center" style={{ backgroundColor: '#FAF8F4' }}>
                <div className="max-w-xl mx-auto px-4">
                    <p className="text-xs tracking-[0.4em] uppercase mb-5 font-light" style={{ color: '#C8A96E' }}>{t('home_cta_tag')}</p>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6" style={{ color: '#1A1A1A' }}>{t('home_cta_title')}</h2>
                    <div className="h-px w-10 mx-auto mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="mb-10 font-light leading-relaxed" style={{ color: '#6B6560', fontSize: '0.9375rem' }}>{t('home_cta_desc')}</p>
                    <Link href="/boutique" className="btn-primary" style={{ letterSpacing: '0.15em' }}>{t('home_cta_btn')}</Link>
                </div>
            </section>
        </PublicLayout>
    );
}
