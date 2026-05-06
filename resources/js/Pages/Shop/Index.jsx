import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import WishlistButton from '../../Components/WishlistButton';

function SortDropdown({ activeSort, onChange }) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const SORT_OPTIONS = [
        { value: 'pertinence', label: t('shop_sort_relevance') },
        { value: 'nouveautes', label: t('shop_sort_newest') },
        { value: 'prix-asc',   label: t('shop_sort_price_asc') },
        { value: 'prix-desc',  label: t('shop_sort_price_desc') },
    ];

    const current = SORT_OPTIONS.find(o => o.value === activeSort) ?? SORT_OPTIONS[0];

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap" style={{ borderColor: open ? '#C8A96E' : '#E8E2D9', color: '#1A1A1A', backgroundColor: 'white' }}>
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#C8A96E' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                </svg>
                {t('shop_sort')}: <span style={{ color: '#C8A96E' }}>{current.label}</span>
                <svg className="w-3 h-3 transition-transform flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'none', color: '#9A9490' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-1 bg-white border z-50 shadow-sm" style={{ borderColor: '#E8E2D9', minWidth: '180px', borderTop: '2px solid #C8A96E' }}>
                    {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between" style={{ color: activeSort === opt.value ? '#C8A96E' : '#1A1A1A', backgroundColor: activeSort === opt.value ? '#FAF8F4' : 'white', fontWeight: activeSort === opt.value ? '500' : '300' }}>
                            {opt.label}
                            {activeSort === opt.value && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#C8A96E' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProductCard({ product }) {
    const { t } = useT();
    const [adding, setAdding] = useState(false);
    const [added, setAdded]   = useState(false);

    const addToCart = (e) => {
        e.preventDefault();
        if (product.stock === 0 || adding) return;
        setAdding(true);
        router.post('/panier/ajouter', { product_id: product.id, quantity: 1 }, {
            preserveScroll: true,
            onSuccess: () => { setAdded(true); setTimeout(() => { setAdded(false); setAdding(false); }, 1800); },
            onError: () => setAdding(false),
        });
    };

    return (
        <Link href={`/boutique/${product.slug}`} className="group block">
            <div className="relative overflow-hidden mb-3" style={{ backgroundColor: '#F0EBE1', aspectRatio: '3/4' }}>
                {product.main_image_url ? (
                    <img src={product.main_image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color: '#C8A96E' }}>
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {product.sale_price && <span className="px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: '#C8A96E', color: 'white' }}>{t('common_promo')}</span>}
                    {product.is_featured && !product.sale_price && <span className="px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>{t('common_featured')}</span>}
                </div>
                <div className="absolute top-2 right-2">
                    <WishlistButton productId={product.id} size="sm" />
                </div>
                {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(250,248,244,0.75)' }}>
                        <span className="text-xs tracking-widest uppercase font-medium px-3 py-1.5 bg-white border" style={{ color: '#9A9490', borderColor: '#D4CFC8' }}>{t('common_out_of_stock')}</span>
                    </div>
                )}
                {product.stock > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                        <button onClick={addToCart} className="w-full py-3 text-xs font-medium tracking-widest uppercase transition-colors flex items-center justify-center gap-2" style={{ backgroundColor: added ? '#C8A96E' : '#1A1A1A', color: 'white' }}>
                            {added ? (
                                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{t('shop_added')}</>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                                    <span className="hidden sm:inline">{t('shop_add_to_cart')}</span>
                                    <span className="sm:hidden">{t('shop_cart_mobile')}</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="px-0.5">
                {product.category && <p className="text-xs font-light mb-1 tracking-wider" style={{ color: '#C8A96E' }}>{product.category}</p>}
                <h3 className="text-sm font-medium mb-1.5 line-clamp-2 leading-snug group-hover:opacity-60 transition-opacity" style={{ color: '#1A1A1A' }}>{product.name}</h3>

                {/* Étoiles */}
                {product.avg_rating ? (
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm" style={{ color: '#C8A96E' }}>{'★'.repeat(Math.round(product.avg_rating))}{'☆'.repeat(5 - Math.round(product.avg_rating))}</span>
                        <span className="text-xs font-light" style={{ color: '#9A9490' }}>({product.reviews_count})</span>
                    </div>
                ) : null}

                <div className="flex items-baseline gap-2">
                    {product.sale_price ? (
                        <>
                            <span className="text-base font-semibold" style={{ color: '#C8A96E' }}>{parseFloat(product.sale_price).toFixed(2)} CHF</span>
                            <span className="text-xs line-through font-light" style={{ color: '#9A9490' }}>{parseFloat(product.price).toFixed(2)} CHF</span>
                            <span className="text-xs font-medium" style={{ color: '#C8A96E' }}>-{Math.round((1 - product.sale_price / product.price) * 100)}%</span>
                        </>
                    ) : (
                        <span className="text-base font-semibold" style={{ color: '#1A1A1A' }}>{parseFloat(product.price).toFixed(2)} CHF</span>
                    )}
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                    <p className="text-xs mt-1 font-light" style={{ color: '#E07070' }}>
                        {t('common_only_left')} {product.stock} {t('common_left_stock')}
                    </p>
                )}
            </div>
        </Link>
    );
}

function Pagination({ pagination, onPageChange }) {
    const { t } = useT();
    if (!pagination || pagination.last_page <= 1) return null;
    const { current_page, last_page, from, to, total } = pagination;
    const pages = [];
    for (let i = 1; i <= last_page; i++) {
        if (i === 1 || i === last_page || (i >= current_page - 2 && i <= current_page + 2)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }
    return (
        <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                {from}–{to} {t('shop_of')} {total} {total > 1 ? t('shop_products_count_plural') : t('shop_products_count')}
            </p>
            <div className="flex items-center gap-1.5">
                <button onClick={() => onPageChange(current_page - 1)} disabled={current_page === 1} className="px-3 py-2 text-xs border transition-colors disabled:opacity-30" style={{ borderColor: '#E8E2D9', color: '#6B6560', backgroundColor: 'white' }}>←</button>
                {pages.map((page, i) =>
                    page === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-xs" style={{ color: '#9A9490' }}>…</span>
                    ) : (
                        <button key={page} onClick={() => onPageChange(page)} className="w-9 h-9 text-xs border transition-colors" style={page === current_page ? { borderColor: '#1A1A1A', backgroundColor: '#1A1A1A', color: 'white' } : { borderColor: '#E8E2D9', color: '#6B6560', backgroundColor: 'white' }}>{page}</button>
                    )
                )}
                <button onClick={() => onPageChange(current_page + 1)} disabled={current_page === last_page} className="px-3 py-2 text-xs border transition-colors disabled:opacity-30" style={{ borderColor: '#E8E2D9', color: '#6B6560', backgroundColor: 'white' }}>→</button>
            </div>
        </div>
    );
}

export default function ShopIndex({ products, categories = [], activeCategory = null, activeSort = 'pertinence', activeSearch = '', pagination = null }) {
    const { t } = useT();

    const buildQuery = (overrides = {}) => {
        const params = {};
        if (activeCategory?.slug) params.categorie = activeCategory.slug;
        if (activeSort && activeSort !== 'pertinence') params.tri = activeSort;
        if (activeSearch) params.q = activeSearch;
        return { ...params, ...overrides };
    };

    const filterByCategory = (slug) => {
        const params = slug ? buildQuery({ categorie: slug }) : (activeSort !== 'pertinence' ? { tri: activeSort } : {});
        if (activeSearch) params.q = activeSearch;
        router.get('/boutique', params, { preserveScroll: false });
    };

    const changeSort = (sort) => {
        const params = buildQuery({ tri: sort === 'pertinence' ? undefined : sort });
        if (!params.tri) delete params.tri;
        router.get('/boutique', params, { preserveScroll: true });
    };

    const clearSearch = () => {
        const params = {};
        if (activeCategory?.slug) params.categorie = activeCategory.slug;
        if (activeSort && activeSort !== 'pertinence') params.tri = activeSort;
        router.get('/boutique', params, { preserveScroll: false });
    };

    const goToPage = (page) => {
        const params = buildQuery({ page: page === 1 ? undefined : page });
        if (params.page === undefined) delete params.page;
        router.get('/boutique', params, { preserveScroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <PublicLayout>
            <Head title={activeCategory ? `${activeCategory.name} — ${t('shop_title')}` : t('shop_title')} />

            {/* Fil d'Ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-6xl mx-auto px-4 py-2.5">
                    <nav className="flex items-center gap-1.5 text-xs font-light flex-wrap" style={{ color: '#9A9490' }}>
                        <Link href="/" className="hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>{t('shop_breadcrumb_home')}</Link>
                        <span style={{ color: '#C8A96E' }}>›</span>
                        {activeCategory ? (
                            <>
                                <button onClick={() => filterByCategory(null)} className="hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>{t('shop_title')}</button>
                                <span style={{ color: '#C8A96E' }}>›</span>
                                <span style={{ color: '#1A1A1A', fontWeight: '500' }}>{activeCategory.name}</span>
                            </>
                        ) : (
                            <span style={{ color: '#1A1A1A', fontWeight: '500' }}>{t('shop_title')}</span>
                        )}
                        {activeSearch && (
                            <>
                                <span style={{ color: '#C8A96E' }}>›</span>
                                <span style={{ color: '#1A1A1A', fontWeight: '500' }}>"{activeSearch}"</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Barre filtres */}
            <div className="border-b sticky top-16 z-40 bg-white shadow-sm" style={{ borderColor: '#E8E2D9' }}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-2 overflow-x-auto py-2.5">
                        <SortDropdown activeSort={activeSort} onChange={changeSort} />
                        {categories.length > 0 && <div className="h-5 w-px flex-shrink-0 mx-1" style={{ backgroundColor: '#E8E2D9' }} />}
                        {activeCategory && (
                            <button onClick={() => filterByCategory(null)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border whitespace-nowrap transition-colors" style={{ borderColor: '#D4CFC8', color: '#9A9490', backgroundColor: 'white' }}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                                {t('shop_all')}
                            </button>
                        )}
                        {categories.map((cat) => (
                            <button key={cat.id} onClick={() => filterByCategory(cat.slug)} className="flex-shrink-0 px-4 py-1.5 text-xs font-medium transition-all whitespace-nowrap border" style={activeCategory?.slug === cat.slug ? { backgroundColor: '#1A1A1A', color: 'white', borderColor: '#1A1A1A' } : { backgroundColor: 'white', color: '#6B6560', borderColor: '#E8E2D9' }} onMouseEnter={(e) => { if (activeCategory?.slug !== cat.slug) { e.currentTarget.style.borderColor = '#C8A96E'; e.currentTarget.style.color = '#C8A96E'; }}} onMouseLeave={(e) => { if (activeCategory?.slug !== cat.slug) { e.currentTarget.style.borderColor = '#E8E2D9'; e.currentTarget.style.color = '#6B6560'; }}}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vue catégories */}
            {!activeCategory && categories.length > 0 && (
                <section className="border-b py-12" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D9' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-xs tracking-[0.4em] uppercase mb-6 font-light" style={{ color: '#C8A96E' }}>{t('shop_browse_tag')}</p>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button key={cat.id} onClick={() => filterByCategory(cat.slug)} className="group flex items-center gap-3 px-5 py-3 border bg-white transition-all hover:shadow-sm" style={{ borderColor: '#E8E2D9' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C8A96E'; e.currentTarget.style.backgroundColor = '#F0EBE1'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E2D9'; e.currentTarget.style.backgroundColor = 'white'; }}>
                                    <span className="font-serif text-sm" style={{ color: '#1A1A1A' }}>{cat.name}</span>
                                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: '#C8A96E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Grille produits */}
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        {products.length} {products.length > 1 ? t('shop_products_count_plural') : t('shop_products_count')}
                        {activeCategory && <span style={{ color: '#C8A96E' }}> · {activeCategory.name}</span>}
                        {activeSearch && <span style={{ color: '#C8A96E' }}> · {t('shop_search_label')} "{activeSearch}"</span>}
                    </p>
                    {activeSearch && (
                        <button onClick={clearSearch} className="flex items-center gap-1.5 text-xs font-light hover:opacity-70 transition-opacity" style={{ color: '#9A9490' }}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            {t('shop_clear_search')}
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-24 border" style={{ borderColor: '#E8E2D9' }}>
                        <div className="h-px w-8 mx-auto mb-8" style={{ backgroundColor: '#C8A96E' }}></div>
                        <p className="font-serif text-xl mb-3" style={{ color: '#1A1A1A' }}>{t('shop_no_products')}</p>
                        <p className="text-sm font-light mb-6" style={{ color: '#9A9490' }}>
                            {activeSearch ? `${t('shop_no_results')} "${activeSearch}".` : activeCategory ? `${t('shop_no_in_category')} "${activeCategory.name}"${t('shop_no_category_suffix')}` : t('shop_being_prepared')}
                        </p>
                        {activeCategory && (
                            <button onClick={() => filterByCategory(null)} className="text-xs font-medium underline" style={{ color: '#C8A96E' }}>
                                {t('shop_view_all')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <Pagination pagination={pagination} onPageChange={goToPage} />
            </div>
        </PublicLayout>
    );
}
