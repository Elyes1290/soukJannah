import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex-shrink-0 relative inline-flex items-center rounded-full transition-colors duration-200"
            style={{ width: '40px', height: '22px', backgroundColor: checked ? '#C8A96E' : '#3A3530' }}
        >
            <span
                className="inline-block rounded-full bg-white transition-transform duration-200"
                style={{ width: '16px', height: '16px', transform: checked ? 'translateX(20px)' : 'translateX(3px)' }}
            />
        </button>
    );
}

function CodeForm({ code, onCancel }) {
    const isEdit = !!code;
    const { data, setData, post, processing, errors } = useForm({
        code:       code?.code       || '',
        type:       code?.type       || 'percent',
        value:      code?.value      || '',
        min_amount: code?.min_amount || '',
        max_uses:   code?.max_uses   || '',
        is_active:  code?.is_active  ?? true,
        expires_at: code?.expires_at ? code.expires_at.substring(0, 10) : '',
        _method:    isEdit ? 'PUT' : undefined,
    });

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit ? `/admin/codes-promo/${code.id}` : '/admin/codes-promo';
        post(url, { onSuccess: onCancel });
    };

    const labelStyle = { color: '#6B6560', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
    const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', backgroundColor: '#1A1A1A', color: '#FAF8F4', border: '1px solid #2C2C2C', outline: 'none' };

    return (
        <form onSubmit={submit} className="space-y-5 p-6 rounded-xl" style={{ backgroundColor: '#111111' }}>
            <h3 className="font-serif text-base font-normal" style={{ color: '#FAF8F4' }}>
                {isEdit ? `Modifier "${code.code}"` : 'Nouveau code promo'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label style={labelStyle}>Code *</label>
                    <input
                        value={data.code}
                        onChange={e => setData('code', e.target.value.toUpperCase())}
                        style={{ ...inputStyle, letterSpacing: '0.1em', fontFamily: 'monospace' }}
                        placeholder="RAMADAN20"
                        required
                    />
                    {errors.code && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.code}</p>}
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <div className="flex items-center gap-3">
                        <Toggle checked={data.is_active} onChange={v => setData('is_active', v)} />
                        <span className="text-xs" style={{ color: '#9A9490' }}>
                            {data.is_active ? 'Actif' : 'Désactivé'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label style={labelStyle}>Type de réduction *</label>
                    <select
                        value={data.type}
                        onChange={e => setData('type', e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="percent">Pourcentage (%)</option>
                        <option value="fixed">Montant fixe (CHF)</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>
                        Valeur * {data.type === 'percent' ? '(%)' : '(CHF)'}
                    </label>
                    <input
                        type="number"
                        min="0.01"
                        max={data.type === 'percent' ? 100 : undefined}
                        step="0.01"
                        value={data.value}
                        onChange={e => setData('value', e.target.value)}
                        style={inputStyle}
                        placeholder={data.type === 'percent' ? 'Ex: 20' : 'Ex: 10.00'}
                        required
                    />
                    {errors.value && <p className="text-xs mt-1" style={{ color: '#E07070' }}>{errors.value}</p>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label style={labelStyle}>Panier minimum (CHF)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.min_amount}
                        onChange={e => setData('min_amount', e.target.value)}
                        style={inputStyle}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Utilisations max</label>
                    <input
                        type="number"
                        min="1"
                        value={data.max_uses}
                        onChange={e => setData('max_uses', e.target.value)}
                        style={inputStyle}
                        placeholder="Illimité"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Expiration</label>
                    <input
                        type="date"
                        value={data.expires_at}
                        onChange={e => setData('expires_at', e.target.value)}
                        style={{ ...inputStyle, colorScheme: 'dark' }}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 text-xs font-medium tracking-widest uppercase rounded transition-opacity"
                    style={{ backgroundColor: '#C8A96E', color: '#1A1A1A', opacity: processing ? 0.6 : 1 }}
                >
                    {processing ? 'Enregistrement…' : (isEdit ? 'Mettre à jour' : 'Créer le code')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 text-xs font-medium tracking-widest uppercase rounded"
                    style={{ backgroundColor: '#2C2C2C', color: '#9A9490' }}
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}

export default function DiscountCodesIndex({ codes }) {
    const { flash } = usePage().props;
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const deleteCode = (code) => {
        if (!confirm(`Supprimer le code "${code.code}" ?`)) return;
        router.delete(`/admin/codes-promo/${code.id}`);
    };

    const formatDiscount = (code) =>
        code.type === 'percent'
            ? `-${code.value}%`
            : `-${parseFloat(code.value).toFixed(2)} CHF`;

    return (
        <AdminLayout title="Codes promo">
            <div className="max-w-4xl">

                {/* Flash */}
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 text-sm font-light" style={{ backgroundColor: 'rgba(200,169,110,0.1)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.3)' }}>
                        {flash.success}
                    </div>
                )}

                {/* En-tête */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-2xl font-normal" style={{ color: '#1A1A1A' }}>Codes promo</h1>
                        <p className="text-xs mt-1" style={{ color: '#9A9490' }}>Créez et gérez vos codes de réduction</p>
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
                            Nouveau code
                        </button>
                    )}
                </div>

                {/* Formulaire création */}
                {showCreate && (
                    <div className="mb-6">
                        <CodeForm onCancel={() => setShowCreate(false)} />
                    </div>
                )}

                {/* Tableau */}
                {codes.length === 0 && !showCreate ? (
                    <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#F0EBE1' }}>
                        <p className="text-sm font-light mb-4" style={{ color: '#9A9490' }}>Aucun code promo pour le moment</p>
                        <button onClick={() => setShowCreate(true)} className="text-xs tracking-widest uppercase" style={{ color: '#C8A96E' }}>
                            Créer le premier →
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {codes.map((code) => (
                            editingId === code.id ? (
                                <CodeForm key={code.id} code={code} onCancel={() => setEditingId(null)} />
                            ) : (
                                <div key={code.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D4' }}>
                                    {/* Code */}
                                    <div className="flex-shrink-0 px-3 py-1.5 rounded" style={{ backgroundColor: '#F0EBE1' }}>
                                        <span className="font-mono text-sm font-semibold tracking-widest" style={{ color: '#1A1A1A' }}>{code.code}</span>
                                    </div>

                                    {/* Infos */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold" style={{ color: '#C8A96E' }}>{formatDiscount(code)}</p>
                                        <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                                            {code.min_amount > 0 && `Dès ${code.min_amount} CHF · `}
                                            {code.max_uses ? `${code.used_count}/${code.max_uses} utilisations` : `${code.used_count} utilisations`}
                                            {code.expires_at && ` · Expire le ${new Date(code.expires_at).toLocaleDateString('fr-CH')}`}
                                        </p>
                                    </div>

                                    {/* Statut */}
                                    <span
                                        className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
                                        style={code.is_active
                                            ? { backgroundColor: 'rgba(200,169,110,0.12)', color: '#C8A96E' }
                                            : { backgroundColor: '#F0EBE1', color: '#9A9490' }
                                        }
                                    >
                                        {code.is_active ? 'Actif' : 'Inactif'}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => { setEditingId(code.id); setShowCreate(false); }}
                                            className="px-3 py-1.5 text-xs rounded transition-colors"
                                            style={{ backgroundColor: '#F0EBE1', color: '#1A1A1A' }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => deleteCode(code)}
                                            className="px-3 py-1.5 text-xs rounded"
                                            style={{ backgroundColor: 'rgba(224,112,112,0.08)', color: '#E07070' }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
