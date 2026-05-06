import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

const STEPS = [
    { key: 'paid',      label: 'Payée' },
    { key: 'preparing', label: 'En préparation' },
    { key: 'shipped',   label: 'Expédiée' },
    { key: 'delivered', label: 'Livrée' },
];

function StatusBar({ step }) {
    if (step === 0) return null;
    return (
        <div className="w-full mb-8">
            <div className="flex items-center">
                {STEPS.map((s, i) => {
                    const done    = step > i + 1;
                    const current = step === i + 2;
                    const active  = done || current;
                    return (
                        <div key={s.key} className="flex-1 flex flex-col items-center">
                            <div className="flex items-center w-full">
                                {i > 0 && (
                                    <div className="flex-1 h-0.5" style={{ backgroundColor: done ? '#C8A96E' : '#E8E2D9' }} />
                                )}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors"
                                    style={{
                                        backgroundColor: active ? '#C8A96E' : '#F0EBE1',
                                        color: active ? '#fff' : '#9A9490',
                                        border: current ? '2px solid #C8A96E' : 'none',
                                    }}>
                                    {done ? '✓' : i + 2}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="flex-1 h-0.5" style={{ backgroundColor: done ? '#C8A96E' : '#E8E2D9' }} />
                                )}
                            </div>
                            <span className="text-xs mt-2 text-center font-medium"
                                style={{ color: active ? '#1A1A1A' : '#9A9490' }}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function TrackingIndex({ order, error, prefillNumber = '' }) {
    const { t } = useT();
    const { data, setData, post, processing } = useForm({ number: prefillNumber, email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/suivi');
    };

    const isCancelled = order?.status === 'cancelled' || order?.status === 'refunded';

    return (
        <PublicLayout>
            <Head title="Suivi de commande — SoukJannah" />

            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>SoukJannah</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>Suivi de commande</h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-2xl mx-auto px-4 py-16">

                {/* Formulaire de recherche */}
                <div className="bg-white border p-8 mb-10" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#C8A96E' }}>
                        Retrouver ma commande
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                Numéro de commande
                            </label>
                            <input
                                type="text"
                                value={data.number}
                                onChange={e => setData('number', e.target.value.toUpperCase())}
                                placeholder="CMD-XXXXXX"
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors uppercase"
                                style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                            <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                Vous le trouverez dans votre email de confirmation (ex : CMD-A1B2C3)
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                Adresse email de la commande
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="votre@email.com"
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors"
                                style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 border text-sm font-light" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 text-xs font-medium uppercase transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}
                            onMouseEnter={e => !processing && (e.target.style.backgroundColor = '#C8A96E')}
                            onMouseLeave={e => !processing && (e.target.style.backgroundColor = '#1A1A1A')}
                        >
                            {processing ? '...' : 'Suivre ma commande'}
                        </button>
                    </form>
                </div>

                {/* Résultat */}
                {order && (
                    <div className="space-y-6">
                        {/* En-tête commande */}
                        <div className="border p-6" style={{ borderColor: isCancelled ? '#dc2626' : '#C8A96E', borderLeftWidth: '4px' }}>
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: '#9A9490' }}>
                                        Commande
                                    </p>
                                    <p className="text-xl font-mono font-semibold" style={{ color: '#1A1A1A' }}>
                                        {order.number}
                                    </p>
                                    <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                        Passée le {order.created_at}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full"
                                        style={{
                                            backgroundColor: isCancelled ? '#fef2f2' : (order.status === 'delivered' ? 'rgba(123,158,135,0.12)' : 'rgba(200,169,110,0.12)'),
                                            color: isCancelled ? '#dc2626' : (order.status === 'delivered' ? '#7B9E87' : '#C8A96E'),
                                        }}>
                                        {order.status_label}
                                    </span>
                                    <p className="text-sm font-medium mt-2" style={{ color: '#1A1A1A' }}>
                                        {Number(order.total).toFixed(2)} CHF
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Barre de progression */}
                        {!isCancelled && <StatusBar step={order.status_step} />}

                        {isCancelled && (
                            <div className="p-4 border text-sm font-light" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                Cette commande a été {order.status === 'refunded' ? 'remboursée' : 'annulée'}. Pour toute question, contactez-nous.
                            </div>
                        )}

                        {/* Numéro de suivi transporteur */}
                        {order.tracking_number && (
                            <div className="p-5 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                                <p className="text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#C8A96E' }}>
                                    Numéro de suivi transporteur
                                </p>
                                <p className="font-mono text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                                    {order.tracking_number}
                                </p>
                                <p className="text-xs mt-1 font-light" style={{ color: '#9A9490' }}>
                                    Utilisez ce numéro sur le site de votre transporteur pour un suivi en temps réel.
                                </p>
                            </div>
                        )}

                        {/* Articles commandés */}
                        <div className="border" style={{ borderColor: '#E8E2D9' }}>
                            <div className="px-6 py-4 border-b" style={{ borderColor: '#F0EBE1', backgroundColor: '#FAF8F4' }}>
                                <p className="text-xs tracking-widest uppercase font-medium" style={{ color: '#1A1A1A' }}>
                                    Articles commandés
                                </p>
                            </div>
                            <div className="divide-y" style={{ borderColor: '#F0EBE1' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                                style={{ backgroundColor: '#F0EBE1', color: '#C8A96E' }}>
                                                {item.qty}
                                            </span>
                                            <span className="text-sm font-light" style={{ color: '#1A1A1A' }}>{item.name}</span>
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                                            {Number(item.price * item.qty).toFixed(2)} CHF
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Aide */}
                        <div className="text-center pt-2">
                            <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                                Un problème avec votre commande ?{' '}
                                <a href="/contact" className="underline hover:opacity-70 transition-opacity" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>
                                    Contactez-nous
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
