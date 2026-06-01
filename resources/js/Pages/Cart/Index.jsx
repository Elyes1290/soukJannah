import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle, withBrand } from '../../i18n/docTitle';

function CartItem({ item }) {
    const { t } = useT();
    const updateQty = (qty) => router.patch(`/panier/${item.product_id}`, { quantity: qty });
    const remove = () => router.delete(`/panier/${item.product_id}`);

    return (
        <div className="flex items-center gap-5 py-6 border-b" style={{ borderColor: '#E8E2D9' }}>
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#F0EBE1' }}>
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <Link href={`/boutique/${item.slug}`} className="font-serif text-sm hover:opacity-60 transition-opacity block" style={{ color: '#1A1A1A' }}>
                    {item.name}
                </Link>
                <p className="text-xs font-light mt-1" style={{ color: '#9A9490' }}>{item.price.toFixed(2)} CHF {t('cart_unit')}</p>
            </div>
            <div className="flex items-center border" style={{ borderColor: '#D4CFC8' }}>
                <button onClick={() => updateQty(item.quantity - 1)} className="px-3 py-2 text-xs hover:opacity-50 transition-opacity" style={{ color: '#1A1A1A' }}>—</button>
                <span className="px-4 py-2 text-xs font-medium border-x" style={{ borderColor: '#D4CFC8', minWidth: '2.5rem', textAlign: 'center', color: '#1A1A1A' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-3 py-2 text-xs hover:opacity-50 transition-opacity disabled:opacity-20" style={{ color: '#1A1A1A' }}>+</button>
            </div>
            <div className="text-sm font-medium w-24 text-right" style={{ color: '#1A1A1A' }}>{(item.price * item.quantity).toFixed(2)} CHF</div>
            <button onClick={remove} className="text-lg font-light hover:opacity-40 transition-opacity ml-2" style={{ color: '#9A9490' }}>×</button>
        </div>
    );
}

function PromoField({ discountCode }) {
    const { t, translateFlash } = useT();
    const { flash } = usePage().props;
    const [open, setOpen] = useState(!!discountCode || !!flash?.discount_error || !!flash?.discount_success);
    const { data, setData, post, processing } = useForm({ code: '' });

    const apply = (e) => {
        e.preventDefault();
        post('/panier/promo', { preserveScroll: true, onSuccess: () => setData('code', '') });
    };
    const remove = () => router.delete('/panier/promo', { preserveScroll: true });

    return (
        <div className="mb-4">
            {flash?.discount_success && (
                <p className="text-xs font-medium mb-2" style={{ color: '#7B9E87' }}>
                    {translateFlash(flash.discount_success)}
                </p>
            )}
            {discountCode ? (
                <div className="flex items-center justify-between p-3 border" style={{ borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.06)' }}>
                    <div>
                        <p className="text-xs font-medium" style={{ color: '#C8A96E' }}>
                            {t('cart_promo_code_label')} <strong>{discountCode.code}</strong> {t('cart_promo_applied')}
                        </p>
                        <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                            {discountCode.type === 'percent' ? `-${discountCode.value}%` : `-${parseFloat(discountCode.value).toFixed(2)} CHF`}
                        </p>
                    </div>
                    <button onClick={remove} className="text-xs font-light hover:opacity-60 transition-opacity" style={{ color: '#E07070' }}>
                        {t('cart_promo_remove')}
                    </button>
                </div>
            ) : (
                <>
                    <button onClick={() => setOpen(!open)} className="text-xs font-light hover:opacity-60 transition-opacity underline" style={{ color: '#9A9490' }}>
                        {open ? t('cart_promo_hide') : t('cart_promo_question')}
                    </button>
                    {open && (
                        <form onSubmit={apply} className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={data.code}
                                onChange={e => setData('code', e.target.value.toUpperCase())}
                                placeholder={t('cart_promo_placeholder')}
                                className="flex-1 px-3 py-2 text-xs font-medium border outline-none"
                                style={{ borderColor: flash?.discount_error ? '#E07070' : '#D4CFC8', color: '#1A1A1A', letterSpacing: '0.1em' }}
                                onFocus={e => e.target.style.borderColor = '#C8A96E'}
                                onBlur={e => e.target.style.borderColor = flash?.discount_error ? '#E07070' : '#D4CFC8'}
                                required
                            />
                            <button type="submit" disabled={processing} className="px-4 py-2 text-xs font-medium tracking-widest uppercase transition-opacity" style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}>
                                {t('cart_promo_apply_btn')}
                            </button>
                        </form>
                    )}
                    {flash?.discount_error && <p className="text-xs mt-1 font-light" style={{ color: '#E07070' }}>{translateFlash(flash.discount_error)}</p>}
                </>
            )}
        </div>
    );
}

export default function CartIndex({ cart }) {
    const { t } = useT();

    if (cart.items.length === 0) {
        return (
            <PublicLayout>
                <Head title={docTitle(t, t('cart_title'))}>
                    <meta head-key="description" name="description" content={t('meta_cart', withBrand(t))} />
                </Head>
                <div className="max-w-xl mx-auto px-4 py-32 text-center">
                    <div className="h-px w-10 mx-auto mb-10" style={{ backgroundColor: '#C8A96E' }}></div>
                    <h1 className="font-serif text-3xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('cart_empty_title')}</h1>
                    <p className="text-sm font-light mb-10" style={{ color: '#9A9490' }}>{t('cart_empty_desc')}</p>
                    <Link href="/boutique" className="btn-primary" style={{ letterSpacing: '0.15em' }}>{t('cart_empty_cta')}</Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('cart_title'))}>
                <meta head-key="description" name="description" content={t('meta_cart', withBrand(t))} />
            </Head>
            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('cart_tag')}</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>
                    {t('cart_title')} <span className="text-xl font-light" style={{ color: '#9A9490' }}>({cart.count})</span>
                </h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                    <div className="lg:col-span-2">
                        {cart.items.map((item) => (
                            <CartItem key={item.product_id} item={item} />
                        ))}
                        <div className="mt-6">
                            <button onClick={() => router.delete('/panier')} className="text-xs font-light hover:opacity-50 transition-opacity" style={{ color: '#9A9490' }}>
                                {t('cart_clear')}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border p-8 sticky top-24" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                            <p className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: '#1A1A1A' }}>{t('cart_summary')}</p>

                            <PromoField discountCode={cart.discount_code} />

                            {/* Barre livraison offerte */}
                            {cart.shipping > 0 && (() => {
                                const FREE_THRESHOLD = 80;
                                const missing = Math.max(0, FREE_THRESHOLD - cart.subtotal);
                                const pct = Math.min(100, (cart.subtotal / FREE_THRESHOLD) * 100);
                                return (
                                    <div className="mb-6 p-3 border" style={{ borderColor: '#D4CFC8', backgroundColor: 'white' }}>
                                        <p className="text-xs font-light mb-2" style={{ color: '#6B6560' }}>
                                            {missing > 0
                                                ? <>{t('cart_only')} <strong style={{ color: '#C8A96E' }}>{missing.toFixed(2)} CHF</strong> {t('cart_free_shipping_away')}</>
                                                : <span style={{ color: '#C8A96E' }}>{t('cart_free_shipping_unlocked')}</span>
                                            }
                                        </p>
                                        <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', backgroundColor: '#E8E2D9' }}>
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: '#C8A96E' }} />
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between font-light" style={{ color: '#6B6560' }}>
                                    <span>{t('cart_subtotal')}</span>
                                    <span>{cart.subtotal.toFixed(2)} CHF</span>
                                </div>
                                <div className="flex justify-between font-light" style={{ color: '#6B6560' }}>
                                    <span>{t('cart_shipping')}</span>
                                    <span style={{ color: cart.shipping === 0 ? '#C8A96E' : '#6B6560' }}>
                                        {cart.shipping === 0 ? t('common_free') : `${cart.shipping.toFixed(2)} CHF`}
                                    </span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between font-light" style={{ color: '#C8A96E' }}>
                                        <span>{t('cart_discount')}</span>
                                        <span>−{cart.discount.toFixed(2)} CHF</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-5 mb-8" style={{ borderColor: '#D4CFC8' }}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs tracking-widest uppercase font-medium" style={{ color: '#1A1A1A' }}>{t('cart_total')}</span>
                                    <span className="font-serif text-xl" style={{ color: '#1A1A1A' }}>{cart.total.toFixed(2)} CHF</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full text-center block" style={{ letterSpacing: '0.1em' }}>
                                {t('cart_checkout')}
                            </Link>

                            {/* Badge paiement sécurisé */}
                            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#D4CFC8' }}>
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#9A9490' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>{t('cart_secure_payment')}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    {/* Visa */}
                                    <div className="px-2 py-1 border rounded" style={{ borderColor: '#E8E2D9', backgroundColor: 'white' }}>
                                        <svg viewBox="0 0 50 16" width="36" height="12" fill="none">
                                            <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#1A1F71">VISA</text>
                                        </svg>
                                    </div>
                                    {/* Mastercard */}
                                    <div className="px-1.5 py-1 border rounded" style={{ borderColor: '#E8E2D9', backgroundColor: 'white' }}>
                                        <svg viewBox="0 0 38 24" width="32" height="16">
                                            <circle cx="14" cy="12" r="10" fill="#EB001B"/>
                                            <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
                                            <path d="M19 5.5a10 10 0 0 1 0 13A10 10 0 0 1 19 5.5z" fill="#FF5F00"/>
                                        </svg>
                                    </div>
                                    {/* Stripe */}
                                    <div className="px-2 py-1 border rounded" style={{ borderColor: '#E8E2D9', backgroundColor: 'white' }}>
                                        <svg viewBox="0 0 60 25" width="36" height="14" fill="none">
                                            <text x="0" y="18" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#635BFF">stripe</text>
                                        </svg>
                                    </div>
                                    {/* Twint */}
                                    <div className="px-2 py-1 border rounded" style={{ borderColor: '#E8E2D9', backgroundColor: 'white' }}>
                                        <svg viewBox="0 0 60 25" width="36" height="14" fill="none">
                                            <text x="0" y="18" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#000">TWINT</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <Link href="/boutique" className="block text-center text-xs font-light mt-4 hover:opacity-50 transition-opacity" style={{ color: '#9A9490' }}>
                                {t('cart_continue')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
