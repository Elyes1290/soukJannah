import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

function CategoryForm({ initial, onCancel, submitUrl, method = 'post', submitLabel, parentOptions = [] }) {
    const [name, setName]             = useState(initial?.name ?? '');
    const [description, setDesc]      = useState(initial?.description ?? '');
    const [isActive, setActive]       = useState(initial?.is_active ?? true);
    const [parentId, setParentId]     = useState(initial?.parent_id ?? '');
    const [imageFile, setImageFile]   = useState(null);
    const [removeImage, setRemove]    = useState(false);
    const [preview, setPreview]       = useState(initial?.image ? `/storage/${initial.image}` : null);
    const [processing, setProcessing] = useState(false);
    const fileRef = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setRemove(false);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemove = () => {
        setImageFile(null);
        setRemove(true);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const payload = { name, description, is_active: isActive, parent_id: parentId || '' };
        if (imageFile)   payload.image = imageFile;
        if (removeImage) payload.remove_image = 1;

        const opts = {
            forceFormData: true,
            onSuccess: () => { setProcessing(false); onCancel?.(); },
            onError: () => setProcessing(false),
        };

        if (method === 'put') {
            payload._method = 'PUT';
            router.post(submitUrl, payload, opts);
        } else {
            router.post(submitUrl, payload, opts);
        }
    };

    const inputStyle = {
        width: '100%', border: '1px solid #D4CFC8', backgroundColor: 'white',
        padding: '0.625rem 0.875rem', fontSize: '0.875rem', color: '#1A1A1A',
        outline: 'none', transition: 'border-color 0.2s',
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                    Nom *
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                    style={inputStyle} placeholder="Ex : Viande halal" autoFocus
                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                    onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
            </div>

            {/* Catégorie parente */}
            <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                    Catégorie parente <span style={{ color: '#9A9490' }}>(laisser vide = catégorie principale)</span>
                </label>
                <select value={parentId} onChange={e => setParentId(e.target.value)}
                    style={{ ...inputStyle, appearance: 'auto' }}
                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                    onBlur={e => e.target.style.borderColor = '#D4CFC8'}>
                    <option value="">— Catégorie principale —</option>
                    {parentOptions.filter(p => p.id !== initial?.id).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>Description</label>
                <textarea value={description} onChange={e => setDesc(e.target.value)}
                    style={{ ...inputStyle, resize: 'none', height: '80px' }}
                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                    onBlur={e => e.target.style.borderColor = '#D4CFC8'}
                    placeholder="Description optionnelle..." />
            </div>

            {/* Image */}
            <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                    Image <span style={{ color: '#9A9490' }}>(optionnel — recommandé pour les sous-catégories)</span>
                </label>
                <div className="flex items-center gap-4">
                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-full border" style={{ borderColor: '#E8E2D9' }} />
                            <button type="button" onClick={handleRemove}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ backgroundColor: '#E07070' }}>✕</button>
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors"
                            style={{ borderColor: '#D4CFC8' }}
                            onClick={() => fileRef.current?.click()}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#C8A96E' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 12h18M3 6h18" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        <button type="button" onClick={() => fileRef.current?.click()}
                            className="px-3 py-2 text-xs font-medium border hover:bg-gray-50 transition-colors"
                            style={{ borderColor: '#D4CFC8', color: '#6B6560' }}>
                            {preview ? 'Changer l\'image' : 'Choisir une image'}
                        </button>
                        <p className="text-xs mt-1" style={{ color: '#9A9490' }}>JPG, PNG — max 2 Mo</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setActive(!isActive)}
                    className="relative flex-shrink-0 transition-colors"
                    style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: isActive ? '#C8A96E' : '#D4CFC8' }}>
                    <span className="absolute bg-white shadow-sm transition-all"
                        style={{ width: '14px', height: '14px', borderRadius: '50%', top: '3px', left: isActive ? '19px' : '3px' }} />
                </button>
                <span className="text-xs font-medium" style={{ color: '#6B6560' }}>Catégorie active</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={processing}
                    className="px-5 py-2.5 text-xs font-medium tracking-wider uppercase"
                    style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}>
                    {processing ? 'Enregistrement...' : submitLabel}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className="px-4 py-2.5 text-xs font-medium tracking-wider uppercase border"
                        style={{ borderColor: '#D4CFC8', color: '#9A9490' }}>
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
}

export default function CategoriesIndex({ categories, parentOptions = [] }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId]   = useState(null);
    const { props: { flash } }        = usePage();

    const handleDelete = (category) => {
        if ((category.products_count ?? 0) > 0) {
            alert(`Impossible de supprimer "${category.name}" : des produits y sont rattachés.`);
            return;
        }
        if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AdminLayout title="Catégories">
            <Head title="Catégories" />

            {flash?.success && (
                <div className="mb-4 px-4 py-3 text-sm font-light border-l-4" style={{ backgroundColor: '#f0fdf4', borderColor: '#16a34a', color: '#16a34a' }}>
                    ✓ {flash.success}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                    {categories.length} catégorie{categories.length > 1 ? 's' : ''} principale{categories.length > 1 ? 's' : ''}
                </p>
                {!showCreate && (
                    <button onClick={() => { setShowCreate(true); setEditingId(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase"
                        style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C8A96E'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1A1A1A'}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nouvelle catégorie
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="bg-white border mb-5 p-6" style={{ borderColor: '#C8A96E' }}>
                    <p className="text-xs tracking-widest uppercase font-medium mb-5" style={{ color: '#C8A96E' }}>Nouvelle catégorie</p>
                    <CategoryForm submitUrl="/admin/categories" submitLabel="Créer" parentOptions={parentOptions}
                        onCancel={() => setShowCreate(false)} />
                </div>
            )}

            {categories.length === 0 && !showCreate ? (
                <div className="bg-white border p-16 text-center" style={{ borderColor: '#E8E2D9' }}>
                    <p className="font-serif text-base mb-2" style={{ color: '#1A1A1A' }}>Aucune catégorie</p>
                    <button onClick={() => setShowCreate(true)} className="text-xs font-medium underline" style={{ color: '#C8A96E' }}>
                        Créer une catégorie →
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                            {/* Catégorie principale */}
                            {editingId === cat.id ? (
                                <div className="px-5 py-5">
                                    <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#C8A96E' }}>
                                        Modifier : {cat.name}
                                    </p>
                                    <CategoryForm initial={cat} submitUrl={`/admin/categories/${cat.id}`} method="put"
                                        submitLabel="Enregistrer" parentOptions={parentOptions}
                                        onCancel={() => setEditingId(null)} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F0EBE1', backgroundColor: '#FAF8F4' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.is_active ? '#7B9E87' : '#D4CFC8' }} />
                                        <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{cat.name}</span>
                                        <span className="text-xs" style={{ color: '#9A9490' }}>
                                            {(cat.children?.length ?? 0)} sous-catégorie{(cat.children?.length ?? 0) > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => { setEditingId(cat.id); setShowCreate(false); }}
                                            className="text-xs font-medium hover:opacity-60" style={{ color: '#1A1A1A' }}>
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(cat)}
                                            className="text-xs font-medium hover:opacity-60" style={{ color: '#E07070' }}>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Sous-catégories */}
                            {cat.children?.length > 0 && (
                                <table className="w-full">
                                    <tbody>
                                        {cat.children.map(sub => (
                                            editingId === sub.id ? (
                                                <tr key={sub.id}>
                                                    <td colSpan={5} className="px-8 py-5">
                                                        <p className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: '#C8A96E' }}>
                                                            Modifier : {sub.name}
                                                        </p>
                                                        <CategoryForm initial={sub} submitUrl={`/admin/categories/${sub.id}`} method="put"
                                                            submitLabel="Enregistrer" parentOptions={parentOptions}
                                                            onCancel={() => setEditingId(null)} />
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={sub.id} className="border-b group hover:bg-amber-50/30" style={{ borderColor: '#F5F2EE' }}>
                                                    <td className="pl-10 pr-3 py-3 w-10">
                                                        {sub.image ? (
                                                            <img src={`/storage/${sub.image}`} alt={sub.name}
                                                                className="w-8 h-8 rounded-full object-cover border"
                                                                style={{ borderColor: '#E8E2D9' }} />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                                style={{ backgroundColor: '#F0EBE1', color: '#C8A96E' }}>
                                                                {sub.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: '#C8A96E', fontSize: '10px' }}>└</span>
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sub.is_active ? '#7B9E87' : '#D4CFC8' }} />
                                                            <span className="text-sm" style={{ color: '#1A1A1A' }}>{sub.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-xs font-light" style={{ color: '#9A9490' }}>{sub.description || '—'}</td>
                                                    <td className="px-5 py-3">
                                                        <span className="inline-block px-2 py-0.5 text-xs rounded-full"
                                                            style={sub.is_active
                                                                ? { backgroundColor: 'rgba(123,158,135,0.12)', color: '#7B9E87' }
                                                                : { backgroundColor: 'rgba(154,148,144,0.12)', color: '#9A9490' }}>
                                                            {sub.is_active ? '● Active' : '○ Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setEditingId(sub.id); setShowCreate(false); }}
                                                                className="text-xs font-medium hover:opacity-60" style={{ color: '#1A1A1A' }}>
                                                                Modifier
                                                            </button>
                                                            <button onClick={() => handleDelete(sub)}
                                                                className="text-xs font-medium hover:opacity-60" style={{ color: '#E07070' }}>
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
