import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

function Lightbox({ src, alt, onClose }) {
    const close = useCallback((e) => {
        if (e.target === e.currentTarget || e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', close);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', close);
            document.body.style.overflow = '';
        };
    }, [close]);

    return (
        <div
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.9)', cursor: 'zoom-out' }}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl font-light leading-none hover:opacity-60 transition-opacity"
                style={{ lineHeight: 1 }}
            >
                ×
            </button>
            <img
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                style={{ cursor: 'default' }}
                onClick={e => e.stopPropagation()}
            />
        </div>
    );
}

function StarRating({ rating, size = 'base' }) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const sz = size === 'sm' ? 'text-sm' : 'text-base';
    return (
        <span className={sz} style={{ color: '#C8A96E' }}>
            {'★'.repeat(full)}
            {half ? '½' : ''}
            {'☆'.repeat(empty)}
        </span>
    );
}

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                    className="text-2xl transition-transform hover:scale-110"
                    style={{ color: (hovered || value) >= n ? '#C8A96E' : '#D4CDBF' }}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}>
                    ★
                </button>
            ))}
        </div>
    );
}

function ReviewForm({ product, orderId, t }) {
    const { props } = usePage();
    const [submitted, setSubmitted] = useState(!!props.review_success);
    const form = useForm({ order_id: String(orderId), rating: 5, content: '' });

    if (submitted) {
        return (
            <div className="border p-6 text-center" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#16a34a' }}>✓ {t('review_thanks')}</p>
                <p className="text-xs font-light" style={{ color: '#9A9490' }}>{t('review_pending_approval')}</p>
            </div>
        );
    }

    const submit = (e) => {
        e.preventDefault();
        form.post(`/boutique/${product.slug}/avis`, {
            onSuccess: () => setSubmitted(true),
        });
    };

    return (
        <div className="border p-6" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
            <p className="text-xs tracking-widest uppercase font-medium mb-5" style={{ color: '#1A1A1A' }}>{t('review_write')}</p>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('review_rating')}</label>
                    <StarPicker value={form.data.rating} onChange={v => form.setData('rating', v)} />
                </div>
                <div>
                    <label className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('review_comment')}</label>
                    <textarea value={form.data.content} onChange={e => form.setData('content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600 resize-none"
                        style={{ borderColor: form.errors.content ? '#dc2626' : '#D4CDBF', backgroundColor: 'white' }}
                        placeholder={t('review_placeholder')} required />
                    {form.errors.content && <p className="mt-1 text-xs text-red-600">{form.errors.content}</p>}
                </div>
                <button type="submit" disabled={form.processing}
                    className="px-8 py-3 text-xs font-medium uppercase tracking-widest disabled:opacity-50 transition-colors"
                    style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                    {form.processing ? '...' : t('review_submit')}
                </button>
            </form>
        </div>
    );
}

function AccordionItem({ title, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-t" style={{ borderColor: '#E8E2D9' }}>
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#1A1A1A' }}>{title}</span>
                <svg className="w-4 h-4 flex-shrink-0 transition-transform" style={{ transform: open ? 'rotate(45deg)' : 'none', color: '#C8A96E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            {open && <div className="pb-5 text-sm font-light leading-relaxed" style={{ color: '#6B6560' }}>{children}</div>}
        </div>
    );
}

export default function ShopShow({ product, auth }) {
    const { t } = useT();
    const [selectedImage, setSelectedImage] = useState(product.main_image_url);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const addToCart = () => {
        router.post('/panier/ajouter', { product_id: product.id, quantity }, {
            onSuccess: () => { setAdded(true); setTimeout(() => setAdded(false), 2000); },
        });
    };

    const allImages = [
        ...(product.main_image_url ? [{ url: product.main_image_url }] : []),
        ...product.images,
    ];

    return (
        <PublicLayout>
            {lightboxOpen && <Lightbox src={selectedImage} alt={product.name} onClose={() => setLightboxOpen(false)} />}
            <Head title={`${product.name} — SoukJannah`}>
                <meta head-key="og:type"        property="og:type"        content="product" />
                <meta head-key="og:title"       property="og:title"       content={product.og.title} />
                <meta head-key="og:description" property="og:description" content={product.og.description} />
                <meta head-key="og:url"         property="og:url"         content={product.og.url} />
                {product.og.image && <meta head-key="og:image" property="og:image" content={product.og.image} />}
                <meta head-key="twitter:card"        name="twitter:card"        content="summary_large_image" />
                <meta head-key="twitter:title"       name="twitter:title"       content={product.og.title} />
                <meta head-key="twitter:description" name="twitter:description" content={product.og.description} />
                {product.og.image && <meta head-key="twitter:image" name="twitter:image" content={product.og.image} />}
            </Head>

            {/* Fil d'ariane */}
            <div className="border-b" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                        <Link href="/boutique" className="hover:text-gray-700 transition-colors">{t('product_breadcrumb_shop')}</Link>
                        <span className="mx-2" style={{ color: '#C8A96E' }}>›</span>
                        <span style={{ color: '#1A1A1A' }}>{product.name}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Images */}
                    <div>
                        <div
                            className="aspect-square overflow-hidden mb-4 relative group"
                            style={{ backgroundColor: '#F0EBE1', cursor: selectedImage ? 'zoom-in' : 'default' }}
                            onClick={() => selectedImage && setLightboxOpen(true)}
                        >
                            {selectedImage ? (
                                <>
                                    <img src={selectedImage} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#1A1A1A' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ color: '#C8A96E', opacity: 0.3 }}>
                                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-3">
                                {allImages.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(img.url)} className="overflow-hidden border-2 transition-colors flex-shrink-0" style={{ width: '72px', height: '72px', borderColor: selectedImage === img.url ? '#C8A96E' : 'transparent', backgroundColor: '#F0EBE1' }}>
                                        <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Infos produit */}
                    <div className="flex flex-col justify-center">
                        {product.category && (
                            <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{product.category}</p>
                        )}

                        <h1 className="font-serif text-3xl md:text-4xl font-normal mb-2" style={{ color: '#1A1A1A' }}>{product.name}</h1>

                        {/* Note moyenne */}
                        {product.avg_rating ? (
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating rating={product.avg_rating} />
                                <span className="text-sm font-light" style={{ color: '#6B6560' }}>
                                    {product.avg_rating} ({product.reviews_count} {product.reviews_count > 1 ? t('reviews_count_plural') : t('reviews_count_singular')})
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs font-light mb-4" style={{ color: '#9A9490' }}>{t('reviews_none_yet')}</p>
                        )}

                        <div className="h-px w-10 mb-6" style={{ backgroundColor: '#C8A96E' }}></div>

                        {/* Prix */}
                        <div className="flex items-baseline gap-3 mb-6">
                            {product.sale_price ? (
                                <>
                                    <span className="text-2xl font-medium" style={{ color: '#C8A96E' }}>{product.sale_price} CHF</span>
                                    <span className="text-base line-through font-light" style={{ color: '#9A9490' }}>{product.price} CHF</span>
                                </>
                            ) : (
                                <span className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>{product.price} CHF</span>
                            )}
                        </div>

                        {product.short_description && (
                            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: '#6B6560' }}>{product.short_description}</p>
                        )}

                        {product.stock > 0 ? (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: '#1A1A1A' }}>{t('product_qty')}</p>
                                    <div className="flex items-center border" style={{ borderColor: '#D4CFC8', width: 'fit-content' }}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-sm transition-colors hover:opacity-50" style={{ color: '#1A1A1A' }}>—</button>
                                        <span className="px-6 py-3 text-sm font-medium border-x" style={{ borderColor: '#D4CFC8', color: '#1A1A1A' }}>{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="px-4 py-3 text-sm transition-colors hover:opacity-50 disabled:opacity-20" style={{ color: '#1A1A1A' }}>+</button>
                                    </div>
                                </div>

                                <button onClick={addToCart} className="w-full py-4 text-xs font-medium tracking-[0.15em] uppercase transition-all" style={{ backgroundColor: added ? '#C8A96E' : '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}>
                                    {added ? t('product_added') : t('product_add_to_cart')}
                                </button>

                                <p className="text-xs font-light text-center" style={{ color: '#9A9490' }}>
                                    {t('product_delivery_text')}
                                </p>
                            </div>
                        ) : (
                            <div className="py-4 text-center border" style={{ borderColor: '#E8E2D9' }}>
                                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>{t('product_out_of_stock')}</p>
                            </div>
                        )}

                        {/* Accordéons */}
                        <div className="mt-8">
                            {product.description && (
                                <AccordionItem title={t('product_description')}>
                                    <p className="whitespace-pre-line">{product.description}</p>
                                </AccordionItem>
                            )}
                            <AccordionItem title={t('product_delivery')}>
                                <p>{t('product_delivery_text')}</p>
                            </AccordionItem>
                            <AccordionItem title={t('product_returns')}>
                                <p>{t('product_returns_text')}</p>
                            </AccordionItem>
                        </div>
                    </div>
                </div>
            </div>
            {/* ── Section avis ──────────────────────────────────────────────── */}
            <div className="border-t" style={{ borderColor: '#E8E2D9' }}>
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="font-serif text-2xl font-normal" style={{ color: '#1A1A1A' }}>
                            {t('reviews_title')}
                            {product.reviews_count > 0 && (
                                <span className="ml-3 text-base font-light" style={{ color: '#9A9490' }}>({product.reviews_count})</span>
                            )}
                        </h2>
                        {product.avg_rating && (
                            <div className="flex items-center gap-2">
                                <StarRating rating={product.avg_rating} />
                                <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{product.avg_rating} / 5</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Colonne gauche : formulaire ou CTA */}
                        <div>
                            {auth?.can_review ? (
                                <ReviewForm product={product} orderId={auth.review_order_id} t={t} />
                            ) : auth?.already_reviewed && auth?.review_pending ? (
                                <div className="border p-5 text-center" style={{ borderColor: '#C8A96E', backgroundColor: '#FAF8F4' }}>
                                    <p className="text-sm font-medium mb-1" style={{ color: '#C8A96E' }}>✓ {t('review_thanks')}</p>
                                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>{t('review_pending_approval')}</p>
                                </div>
                            ) : auth?.already_reviewed ? (
                                null
                            ) : auth?.customer ? (
                                <div className="border p-5 text-center" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                    <p className="text-xs font-light leading-relaxed" style={{ color: '#9A9490' }}>{t('reviews_after_purchase')}{' '}
                                        <Link href="/mon-compte/avis" className="underline" style={{ color: '#C8A96E' }}>{t('account_nav_reviews')}</Link>
                                    </p>
                                </div>
                            ) : (
                                <div className="border p-5 text-center" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                    <p className="text-sm font-light mb-4" style={{ color: '#6B6560' }}>{t('reviews_prompt_login')}</p>
                                    <Link
                                        href={`/mon-compte/connexion?redirect=/boutique/${product.slug}`}
                                        className="inline-block px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors"
                                        style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                                    >
                                        {t('reviews_login_to_review')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Colonne droite : liste des avis */}
                        <div className="lg:col-span-2">
                            {product.reviews.length === 0 ? (
                                <div className="text-center py-10 border" style={{ borderColor: '#E8E2D9' }}>
                                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>{t('reviews_be_first')}</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {product.reviews.map(review => (
                                        <div key={review.id} className="border p-5" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div>
                                                    <StarRating rating={review.rating} size="sm" />
                                                    <p className="text-sm font-medium mt-1" style={{ color: '#1A1A1A' }}>{review.author}</p>
                                                </div>
                                                <p className="text-xs font-light flex-shrink-0" style={{ color: '#9A9490' }}>{review.created_at}</p>
                                            </div>
                                            <p className="text-sm font-light leading-relaxed" style={{ color: '#6B6560' }}>{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
