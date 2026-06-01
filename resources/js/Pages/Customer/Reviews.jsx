import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

function StarPicker({ value, onChange }) {
    const { t } = useT();
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                    aria-label={t('review_star_n', { n })}
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

function StarDisplay({ rating }) {
    return (
        <span className="text-base" style={{ color: '#C8A96E' }}>
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </span>
    );
}

export default function CustomerReviews({ reviews, reviewableProducts }) {
    const { t } = useT();
    const [showForm, setShowForm] = useState(false);

    const form = useForm({ product_id: '', order_id: '', rating: 5, content: '' });

    const handleProductChange = (e) => {
        const selected = reviewableProducts.find(p => String(p.product_id) === e.target.value);
        form.setData({
            ...form.data,
            product_id: e.target.value,
            order_id: selected ? String(selected.order_id) : '',
        });
    };

    const submit = (e) => {
        e.preventDefault();
        form.post('/mon-compte/avis', {
            onSuccess: () => {
                form.reset();
                setShowForm(false);
            },
        });
    };

    return (
        <CustomerLayout title={t('account_nav_reviews')}>
            <Head title={docTitle(t, t('account_nav_reviews'))} />

            {/* Écrire un avis */}
            {reviewableProducts.length > 0 && (
                <div className="mb-8">
                    {!showForm ? (
                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-3 border text-sm font-medium transition-colors hover:border-amber-600"
                            style={{ borderColor: '#C8A96E', color: '#C8A96E', borderStyle: 'dashed' }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {t('review_write')}
                        </button>
                    ) : (
                        <div className="border p-6" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-5" style={{ color: '#1A1A1A' }}>{t('review_write')}</p>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="review-product" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('review_for_product')}</label>
                                    <select id="review-product" value={form.data.product_id} onChange={handleProductChange}
                                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                                        style={{ borderColor: form.errors.product_id ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }} required>
                                        <option value="">{t('review_select_product')}</option>
                                        {reviewableProducts.map(p => (
                                            <option key={p.product_id} value={p.product_id}>
                                                {p.product_name} — {p.order_number}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.product_id && <p className="mt-1 text-xs text-red-600">{form.errors.product_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('review_rating')}</label>
                                    <StarPicker value={form.data.rating} onChange={v => form.setData('rating', v)} />
                                </div>
                                <div>
                                    <label htmlFor="review-content" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('review_comment')}</label>
                                    <textarea id="review-content" value={form.data.content} onChange={e => form.setData('content', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600 resize-none"
                                        style={{ borderColor: form.errors.content ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                        placeholder={t('review_placeholder')} required />
                                    {form.errors.content && <p className="mt-1 text-xs text-red-600">{t(form.errors.content)}</p>}
                                </div>
                                {form.errors.duplicate_review && <p className="mb-2 text-xs text-red-600">{t(form.errors.duplicate_review)}</p>}
                                <div className="flex items-center gap-3">
                                    <button type="submit" disabled={form.processing}
                                        className="px-7 py-2.5 text-xs font-medium uppercase tracking-widest disabled:opacity-50"
                                        style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                                        {form.processing ? t('account_saving') : t('review_submit')}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)}
                                        className="px-7 py-2.5 text-xs font-medium uppercase tracking-widest border"
                                        style={{ borderColor: '#D4CDBF', color: '#6B6560' }}>
                                        {t('addr_cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Mes avis */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 border" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-3xl mb-3">⭐</p>
                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>{t('review_none')}</p>
                    {reviewableProducts.length === 0 && (
                        <p className="text-xs font-light mt-2" style={{ color: '#9A9490' }}>{t('review_need_order')}</p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="border p-5" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div>
                                    <StarDisplay rating={review.rating} />
                                    {review.product_name && (
                                        <p className="text-xs font-medium mt-1" style={{ color: '#1A1A1A' }}>{review.product_name}</p>
                                    )}
                                    <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{review.created_at}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border`}
                                    style={review.is_active
                                        ? { backgroundColor: '#F0F9F0', color: '#16a34a', borderColor: '#bbf7d0' }
                                        : { backgroundColor: '#FFF7ED', color: '#d97706', borderColor: '#fed7aa' }
                                    }>
                                    {review.is_active ? t('review_published') : t('review_pending')}
                                </span>
                            </div>
                            <p className="text-sm font-light leading-relaxed" style={{ color: '#1A1A1A' }}>{review.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
