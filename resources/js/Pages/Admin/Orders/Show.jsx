import { Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const STATUS_OPTIONS = [
    { value: 'pending',   label: 'En attente' },
    { value: 'paid',      label: 'Payée' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'shipped',   label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
    { value: 'refunded',  label: 'Remboursée' },
    { value: 'disputed',  label: 'Litige' },
];

const STATUS_CONFIG = {
    pending:   { bg: 'rgba(200,169,110,0.12)', color: '#C8A96E' },
    paid:      { bg: 'rgba(139,158,200,0.12)', color: '#8B9EC8' },
    preparing: { bg: 'rgba(155,135,200,0.12)', color: '#9B87C8' },
    shipped:   { bg: 'rgba(107,101,96,0.12)',  color: '#6B6560' },
    delivered: { bg: 'rgba(123,158,135,0.12)', color: '#7B9E87' },
    cancelled: { bg: 'rgba(224,112,112,0.12)', color: '#E07070' },
    refunded:  { bg: 'rgba(154,148,144,0.12)', color: '#9A9490' },
    disputed:  { bg: 'rgba(224,140,60,0.12)',  color: '#E08C3C' },
};

function SectionCard({ title, children }) {
    return (
        <div className="bg-white border p-6" style={{ borderColor: '#E8E2D9' }}>
            <p className="text-xs tracking-widest uppercase font-medium mb-5" style={{ color: '#9A9490' }}>{title}</p>
            {children}
        </div>
    );
}

export default function OrderShow({ order }) {
    const { flash } = usePage().props;

    const statusForm   = useForm({ status: order.status });
    const trackingForm = useForm({ tracking_number: order.tracking_number ?? '' });
    const shipForm     = useForm({ tracking_number: order.tracking_number ?? '' });
    const refundForm   = useForm({ amount: '', reason: '' });
    const cancelForm   = useForm({});

    const updateStatus = (e) => {
        e.preventDefault();
        statusForm.post(`/admin/commandes/${order.id}/status`, { preserveScroll: true });
    };

    const updateTracking = (e) => {
        e.preventDefault();
        trackingForm.post(`/admin/commandes/${order.id}/tracking`, { preserveScroll: true });
    };

    const ship = (e) => {
        e.preventDefault();
        shipForm.post(`/admin/commandes/${order.id}/ship`, { preserveScroll: true });
    };

    const refund = (e) => {
        e.preventDefault();
        if (!window.confirm(refundForm.data.amount
            ? `Rembourser ${parseFloat(refundForm.data.amount).toFixed(2)} CHF au client ?`
            : `Rembourser la totalité (${parseFloat(order.total).toFixed(2)} CHF) au client ?`
        )) return;
        refundForm.post(`/admin/commandes/${order.id}/refund`, { preserveScroll: true });
    };

    const cancel = (e) => {
        e.preventDefault();
        const msg = order.stripe_payment_intent && ['paid', 'preparing'].includes(order.status)
            ? `Annuler cette commande et rembourser automatiquement ${parseFloat(order.total).toFixed(2)} CHF via Stripe ?`
            : 'Annuler cette commande ? (aucun remboursement automatique car non payée via Stripe)';
        if (!window.confirm(msg)) return;
        cancelForm.post(`/admin/commandes/${order.id}/cancel`, { preserveScroll: true });
    };

    const currentStatus      = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.refunded;
    const currentStatusLabel = STATUS_OPTIONS.find(s => s.value === order.status)?.label ?? order.status;
    const alreadyShipped     = ['shipped', 'delivered'].includes(order.status);
    const canRefund          = ['paid', 'preparing', 'shipped', 'delivered'].includes(order.status) && order.stripe_payment_intent;
    const canCancel          = !['cancelled', 'refunded'].includes(order.status);

    return (
        <AdminLayout title={`Commande ${order.number}`}>

            {flash?.success && (
                <div className="mb-5 px-4 py-3 text-sm rounded" style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-5 px-4 py-3 text-sm rounded" style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>
                    {flash.error}
                </div>
            )}

            {/* Badge litige */}
            {order.disputed_at && (
                <div className="mb-5 px-4 py-3 text-sm rounded flex items-center gap-2" style={{ backgroundColor: 'rgba(224,140,60,0.08)', color: '#E08C3C', border: '1px solid rgba(224,140,60,0.3)' }}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span><strong>Litige Stripe ouvert</strong> le {order.disputed_at} — Connectez-vous sur votre dashboard Stripe pour y répondre.</span>
                </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-xs font-light hover:opacity-60 transition-opacity" style={{ color: '#9A9490' }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Retour aux commandes
                </Link>
                <a
                    href={`/admin/commandes/${order.id}/facture`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E8E2D9', color: '#6B6560' }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Télécharger la facture PDF
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">

                    {/* Note de commande / message cadeau */}
                    {order.notes && (
                        <div className="border p-4" style={{ borderColor: '#C8A96E', backgroundColor: '#FFF8ED', borderLeft: '3px solid #C8A96E' }}>
                            <p className="text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#C8A96E' }}>Note du client</p>
                            {order.notes.split('\n---\n').map((note, i) => (
                                <p key={i} className="text-sm font-light whitespace-pre-line" style={{ color: '#1A1A1A', marginBottom: i < order.notes.split('\n---\n').length - 1 ? '8px' : 0 }}>
                                    {note}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Articles */}
                    <SectionCard title="Articles commandés">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ borderColor: '#F0EBE1' }}>
                                    <th className="pb-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Produit</th>
                                    <th className="pb-3 text-left text-xs font-medium" style={{ color: '#9A9490' }}>Qté</th>
                                    <th className="pb-3 text-right text-xs font-medium" style={{ color: '#9A9490' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-b" style={{ borderColor: '#F5F2EE' }}>
                                        <td className="py-3.5 text-sm font-light" style={{ color: '#1A1A1A' }}>{item.product_name}</td>
                                        <td className="py-3.5 text-sm font-light" style={{ color: '#9A9490' }}>× {item.quantity}</td>
                                        <td className="py-3.5 text-sm font-medium text-right" style={{ color: '#1A1A1A' }}>
                                            {parseFloat(item.total).toFixed(2)} CHF
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2" className="pt-4 text-xs font-light" style={{ color: '#9A9490' }}>Livraison</td>
                                    <td className="pt-4 text-xs font-light text-right" style={{ color: '#9A9490' }}>
                                        {order.shipping == 0 ? 'Offerte' : parseFloat(order.shipping).toFixed(2) + ' CHF'}
                                    </td>
                                </tr>
                                <tr className="border-t" style={{ borderColor: '#F0EBE1' }}>
                                    <td colSpan="2" className="pt-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>Total</td>
                                    <td className="pt-3 text-right">
                                        <span className="font-serif text-base" style={{ color: '#1A1A1A' }}>
                                            {parseFloat(order.total).toFixed(2)} CHF
                                        </span>
                                    </td>
                                </tr>
                                {order.refunded_amount && (
                                    <tr>
                                        <td colSpan="2" className="pt-2 text-xs font-light" style={{ color: '#9A9490' }}>
                                            Remboursé {order.refund_reason ? `— ${order.refund_reason}` : ''}
                                        </td>
                                        <td className="pt-2 text-xs font-medium text-right" style={{ color: '#E07070' }}>
                                            −{parseFloat(order.refunded_amount).toFixed(2)} CHF
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </SectionCard>

                    {/* Client */}
                    {order.customer && (
                        <SectionCard title="Informations client">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>Nom</p>
                                    <p className="font-medium" style={{ color: '#1A1A1A' }}>
                                        {order.customer.first_name} {order.customer.last_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>Email</p>
                                    <p className="font-light" style={{ color: '#6B6560' }}>{order.customer.email}</p>
                                </div>
                                {order.customer.phone && (
                                    <div>
                                        <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>Téléphone</p>
                                        <p className="font-light" style={{ color: '#6B6560' }}>{order.customer.phone}</p>
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <p className="text-xs font-light mb-1" style={{ color: '#9A9490' }}>Adresse de livraison</p>
                                    <p className="font-light" style={{ color: '#6B6560' }}>
                                        {order.customer.address}
                                        {order.customer.address2 && <><br />{order.customer.address2}</>}
                                        <br />{order.customer.postal_code} {order.customer.city}
                                        <br />{order.customer.country}
                                    </p>
                                </div>
                            </div>
                        </SectionCard>
                    )}
                </div>

                <div className="space-y-5">

                    {/* Statut actuel */}
                    <SectionCard title="Statut de la commande">
                        <div className="mb-5">
                            <span
                                className="inline-block px-3 py-1.5 text-xs font-medium rounded-full"
                                style={{ backgroundColor: currentStatus.bg, color: currentStatus.color }}
                            >
                                {currentStatusLabel}
                            </span>
                        </div>
                        <form onSubmit={updateStatus} className="space-y-3">
                            <select
                                value={statusForm.data.status}
                                onChange={(e) => statusForm.setData('status', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm outline-none transition-colors border"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A', backgroundColor: 'white' }}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="w-full py-2.5 text-xs font-medium tracking-wider uppercase transition-colors"
                                style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: statusForm.processing ? 0.6 : 1 }}
                            >
                                Mettre à jour
                            </button>
                            <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                                Passer à "Expédiée" envoie un email au client.
                            </p>
                        </form>
                    </SectionCard>

                    {/* Expédier en un clic */}
                    {!alreadyShipped && !['cancelled', 'refunded', 'disputed'].includes(order.status) && (
                        <SectionCard title="Expédier cette commande">
                            <form onSubmit={ship} className="space-y-3">
                                <input
                                    type="text"
                                    value={shipForm.data.tracking_number}
                                    onChange={(e) => shipForm.setData('tracking_number', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm outline-none border transition-colors"
                                    style={{ borderColor: '#D4CFC8', color: '#1A1A1A', backgroundColor: 'white' }}
                                    placeholder="N° de suivi (optionnel)"
                                    onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                                    onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                                />
                                <button
                                    type="submit"
                                    disabled={shipForm.processing}
                                    className="w-full py-3 text-xs font-medium tracking-wider uppercase transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#C8A96E', color: '#1A1A1A', opacity: shipForm.processing ? 0.6 : 1 }}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    Marquer expédiée + envoyer email
                                </button>
                            </form>
                        </SectionCard>
                    )}

                    {/* Suivi */}
                    <SectionCard title="Numéro de suivi">
                        <form onSubmit={updateTracking} className="space-y-3">
                            <input
                                type="text"
                                value={trackingForm.data.tracking_number}
                                onChange={(e) => trackingForm.setData('tracking_number', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm outline-none border transition-colors"
                                style={{ borderColor: '#D4CFC8', color: '#1A1A1A', backgroundColor: 'white' }}
                                placeholder="Ex: FR123456789"
                                onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                                onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            />
                            <button
                                type="submit"
                                disabled={trackingForm.processing}
                                className="w-full py-2.5 text-xs font-medium tracking-wider uppercase transition-colors"
                                style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: trackingForm.processing ? 0.6 : 1 }}
                            >
                                Enregistrer
                            </button>
                        </form>
                    </SectionCard>

                    {/* Rembourser */}
                    {canRefund && (
                        <SectionCard title="Rembourser le client">
                            <form onSubmit={refund} className="space-y-3">
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={order.total}
                                        value={refundForm.data.amount}
                                        onChange={(e) => refundForm.setData('amount', e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm outline-none border transition-colors"
                                        style={{ borderColor: '#D4CFC8', color: '#1A1A1A', backgroundColor: 'white' }}
                                        placeholder={`Montant (vide = total : ${parseFloat(order.total).toFixed(2)} CHF)`}
                                        onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                                        onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={refundForm.data.reason}
                                        onChange={(e) => refundForm.setData('reason', e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm outline-none border transition-colors"
                                        style={{ borderColor: '#D4CFC8', color: '#1A1A1A', backgroundColor: 'white' }}
                                        placeholder="Motif (optionnel)"
                                        onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                                        onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={refundForm.processing}
                                    className="w-full py-2.5 text-xs font-medium tracking-wider uppercase transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#E07070', color: 'white', opacity: refundForm.processing ? 0.6 : 1 }}
                                >
                                    {refundForm.processing ? 'Traitement...' : 'Émettre le remboursement'}
                                </button>
                                <p className="text-xs font-light" style={{ color: '#9A9490' }}>
                                    Le remboursement sera effectué via Stripe. Le client recevra un email de confirmation.
                                </p>
                            </form>
                        </SectionCard>
                    )}

                    {/* Annuler */}
                    {canCancel && (
                        <SectionCard title="Annuler la commande">
                            <form onSubmit={cancel} className="space-y-3">
                                <p className="text-xs font-light leading-relaxed" style={{ color: '#9A9490' }}>
                                    {['paid', 'preparing'].includes(order.status) && order.stripe_payment_intent
                                        ? `Un remboursement de ${parseFloat(order.total).toFixed(2)} CHF sera automatiquement déclenché sur Stripe.`
                                        : 'La commande sera marquée annulée. Le stock sera remis en place.'
                                    }
                                </p>
                                <button
                                    type="submit"
                                    disabled={cancelForm.processing}
                                    className="w-full py-2.5 text-xs font-medium tracking-wider uppercase border transition-opacity hover:opacity-80"
                                    style={{ borderColor: '#E07070', color: '#E07070', backgroundColor: 'transparent', opacity: cancelForm.processing ? 0.6 : 1 }}
                                >
                                    {cancelForm.processing ? 'Traitement...' : 'Annuler cette commande'}
                                </button>
                            </form>
                        </SectionCard>
                    )}

                    {/* Méta */}
                    <SectionCard title="Informations">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-xs font-light" style={{ color: '#9A9490' }}>Numéro</span>
                                <span className="font-mono text-xs font-medium" style={{ color: '#1A1A1A' }}>{order.number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-light" style={{ color: '#9A9490' }}>Date</span>
                                <span className="text-xs font-light" style={{ color: '#6B6560' }}>{order.created_at}</span>
                            </div>
                            {order.stripe_payment_intent && (
                                <div className="flex justify-between gap-2">
                                    <span className="text-xs font-light flex-shrink-0" style={{ color: '#9A9490' }}>Stripe PI</span>
                                    <span className="font-mono text-xs truncate" style={{ color: '#6B6560' }}>{order.stripe_payment_intent}</span>
                                </div>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </AdminLayout>
    );
}
