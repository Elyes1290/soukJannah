import { router, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function StarDisplay({ rating }) {
    return (
        <span style={{ color: '#C8A96E' }}>
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </span>
    );
}

export default function ReviewsIndex({ reviews, filter, counts }) {
    const { flash } = usePage().props;

    const toggle = (id) => router.put(`/admin/avis/${id}`, {}, { preserveScroll: true });
    const destroy = (id) => {
        if (!confirm('Supprimer définitivement cet avis ?')) return;
        router.delete(`/admin/avis/${id}`, { preserveScroll: true });
    };

    const FILTERS = [
        { key: 'all',      label: 'Tous',              count: counts.all },
        { key: 'pending',  label: 'En attente',         count: counts.pending },
        { key: 'approved', label: 'Approuvés',          count: counts.approved },
    ];

    return (
        <AdminLayout title="Modération des avis">
            {flash?.success && (
                <div className="mb-6 px-4 py-3 text-sm rounded" style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                    {flash.success}
                </div>
            )}

            {/* En-tête */}
            <div className="mb-6">
                <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                    Les avis sont soumis par de vrais clients après un achat vérifié. Approuvez ou supprimez-les ici.
                </p>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        onClick={() => router.get('/admin/avis', { filter: f.key }, { preserveScroll: true })}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border transition-colors"
                        style={{
                            borderColor: filter === f.key ? '#1A1A1A' : '#E8E2D9',
                            backgroundColor: filter === f.key ? '#1A1A1A' : 'white',
                            color: filter === f.key ? 'white' : '#6B6560',
                        }}
                    >
                        {f.label}
                        <span className="px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: filter === f.key ? 'rgba(255,255,255,0.2)' : '#F0EBE1', color: filter === f.key ? 'white' : '#9A9490' }}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Liste */}
            {reviews.length === 0 ? (
                <div className="border border-dashed p-16 text-center" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                        {filter === 'pending' ? 'Aucun avis en attente de validation.' : 'Aucun avis pour le moment.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map(r => (
                        <div key={r.id} className="border p-5" style={{ borderColor: r.is_active ? '#E8E2D9' : '#FED7AA', backgroundColor: r.is_active ? 'white' : '#FFFBF5' }}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">

                                    {/* En-tête de l'avis */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                                        <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{r.author}</span>
                                        <StarDisplay rating={r.rating} />
                                        {r.is_verified && (
                                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F0F9F0', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Achat vérifié
                                            </span>
                                        )}
                                        {!r.is_active && (
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF7ED', color: '#d97706', border: '1px solid #fed7aa' }}>
                                                En attente
                                            </span>
                                        )}
                                    </div>

                                    {/* Produit concerné */}
                                    {r.product_name && (
                                        <p className="text-xs mb-2" style={{ color: '#9A9490' }}>
                                            Produit : <a href={`/boutique/${r.product_slug}`} target="_blank" className="underline" style={{ color: '#C8A96E' }}>{r.product_name}</a>
                                        </p>
                                    )}

                                    {/* Contenu */}
                                    <p className="text-sm font-light leading-relaxed mb-2" style={{ color: '#6B6560' }}>{r.content}</p>

                                    {/* Méta */}
                                    <p className="text-xs font-light" style={{ color: '#C4BFBA' }}>
                                        {r.created_at}
                                        {r.customer_email && <> · {r.customer_email}</>}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => toggle(r.id)}
                                        className="px-3 py-1.5 text-xs font-medium border transition-colors"
                                        style={r.is_active
                                            ? { borderColor: '#D4CFC8', color: '#6B6560' }
                                            : { borderColor: '#16a34a', color: '#16a34a', backgroundColor: '#F0FDF4' }
                                        }
                                    >
                                        {r.is_active ? 'Masquer' : '✓ Approuver'}
                                    </button>
                                    <button
                                        onClick={() => destroy(r.id)}
                                        className="px-3 py-1.5 text-xs font-medium border transition-colors"
                                        style={{ borderColor: '#F5C6C6', color: '#C53030' }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
