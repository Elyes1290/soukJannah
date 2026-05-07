import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import WishlistButton from '../../Components/WishlistButton';

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

const RECENTLY_VIEWED_KEY = 'sj_recently_viewed';
const MAX_RECENTLY_VIEWED  = 6;

function getRecentlyViewed() {
    try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); }
    catch { return []; }
}

function saveRecentlyViewed(product) {
    const items   = getRecentlyViewed().filter(p => p.id !== product.id);
    const updated = [{ id: product.id, name: product.name, slug: product.slug, price: product.price, sale_price: product.sale_price, image: product.main_image_url }, ...items].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
}

export default function ShopShow({ product, auth }) {
    const { t, lang } = useT();
    const { authCustomer } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(product.main_image_url);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [copied, setCopied] = useState(false);

    const shareWhatsApp = () => {
        const url = window.location.href;
        const text = lang === 'fr'
            ? `Regarde ce produit sur SoukJannah : ${product.name} — ${url}`
            : `Check out this product on SoukJannah: ${product.name} — ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Enregistre ce produit dans les récemment vus au montage
    useEffect(() => {
        const prev = getRecentlyViewed().filter(p => p.id !== product.id);
        setRecentlyViewed(prev.slice(0, 5)); // Affiche les autres (sans le produit actuel)
        saveRecentlyViewed(product);
    }, [product.id]);

    // Alerte retour en stock
    const [alertEmail, setAlertEmail] = useState(authCustomer?.email || '');
    const [alertSent, setAlertSent] = useState(false);
    const [alertLoading, setAlertLoading] = useState(false);

    const subscribeStockAlert = async (e) => {
        e.preventDefault();
        if (!alertEmail || alertLoading) return;
        setAlertLoading(true);
        try {
            const res = await fetch('/stock-alert/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ product_id: product.id, email: alertEmail, locale: lang }),
            });
            if (res.ok) setAlertSent(true);
        } catch { /* silent */ } finally {
            setAlertLoading(false);
        }
    };

    const addToCart = () => {
        router.post('/panier/ajouter', { product_id: product.id, quantity }, {
            onSuccess: () => { setAdded(true); setTimeout(() => setAdded(false), 2000); },
        });
    };

    const allImages = [
        ...(product.main_image_url ? [{ url: product.main_image_url }] : []),
        ...product.images,
    ];

    const avgRating   = product.reviews?.length
        ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
        : null;
    const reviewCount = product.reviews?.length ?? 0;

    const schemaOrg = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        description: product.short_description || product.description || '',
        sku: product.sku || undefined,
        brand: { '@type': 'Brand', name: 'SoukJannah' },
        image: allImages.map(i => i.url || i.path).filter(Boolean),
        offers: {
            '@type': 'Offer',
            url: product.og?.url || window.location.href,
            priceCurrency: 'CHF',
            price: product.sale_price ? parseFloat(product.sale_price).toFixed(2) : parseFloat(product.price).toFixed(2),
            priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'SoukJannah' },
        },
        ...(avgRating && reviewCount > 0 ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: avgRating,
                reviewCount: reviewCount,
                bestRating: '5',
                worstRating: '1',
            },
            review: product.reviews.slice(0, 5).map(r => ({
                '@type': 'Review',
                author: { '@type': 'Person', name: r.author },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: r.rating,
                    bestRating: '5',
                    worstRating: '1',
                },
                reviewBody: r.content,
                datePublished: r.created_at,
            })),
        } : {}),
    };

    return (
        <PublicLayout>
            {lightboxOpen && <Lightbox src={selectedImage} alt={product.name} onClose={() => setLightboxOpen(false)} />}
            <Head title={`${product.name} — SoukJannah`}>
                <meta head-key="description" name="description" content={(product.og?.description || product.short_description || product.name).slice(0, 170)} />
                <meta head-key="og:type"        property="og:type"        content="product" />
                <meta head-key="og:title"       property="og:title"       content={product.og.title} />
                <meta head-key="og:description" property="og:description" content={product.og.description} />
                <meta head-key="og:url"         property="og:url"         content={product.og.url} />
                {product.og.image && <meta head-key="og:image" property="og:image" content={product.og.image} />}
                <meta head-key="twitter:card"        name="twitter:card"        content="summary_large_image" />
                <meta head-key="twitter:title"       name="twitter:title"       content={product.og.title} />
                <meta head-key="twitter:description" name="twitter:description" content={product.og.description} />
                {product.og.image && <meta head-key="twitter:image" name="twitter:image" content={product.og.image} />}
                <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
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

                                <div className="flex gap-3">
                                    <button onClick={addToCart} className="flex-1 py-4 text-xs font-medium tracking-[0.15em] uppercase transition-all" style={{ backgroundColor: added ? '#C8A96E' : '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}>
                                        {added ? t('product_added') : t('product_add_to_cart')}
                                    </button>
                                    <WishlistButton productId={product.id} size="lg" className="border flex-shrink-0" style={{ borderColor: '#E8E2D9' }} />
                                </div>

                                <p className="text-xs font-light text-center" style={{ color: '#9A9490' }}>
                                    {t('product_delivery_text')}
                                </p>

                                {/* Partage */}
                                <div className="flex items-center gap-3 pt-1">
                                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>
                                        {lang === 'fr' ? 'Partager' : 'Share'}
                                    </span>
                                    <button onClick={shareWhatsApp} title="WhatsApp" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-light border transition-colors hover:bg-green-50" style={{ borderColor: '#E8E2D9', color: '#25D366' }}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        WhatsApp
                                    </button>
                                    <button onClick={copyLink} title={lang === 'fr' ? 'Copier le lien' : 'Copy link'} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-light border transition-colors hover:bg-gray-50" style={{ borderColor: '#E8E2D9', color: copied ? '#7B9E87' : '#6B6560' }}>
                                        {copied ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/></svg>
                                        )}
                                        {copied ? (lang === 'fr' ? 'Copié !' : 'Copied!') : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border p-5" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                <p className="text-xs tracking-widest uppercase font-medium mb-3" style={{ color: '#9A9490' }}>
                                    {t('product_out_of_stock')}
                                </p>
                                {alertSent ? (
                                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#C8A96E' }}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {lang === 'fr' ? 'Vous serez notifié(e) dès le retour en stock !' : 'You will be notified when back in stock!'}
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs mb-3 font-light" style={{ color: '#6B6560' }}>
                                            {lang === 'fr' ? 'Laissez votre email pour être prévenu(e) dès que ce produit est disponible.' : 'Leave your email to be notified as soon as this product is available.'}
                                        </p>
                                        <form onSubmit={subscribeStockAlert} className="flex gap-0">
                                            <input
                                                type="email"
                                                value={alertEmail}
                                                onChange={e => setAlertEmail(e.target.value)}
                                                placeholder={lang === 'fr' ? 'Votre email' : 'Your email'}
                                                required
                                                className="flex-1 px-3 py-2.5 text-sm outline-none border"
                                                style={{ borderColor: '#D4CFC8', borderRight: 'none' }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={alertLoading}
                                                className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider flex-shrink-0 transition-opacity disabled:opacity-50"
                                                style={{ backgroundColor: '#1A1A1A', color: '#FAF8F4', letterSpacing: '0.1em' }}
                                            >
                                                {lang === 'fr' ? 'Me prévenir' : 'Notify me'}
                                            </button>
                                        </form>
                                    </>
                                )}
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
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{review.author}</p>
                                                        {review.verified_purchase && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EEF7F0', color: '#3A7A50' }}>
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                {lang === 'fr' ? 'Achat vérifié' : 'Verified purchase'}
                                                            </span>
                                                        )}
                                                    </div>
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

            {/* Récemment vus */}
            {recentlyViewed.length > 0 && (
                <section className="border-t py-12" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-xs tracking-[0.3em] uppercase font-medium mb-6" style={{ color: '#9A9490' }}>
                            {lang === 'fr' ? 'Récemment consultés' : 'Recently viewed'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {recentlyViewed.map(p => {
                                const displayPrice = p.sale_price ? p.sale_price : p.price;
                                return (
                                    <Link key={p.id} href={`/boutique/${p.slug}`} className="group block">
                                        <div className="aspect-square overflow-hidden mb-2" style={{ backgroundColor: '#F0EBE1' }}>
                                            {p.image
                                                ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                                : <div className="w-full h-full flex items-center justify-center" style={{ color: '#C8A96E' }}>
                                                    <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                  </div>
                                            }
                                        </div>
                                        <p className="text-xs font-light line-clamp-2 mb-1" style={{ color: '#1A1A1A' }}>{p.name}</p>
                                        <p className="text-xs font-medium" style={{ color: '#C8A96E' }}>{parseFloat(displayPrice).toFixed(2)} CHF</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
