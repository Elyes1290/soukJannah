import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

function CategoryForm({ initial, onCancel, submitUrl, method = 'post', submitLabel, parentOptions = [] }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:        initial?.name ?? '',
        description: initial?.description ?? '',
        is_active:   initial?.is_active ?? true,
        parent_id:   initial?.parent_id ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); onCancel?.(); } };
        if (method === 'put') put(submitUrl, options);
        else post(submitUrl, options);
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
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                    style={inputStyle} placeholder="Ex : Viande halal" autoFocus
                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                    onBlur={e => e.target.style.borderColor = '#D4CFC8'} />
                {errors.name && <p className="text-xs mt-1.5" style={{ color: '#E07070' }}>{errors.name}</p>}
            </div>

            {/* Catégorie parente */}
            <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                    Catégorie parente <span style={{ color: '#9A9490' }}>(laisser vide = catégorie principale)</span>
                </label>
                <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
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
                <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                    style={{ ...inputStyle, resize: 'none', height: '80px' }}
                    onFocus={e => e.target.style.borderColor = '#C8A96E'}
                    onBlur={e => e.target.style.borderColor = '#D4CFC8'}
                    placeholder="Description optionnelle..." />
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => setData('is_active', !data.is_active)}
                    className="relative flex-shrink-0 transition-colors"
                    style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: data.is_active ? '#C8A96E' : '#D4CFC8' }}>
                    <span className="absolute bg-white shadow-sm transition-all"
                        style={{ width: '14px', height: '14px', borderRadius: '50%', top: '3px', left: data.is_active ? '19px' : '3px' }} />
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
    const [editingId, setEditingId] = useState(null);

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
                                                    <td colSpan={4} className="px-8 py-5">
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
                                                    <td className="pl-10 pr-5 py-3">
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
