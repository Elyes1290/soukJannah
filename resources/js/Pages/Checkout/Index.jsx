import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle, withBrand } from '../../i18n/docTitle';

export default function CheckoutIndex({ cart }) {
    const { t, lang } = useT();
    const [orderNote, setOrderNote]     = useState('');
    const [isGift, setIsGift]           = useState(false);
    const [giftMessage, setGiftMessage] = useState('');

    const handleCheckout = () => router.post('/checkout', {
        locale:       lang,
        order_note:   orderNote.trim() || null,
        gift_message: isGift ? (giftMessage.trim() || null) : null,
    });

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('checkout_title'))}>
                <meta head-key="description" name="description" content={t('meta_checkout', withBrand(t))} />
            </Head>
            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('checkout_tag')}</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('checkout_summary')}</h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                    <div className="lg:col-span-2 space-y-0">
                        <p className="text-xs tracking-widest uppercase mb-5 font-medium" style={{ color: '#1A1A1A' }}>{t('checkout_items')}</p>
                        {cart.items.map((item) => (
                            <div key={item.product_id} className="flex items-center gap-4 py-5 border-b" style={{ borderColor: '#E8E2D9' }}>
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#F0EBE1' }}>
                                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{ backgroundColor: '#F0EBE1' }}></div>}
                                </div>
                                <div className="flex-1">
                                    <p className="font-serif text-sm" style={{ color: '#1A1A1A' }}>{item.name}</p>
                                    <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{t('checkout_qty')} {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{(item.price * item.quantity).toFixed(2)} CHF</p>
                            </div>
                        ))}
                        {/* Note de commande */}
                        <div className="pt-8">
                            <label htmlFor="checkout-order-note" className="text-xs tracking-widest uppercase mb-3 font-medium block" style={{ color: '#1A1A1A' }}>
                                {t('checkout_order_note_optional')}
                            </label>
                            <textarea
                                id="checkout-order-note"
                                value={orderNote}
                                onChange={e => setOrderNote(e.target.value)}
                                rows={2}
                                maxLength={300}
                                placeholder={t('checkout_order_note_placeholder')}
                                className="w-full border px-4 py-3 text-sm font-light focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                                style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4', color: '#1A1A1A' }}
                            />
                        </div>

                        {/* Message cadeau */}
                        <div className="pt-5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    className="w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-colors"
                                    style={{ borderColor: isGift ? '#C8A96E' : '#D4CFC8', backgroundColor: isGift ? '#C8A96E' : 'transparent' }}
                                    onClick={() => setIsGift(!isGift)}
                                >
                                    {isGift && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                                </div>
                                <span className="text-sm font-light" style={{ color: '#1A1A1A' }}>
                                    🎁 {t('checkout_is_gift')}
                                </span>
                            </label>
                            {isGift && (
                                <textarea
                                    id="checkout-gift-message"
                                    value={giftMessage}
                                    onChange={e => setGiftMessage(e.target.value)}
                                    rows={2}
                                    maxLength={300}
                                    placeholder={t('checkout_gift_message_placeholder')}
                                    aria-label={t('checkout_gift_message_placeholder')}
                                    className="w-full mt-3 border px-4 py-3 text-sm font-light focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none"
                                    style={{ borderColor: '#C8A96E', backgroundColor: '#FFF8ED', color: '#1A1A1A' }}
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="border p-8 sticky top-24" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1' }}>
                            <p className="text-xs tracking-widest uppercase mb-6 font-medium" style={{ color: '#1A1A1A' }}>{t('checkout_total')}</p>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between font-light" style={{ color: '#6B6560' }}>
                                    <span>{t('checkout_subtotal')}</span>
                                    <span>{cart.subtotal.toFixed(2)} CHF</span>
                                </div>
                                <div className="flex justify-between font-light" style={{ color: '#6B6560' }}>
                                    <span>{t('checkout_shipping')}</span>
                                    <span style={{ color: cart.shipping === 0 ? '#C8A96E' : '#6B6560' }}>
                                        {cart.shipping === 0 ? t('common_free_simple') : `${cart.shipping.toFixed(2)} CHF`}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-5 mb-8" style={{ borderColor: '#D4CFC8' }}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs tracking-widest uppercase font-medium" style={{ color: '#1A1A1A' }}>{t('checkout_total')}</span>
                                    <span className="font-serif text-xl" style={{ color: '#1A1A1A' }}>{cart.total.toFixed(2)} CHF</span>
                                </div>
                            </div>
                            <button type="button" onClick={handleCheckout} className="w-full py-4 text-xs font-medium uppercase transition-colors" style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#C8A96E'} onMouseLeave={(e) => e.target.style.backgroundColor = '#1A1A1A'}>
                                {t('checkout_pay')}
                            </button>
                            <div className="mt-5 flex items-center justify-center gap-2">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#9A9490' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-xs font-light" style={{ color: '#9A9490' }}>{t('checkout_secure')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
