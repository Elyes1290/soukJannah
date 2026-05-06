import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

/* ── Styles partagés ── */
const inputStyle = {
    width: '100%',
    border: '1px solid #D4CFC8',
    backgroundColor: 'white',
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: '#1A1A1A',
    outline: 'none',
    transition: 'border-color 0.2s',
};

function SectionCard({ title, children }) {
    return (
        <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#F0EBE1' }}>
                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#9A9490' }}>{title}</p>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

function Field({ label, hint, error, children }) {
    return (
        <div>
            <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                {label}
            </label>
            {children}
            {hint && !error && <p className="text-xs font-light mt-1.5" style={{ color: '#9A9490' }}>{hint}</p>}
            {error && <p className="text-xs mt-1.5" style={{ color: '#E07070' }}>{error}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, label, hint }) {
    return (
        <div className="flex items-start gap-3">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className="relative flex-shrink-0 transition-colors mt-0.5"
                style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: checked ? '#C8A96E' : '#D4CFC8',
                }}
            >
                <span
                    className="absolute bg-white shadow-sm transition-all"
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        top: '3px',
                        left: checked ? '19px' : '3px',
                    }}
                />
            </button>
            <div>
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{label}</p>
                {hint && <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{hint}</p>}
            </div>
        </div>
    );
}

/* ── Zone de dépôt image principale ── */
function MainImageDropzone({ currentUrl, file, onChange }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const previewUrl = file ? URL.createObjectURL(file) : currentUrl;

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) onChange(f);
    };

    return (
        <div>
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className="cursor-pointer border-2 border-dashed transition-all flex items-center justify-center overflow-hidden"
                style={{
                    borderColor: dragging ? '#C8A96E' : '#D4CFC8',
                    backgroundColor: dragging ? 'rgba(200,169,110,0.04)' : '#FAFAF9',
                    height: '220px',
                    borderRadius: '2px',
                }}
            >
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        <img src={previewUrl} alt="Aperçu" className="w-full h-full object-contain" />
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        >
                            <p className="text-white text-xs font-medium tracking-widest uppercase">Changer l'image</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center px-4">
                        <svg className="w-8 h-8 mx-auto mb-3" style={{ color: '#C8A96E', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm font-medium mb-1" style={{ color: '#6B6560' }}>Glisser-déposer ou cliquer</p>
                        <p className="text-xs font-light" style={{ color: '#9A9490' }}>JPG, PNG · max 4 Mo</p>
                    </div>
                )}
            </div>
            {previewUrl && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ''; }}
                    className="text-xs font-light mt-2 hover:opacity-60 transition-opacity"
                    style={{ color: '#E07070' }}
                >
                    Retirer l'image
                </button>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files[0] ?? null)} />
        </div>
    );
}

/* ── Zone de dépôt images galerie ── */
function GalleryDropzone({ files, onChange }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        onChange([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Aperçu des fichiers sélectionnés */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {files.map((file, i) => (
                        <div key={i} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-20 h-20 object-cover border"
                                style={{ borderColor: '#E8E2D9' }}
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
                                style={{ backgroundColor: '#E07070' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {/* Zone de dépôt */}
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className="cursor-pointer border-2 border-dashed flex items-center justify-center gap-3 px-4 py-5 transition-all"
                style={{
                    borderColor: dragging ? '#C8A96E' : '#D4CFC8',
                    backgroundColor: dragging ? 'rgba(200,169,110,0.04)' : '#FAFAF9',
                }}
            >
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#C8A96E', opacity: 0.6 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <div>
                    <p className="text-sm font-medium" style={{ color: '#6B6560' }}>
                        {files.length > 0 ? 'Ajouter d\'autres images' : 'Glisser-déposer ou cliquer'}
                    </p>
                    <p className="text-xs font-light" style={{ color: '#9A9490' }}>Sélection multiple possible · JPG, PNG · max 4 Mo chacune</p>
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onChange([...files, ...Array.from(e.target.files)])}
            />
        </div>
    );
}

/* ── Formulaire principal ── */
export default function ProductForm({ product, categories }) {
    const isEdit = !!product;
    const { errors: pageErrors } = usePage().props;
    const formTopRef = useRef(null);

    const { data, setData, post, processing } = useForm({
        name:              product?.name ?? '',
        short_description: product?.short_description ?? '',
        description:       product?.description ?? '',
        price:             product?.price ?? '',
        sale_price:        product?.sale_price ?? '',
        stock:             product?.stock ?? 0,
        sku:               product?.sku ?? '',
        category_id:       product?.category_id ?? '',
        is_active:         product?.is_active ?? true,
        is_featured:       product?.is_featured ?? false,
        main_image:        null,
        images:            [],
    });

    // Utilise les erreurs de la page Inertia (capturées quelle que soit la méthode d'envoi)
    const errors = pageErrors ?? {};
    const errorList = Object.values(errors).flat().filter(Boolean);

    // Scroll vers le haut si des erreurs apparaissent
    useEffect(() => {
        if (errorList.length > 0 && formTopRef.current) {
            formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [errorList.length]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            router.post(`/admin/produits/${product.id}`, { ...data, _method: 'PUT' }, { forceFormData: true });
        } else {
            post('/admin/produits', { forceFormData: true });
        }
    };

    const deleteExistingImage = (imageId) => {
        if (confirm('Supprimer cette image ?')) {
            router.delete(`/admin/images/${imageId}`, { preserveScroll: true });
        }
    };

    const focus = (e) => e.target.style.borderColor = '#C8A96E';
    const blur  = (e) => e.target.style.borderColor = '#D4CFC8';

    return (
        <AdminLayout title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}>
            <Head title={isEdit ? 'Modifier produit' : 'Nouveau produit'} />

            <div className="mb-6" ref={formTopRef}>
                <Link href="/admin/produits" className="inline-flex items-center gap-2 text-xs font-light hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Retour aux produits
                </Link>
            </div>

            {/* Bandeau d'erreurs */}
            {errorList.length > 0 && (
                <div className="max-w-3xl mb-5 border-l-4 p-4" style={{ borderColor: '#E07070', backgroundColor: 'rgba(224,112,112,0.06)' }}>
                    <p className="text-xs font-medium mb-2" style={{ color: '#E07070' }}>
                        Le formulaire contient {errorList.length} erreur{errorList.length > 1 ? 's' : ''} — veuillez les corriger avant de sauvegarder :
                    </p>
                    <ul className="space-y-1">
                        {errorList.map((err, i) => (
                            <li key={i} className="text-xs font-light flex items-start gap-2" style={{ color: '#C05050' }}>
                                <span className="flex-shrink-0 mt-0.5">—</span>
                                {err}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={submit} className="max-w-3xl space-y-5">

                {/* Informations générales */}
                <SectionCard title="Informations générales">
                    <Field label="Nom du produit *" error={errors.name}>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            style={inputStyle}
                            onFocus={focus} onBlur={blur}
                            placeholder="Ex : Tapis de prière premium"
                            autoFocus
                        />
                    </Field>

                    <Field label="Accroche courte" hint="Affichée sous le nom sur les cartes produit">
                        <input
                            type="text"
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                            style={inputStyle}
                            onFocus={focus} onBlur={blur}
                            placeholder="Résumé en une phrase"
                        />
                    </Field>

                    <Field label="Description complète">
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                            onFocus={focus} onBlur={blur}
                            placeholder="Description détaillée du produit, matières, dimensions..."
                        />
                    </Field>

                    <Field label="Catégorie">
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            onFocus={focus} onBlur={blur}
                        >
                            <option value="">Sans catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </Field>
                </SectionCard>

                {/* Prix & stock */}
                <SectionCard title="Prix & stock">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Prix (CHF) *" error={errors.price}>
                            <input
                                type="number" step="0.01" min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                style={inputStyle}
                                onFocus={focus} onBlur={blur}
                                placeholder="49.00"
                            />
                        </Field>
                        <Field label="Prix promo (CHF)" hint="Laissez vide si aucune promo">
                            <input
                                type="number" step="0.01" min="0"
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value)}
                                style={inputStyle}
                                onFocus={focus} onBlur={blur}
                                placeholder="39.00"
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Stock *" error={errors.stock}>
                            <input
                                type="number" min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                style={inputStyle}
                                onFocus={focus} onBlur={blur}
                                placeholder="10"
                            />
                        </Field>
                        <Field label="SKU" hint="Code interne unique (optionnel)">
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                                onFocus={focus} onBlur={blur}
                                placeholder="TAPIS-001"
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* Images */}
                <SectionCard title="Images">
                    <Field label="Image principale" hint="Apparaît sur les cartes produit et en premier sur la page produit">
                        <MainImageDropzone
                            currentUrl={product?.main_image_url ?? null}
                            file={data.main_image}
                            onChange={(f) => setData('main_image', f)}
                        />
                    </Field>

                    {/* Images galerie existantes */}
                    {product?.images?.length > 0 && (
                        <Field label="Galerie actuelle" hint="Cliquez sur × pour supprimer une image">
                            <div className="flex flex-wrap gap-3">
                                {product.images.map((img) => (
                                    <div key={img.id} className="relative group">
                                        <img
                                            src={img.url}
                                            alt=""
                                            className="w-20 h-20 object-cover border"
                                            style={{ borderColor: '#E8E2D9' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(img.id)}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ backgroundColor: '#E07070' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Field>
                    )}

                    <Field label="Ajouter des images à la galerie" hint="Ces images s'affichent dans la galerie de la page produit">
                        <GalleryDropzone
                            files={data.images}
                            onChange={(files) => setData('images', files)}
                        />
                    </Field>
                </SectionCard>

                {/* Visibilité */}
                <SectionCard title="Visibilité">
                    <Toggle
                        checked={data.is_active}
                        onChange={(v) => setData('is_active', v)}
                        label="Produit actif"
                        hint="Visible dans la boutique et les résultats de recherche"
                    />
                    <Toggle
                        checked={data.is_featured}
                        onChange={(v) => setData('is_featured', v)}
                        label="Produit en vedette"
                        hint="Affiché sur la page d'accueil dans la section best-sellers"
                    />
                </SectionCard>

                {/* Actions */}
                <div className="flex items-center gap-4 pb-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 text-xs font-medium tracking-wider uppercase transition-all"
                        style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}
                        onMouseEnter={(e) => { if (!processing) e.target.style.backgroundColor = '#C8A96E'; }}
                        onMouseLeave={(e) => { if (!processing) e.target.style.backgroundColor = '#1A1A1A'; }}
                    >
                        {processing ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
                    </button>
                    <Link
                        href="/admin/produits"
                        className="px-6 py-3 text-xs font-medium tracking-wider uppercase border transition-colors"
                        style={{ borderColor: '#D4CFC8', color: '#9A9490' }}
                    >
                        Annuler
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
