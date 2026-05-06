import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

const STATUS_CONFIG = {
    pending:  { label: 'En attente', color: '#C8A96E', bg: 'rgba(200,169,110,0.12)' },
    approved: { label: 'Approuvé',   color: '#7B9E87', bg: 'rgba(123,158,135,0.12)' },
    rejected: { label: 'Refusé',     color: '#E07070', bg: 'rgba(224,112,112,0.12)' },
};

function DecideModal({ returnItem, onClose }) {
    const { data, setData, post, processing } = useForm({
        decision: 'approved',
        admin_notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/retours/${returnItem.id}/decision`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white w-full max-w-lg shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E8E2D9' }}>
                    <div>
                        <h3 className="font-serif text-base" style={{ color: '#1A1A1A' }}>Traiter la demande de retour</h3>
                        <p className="text-xs font-mono mt-0.5" style={{ color: '#C8A96E' }}>{returnItem.order_number}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="px-6 pt-5 pb-2">
                    {/* Résumé de la demande */}
                    <div className="bg-stone-50 border p-4 mb-5 space-y-2" style={{ borderColor: '#E8E2D9' }}>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: '#9A9490' }}>Client</span>
                            <span className="text-xs" style={{ color: '#1A1A1A' }}>{returnItem.customer} — {returnItem.customer_email}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: '#9A9490' }}>Raison</span>
                            <span className="text-xs" style={{ color: '#1A1A1A' }}>{returnItem.reason}</span>
                        </div>
                        {returnItem.message && (
                            <div className="flex gap-2">
                                <span className="text-xs font-medium w-20 flex-shrink-0" style={{ color: '#9A9490' }}>Message</span>
                                <span className="text-xs italic" style={{ color: '#6B6560' }}>"{returnItem.message}"</span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="px-6 pb-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Décision *</label>
                        <div className="flex gap-3">
                            {[
                                { value: 'approved', label: 'Approuver', color: '#7B9E87' },
                                { value: 'rejected', label: 'Refuser',   color: '#E07070' },
                            ].map(opt => (
                                <label key={opt.value} className="flex-1 flex items-center gap-2 p-3 border cursor-pointer" style={{ borderColor: data.decision === opt.value ? opt.color : '#E8E2D9', backgroundColor: data.decision === opt.value ? `${opt.color}10` : 'transparent' }}>
                                    <input
                                        type="radio"
                                        name="decision"
                                        value={opt.value}
                                        checked={data.decision === opt.value}
                                        onChange={() => setData('decision', opt.value)}
                                        className="sr-only"
                                    />
                                    <span className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: opt.color, backgroundColor: data.decision === opt.value ? opt.color : 'transparent' }} />
                                    <span className="text-sm font-medium" style={{ color: opt.color }}>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>Message au client (optionnel)</label>
                        <textarea
                            value={data.admin_notes}
                            onChange={e => setData('admin_notes', e.target.value)}
                            rows={3}
                            placeholder="Ex: Votre retour a été approuvé, veuillez renvoyer le colis à... / Votre demande ne correspond pas à notre politique de retour car..."
                            className="w-full border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300 resize-none"
                            style={{ borderColor: '#E8E2D9' }}
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-xs font-medium border" style={{ borderColor: '#E8E2D9', color: '#6B6560' }}>
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 text-xs font-medium uppercase tracking-wider"
                            style={{ backgroundColor: data.decision === 'approved' ? '#7B9E87' : '#E07070', color: 'white', opacity: processing ? 0.7 : 1 }}
                        >
                            {processing ? 'Envoi...' : (data.decision === 'approved' ? 'Confirmer l\'approbation' : 'Confirmer le refus')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ReturnsIndex({ returns, counts }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [deciding, setDeciding] = useState(null);
    const { props } = usePage();
    const flash = props.flash || {};

    const filtered = activeFilter === 'all' ? returns : returns.filter(r => r.status === activeFilter);

    return (
        <AdminLayout title="Demandes de retour">
            <Head title="Retours" />

            {flash.success && (
                <div className="mb-4 px-4 py-3 border text-sm font-light" style={{ borderColor: '#7B9E87', backgroundColor: 'rgba(123,158,135,0.08)', color: '#4A7A5A' }}>
                    {flash.success}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { key: 'pending',  label: 'En attente', color: '#C8A96E' },
                    { key: 'approved', label: 'Approuvées', color: '#7B9E87' },
                    { key: 'rejected', label: 'Refusées',   color: '#E07070' },
                ].map(s => (
                    <div key={s.key} className="bg-white border p-5" style={{ borderColor: '#E8E2D9' }}>
                        <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>{s.label}</p>
                        <p className="text-2xl font-serif" style={{ color: s.color }}>{counts[s.key]}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex gap-2 flex-wrap mb-4">
                {[
                    { key: 'all',      label: 'Toutes' },
                    { key: 'pending',  label: 'En attente' },
                    { key: 'approved', label: 'Approuvées' },
                    { key: 'rejected', label: 'Refusées' },
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className="px-4 py-1.5 text-xs font-medium border transition-colors"
                        style={{
                            borderColor: activeFilter === f.key ? '#1A1A1A' : '#E8E2D9',
                            backgroundColor: activeFilter === f.key ? '#1A1A1A' : 'transparent',
                            color: activeFilter === f.key ? 'white' : '#6B6560',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
                {filtered.length === 0 ? (
                    <p className="p-8 text-center text-sm font-light" style={{ color: '#9A9490' }}>
                        Aucune demande de retour pour le moment.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ borderColor: '#F0EBE1' }}>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Commande</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: '#9A9490' }}>Client</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium hidden lg:table-cell" style={{ color: '#9A9490' }}>Raison</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium hidden sm:table-cell" style={{ color: '#9A9490' }}>Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Statut</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => {
                                    const sc = STATUS_CONFIG[r.status];
                                    return (
                                        <tr key={r.id} className="border-b last:border-0 hover:bg-stone-50 transition-colors" style={{ borderColor: '#F5F2EE' }}>
                                            <td className="px-5 py-3">
                                                <a href={`/admin/commandes/${r.order_id}`} className="font-mono text-xs font-medium hover:opacity-70" style={{ color: '#C8A96E' }}>
                                                    {r.order_number}
                                                </a>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-light hidden md:table-cell" style={{ color: '#1A1A1A' }}>
                                                <div>{r.customer}</div>
                                                <div style={{ color: '#9A9490' }}>{r.customer_email}</div>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-light hidden lg:table-cell" style={{ color: '#6B6560' }}>
                                                <div>{r.reason}</div>
                                                {r.message && <div className="italic text-xs mt-0.5" style={{ color: '#9A9490' }}>"{r.message.substring(0, 50)}{r.message.length > 50 ? '...' : ''}"</div>}
                                            </td>
                                            <td className="px-5 py-3 text-xs font-light hidden sm:table-cell" style={{ color: '#9A9490' }}>{r.created_at}</td>
                                            <td className="px-5 py-3">
                                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                {r.status === 'pending' ? (
                                                    <button
                                                        onClick={() => setDeciding(r)}
                                                        className="text-xs font-medium px-3 py-1.5 border transition-colors hover:bg-stone-50"
                                                        style={{ borderColor: '#C8A96E', color: '#C8A96E' }}
                                                    >
                                                        Traiter
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-light" style={{ color: '#9A9490' }}>
                                                        {r.admin_notes ? '✓ Répondu' : '—'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {deciding && <DecideModal returnItem={deciding} onClose={() => setDeciding(null)} />}
        </AdminLayout>
    );
}
