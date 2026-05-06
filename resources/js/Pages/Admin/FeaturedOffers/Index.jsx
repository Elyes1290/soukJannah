import { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ─── Toggle ─────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex-shrink-0 relative inline-flex items-center rounded-full transition-colors duration-200"
            style={{
                width: '40px', height: '22px',
                backgroundColor: checked ? '#C8A96E' : '#3A3530',
            }}
        >
            <span
                className="inline-block rounded-full bg-white transition-transform duration-200"
                style={{
                    width: '16px', height: '16px',
                    transform: checked ? 'translateX(20px)' : 'translateX(3px)',
                }}
            />
        </button>
    );
}

/* ─── Formulaire (création / édition) ────────────────────────────────── */
function OfferForm({ offer, onCancel }) {
    const isEdit = !!offer;
    const imageRef = useRef(null);
    const [preview, setPreview] = useState(offer?.image_url || null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title:          offer?.title          || '',
        description:    offer?.description    || '',
        items:          offer?.items          || '',
        price:          offer?.price          || '',
        original_price: offer?.original_price || '',
        url:            offer?.url            || '/boutique',
        sort_order:     offer?.sort_order     ?? 0,
        is_active:      offer?.is_active      ?? true,
        image:          null,
        _method:        isEdit ? 'PUT' : undefined,
    });

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => { reset(); onCancel(); },
        };
        if (isEdit) {
            post(`/admin/offres/${offer.id}`, options);
        } else {
            post('/admin/offres', options);
        }
    };

    const labelStyle = { color: '#6B6560', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px',
        backgroundColor: '#1A1A1A', color: '#FAF8F4',
        border: '1px solid #2C2C2C', outline: 'none',
    };

    return (
        <form onSubmit={submit} className="space-y-5 p-6 rounded-xl" style={{ backgroundColor: '#111111' }}>
            <h3 className="font-serif text-base font-normal" style={{ color: '#FAF8F4' }}>
                {isEdit ? `Modifier "${offer.title}"` : 'Nouvelle offre phare'}
            </h3>

            {/* Titre + Actif */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label style={labelStyle}>Titre *</label>
                    <input
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        style={inputStyle}
                        required
                    />
                    {errors.title && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.title}</p>}
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center gap-3">
                        <Toggle checked={data.is_active} onChange={v => setData('is_active', v)} />
                        <span className="text-xs" style={{ color: '#9A9490' }}>
                            {data.is_active ? 'Visible sur le site' : 'Masquée'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label style={labelStyle}>Description</label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </div>

            {/* Articles du coffret */}
            <div>
                <label style={labelStyle}>Articles inclus (une ligne = un article)</label>
                <textarea
                    value={data.items}
                    onChange={e => setData('items', e.target.value)}
                    rows={4}
                    placeholder={"Tapis de prière premium\nTasbih élégant\nParfum sans alcool"}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
                />
            </div>

            {/* Prix */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label style={labelStyle}>Prix affiché</label>
                    <input
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        placeholder="49 CHF"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Prix barré</label>
                    <input
                        value={data.original_price}
                        onChange={e => setData('original_price', e.target.value)}
                        placeholder="79 CHF"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>URL du bouton</label>
                    <input
                        value={data.url}
                        onChange={e => setData('url', e.target.value)}
                        placeholder="/boutique"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Ordre */}
            <div className="w-24">
                <label style={labelStyle}>Ordre d'affichage</label>
                <input
                    type="number"
                    min={0}
                    value={data.sort_order}
                    onChange={e => setData('sort_order', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                />
            </div>

            {/* Image */}
            <div>
                <label style={labelStyle}>Image du coffret</label>
                <div
                    className="rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                    style={{ backgroundColor: '#1A1A1A', border: '1px dashed #3A3530', minHeight: '120px', position: 'relative' }}
                    onClick={() => imageRef.current?.click()}
                >
                    {preview ? (
                        <img src={preview} alt="preview" className="w-full h-full object-cover" style={{ maxHeight: '200px' }} />
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-8">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#3A3530' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0L16.5 9M13.5 12l2.25 2.25" />
                            </svg>
                            <p className="text-xs" style={{ color: '#5A5550' }}>Cliquer pour choisir une image</p>
                        </div>
                    )}
                    <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </div>
                {preview && (
                    <button
                        type="button"
                        className="mt-2 text-xs"
                        style={{ color: '#E07070' }}
                        onClick={() => { setPreview(null); setData('image', null); if (imageRef.current) imageRef.current.value = ''; }}
                    >
                        Supprimer l'image
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 text-xs font-medium tracking-widest uppercase rounded transition-opacity"
                    style={{ backgroundColor: '#C8A96E', color: '#1A1A1A', opacity: processing ? 0.6 : 1 }}
                >
                    {processing ? 'Enregistrement…' : (isEdit ? 'Mettre à jour' : 'Créer l\'offre')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 text-xs font-medium tracking-widest uppercase rounded transition-opacity"
                    style={{ backgroundColor: '#2C2C2C', color: '#9A9490' }}
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}

/* ─── Page principale ─────────────────────────────────────────────────── */
export default function FeaturedOffersIndex({ offers }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const deleteOffer = (offer) => {
        if (!confirm(`Supprimer "${offer.title}" ?`)) return;
        router.delete(`/admin/offres/${offer.id}`);
    };

    const toggleActive = (offer) => {
        router.put(`/admin/offres/${offer.id}`, {
            ...offer,
            is_active: !offer.is_active,
            image: null,
            _method: 'PUT',
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Offres phares">
            <div className="max-w-3xl">

                {/* En-tête */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-2xl font-normal" style={{ color: '#1A1A1A' }}>
                            Offres phares
                        </h1>
                        <p className="text-xs mt-1" style={{ color: '#9A9490' }}>
                            Gérez les coffrets mis en avant sur la page d'accueil
                        </p>
                    </div>
                    {!showCreate && (
                        <button
                            onClick={() => { setShowCreate(true); setEditingId(null); }}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-widest uppercase rounded transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#1A1A1A', color: '#C8A96E' }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Ajouter une offre
                        </button>
                    )}
                </div>

                {/* Formulaire de création */}
                {showCreate && (
                    <div className="mb-6">
                        <OfferForm onCancel={() => setShowCreate(false)} />
                    </div>
                )}

                {/* Liste des offres */}
                <div className="space-y-4">
                    {offers.length === 0 && !showCreate && (
                        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#F0EBE1' }}>
                            <svg className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#C8A96E' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <p className="text-sm font-light" style={{ color: '#9A9490' }}>Aucune offre phare pour le moment</p>
                            <button
                                onClick={() => setShowCreate(true)}
                                className="mt-4 text-xs tracking-widest uppercase"
                                style={{ color: '#C8A96E' }}
                            >
                                Créer la première offre →
                            </button>
                        </div>
                    )}

                    {offers.map((offer) => (
                        <div key={offer.id}>
                            {editingId === offer.id ? (
                                <OfferForm offer={offer} onCancel={() => setEditingId(null)} />
                            ) : (
                                <div
                                    className="flex items-center gap-4 p-4 rounded-xl"
                                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D4' }}
                                >
                                    {/* Image miniature */}
                                    <div
                                        className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
                                        style={{ backgroundColor: '#F0EBE1' }}
                                    >
                                        {offer.image_url ? (
                                            <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: '#C8A96E' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Infos */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{offer.title}</p>
                                        {(offer.price || offer.original_price) && (
                                            <div className="flex items-baseline gap-2 mt-0.5">
                                                {offer.price && <span className="text-xs font-semibold" style={{ color: '#C8A96E' }}>{offer.price}</span>}
                                                {offer.original_price && <span className="text-xs line-through" style={{ color: '#9A9490' }}>{offer.original_price}</span>}
                                            </div>
                                        )}
                                        <p className="text-xs mt-0.5" style={{ color: '#9A9490' }}>
                                            Ordre : {offer.sort_order} · URL : {offer.url}
                                        </p>
                                    </div>

                                    {/* Toggle actif */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Toggle checked={offer.is_active} onChange={() => toggleActive(offer)} />
                                        <span className="text-xs w-16" style={{ color: offer.is_active ? '#C8A96E' : '#5A5550' }}>
                                            {offer.is_active ? 'Visible' : 'Masquée'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => { setEditingId(offer.id); setShowCreate(false); }}
                                            className="px-3 py-1.5 text-xs rounded transition-colors"
                                            style={{ backgroundColor: '#F0EBE1', color: '#1A1A1A' }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => deleteOffer(offer)}
                                            className="px-3 py-1.5 text-xs rounded transition-colors"
                                            style={{ backgroundColor: 'rgba(224,112,112,0.08)', color: '#E07070' }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Note d'explication */}
                {offers.length > 0 && (
                    <p className="mt-6 text-xs" style={{ color: '#9A9490' }}>
                        Les offres actives apparaissent sur la page d'accueil, dans l'ordre défini ci-dessus.
                        Vous pouvez en ajouter autant que vous souhaitez.
                    </p>
                )}
            </div>
        </AdminLayout>
    );
}
