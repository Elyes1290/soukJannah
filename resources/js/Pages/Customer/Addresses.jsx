import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

const COUNTRY_CODES = ['CH', 'FR', 'BE', 'LU', 'DE', 'IT', 'ES', 'PT', 'NL', 'GB'];

function countryDisplayName(t, code) {
    const key = `country_${code}`;
    const translated = t(key);
    return translated === key ? code : translated;
}

const emptyForm = {
    label: '', first_name: '', last_name: '', address: '',
    address2: '', city: '', postal_code: '', country: 'CH', phone: '', is_default: false,
};

function AddressForm({ initial = emptyForm, onSubmit, processing, errors, submitLabel, onCancel }) {
    const { t } = useT();
    const form = useForm(initial);

    const handle = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="addr-label" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_label')}</label>
                    <input id="addr-label" type="text" value={form.data.label} onChange={e => form.setData('label', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: '#D4CDBF', backgroundColor: '#FAF8F4' }}
                        placeholder={t('addr_label_placeholder')} />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.data.is_default} onChange={e => form.setData('is_default', e.target.checked)}
                            className="w-4 h-4 accent-amber-600" />
                        <span className="text-sm font-light" style={{ color: '#6B6560' }}>{t('addr_set_default')}</span>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="addr-first-name" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('account_first_name')} *</label>
                    <input id="addr-first-name" type="text" value={form.data.first_name} onChange={e => form.setData('first_name', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: errors?.first_name ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }} required />
                    {errors?.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="addr-last-name" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('account_last_name')} *</label>
                    <input id="addr-last-name" type="text" value={form.data.last_name} onChange={e => form.setData('last_name', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: errors?.last_name ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }} required />
                    {errors?.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="addr-street" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_address')} *</label>
                <input id="addr-street" type="text" value={form.data.address} onChange={e => form.setData('address', e.target.value)}
                    className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                    style={{ borderColor: errors?.address ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                    placeholder={t('addr_street_placeholder')} required />
                {errors?.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </div>
            <div>
                <label htmlFor="addr-street2" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_address2')}</label>
                <input id="addr-street2" type="text" value={form.data.address2} onChange={e => form.setData('address2', e.target.value)}
                    className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                    style={{ borderColor: '#D4CDBF', backgroundColor: '#FAF8F4' }}
                    placeholder={t('addr_address2_placeholder')} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="addr-postal" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_postal')} *</label>
                    <input id="addr-postal" type="text" value={form.data.postal_code} onChange={e => form.setData('postal_code', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: errors?.postal_code ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }} required />
                </div>
                <div>
                    <label htmlFor="addr-city" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_city')} *</label>
                    <input id="addr-city" type="text" value={form.data.city} onChange={e => form.setData('city', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: errors?.city ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }} required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="addr-country" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('addr_country')} *</label>
                    <select id="addr-country" value={form.data.country} onChange={e => form.setData('country', e.target.value)}
                        className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                        style={{ borderColor: '#D4CDBF', backgroundColor: '#FAF8F4' }}>
                        {COUNTRY_CODES.map(code => <option key={code} value={code}>{t(`country_${code}`)}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="addr-phone" className="block text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: '#6B6560' }}>{t('account_phone')}</label>
                <input id="addr-phone" type="tel" value={form.data.phone} onChange={e => form.setData('phone', e.target.value)}
                    className="w-full px-3 py-2.5 border text-sm outline-none focus:border-amber-600"
                    style={{ borderColor: '#D4CDBF', backgroundColor: '#FAF8F4' }}
                    placeholder={t('account_phone_placeholder')} />
            </div>
            <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={form.processing}
                    className="px-7 py-2.5 text-xs font-medium uppercase tracking-widest disabled:opacity-50"
                    style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
                    {form.processing ? t('account_saving') : submitLabel}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className="px-7 py-2.5 text-xs font-medium uppercase tracking-widest border"
                        style={{ borderColor: '#D4CDBF', color: '#6B6560' }}>
                        {t('addr_cancel')}
                    </button>
                )}
            </div>
        </form>
    );
}

export default function CustomerAddresses({ addresses }) {
    const { t } = useT();
    const [showAdd, setShowAdd]     = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAdd = (form) => {
        form.post('/mon-compte/adresses', {
            onSuccess: () => { setShowAdd(false); form.reset(); },
        });
    };

    const handleUpdate = (form, id) => {
        form.put(`/mon-compte/adresses/${id}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id) => {
        if (confirm(t('addr_confirm_delete'))) {
            router.delete(`/mon-compte/adresses/${id}`);
        }
    };

    const handleSetDefault = (id) => {
        router.post(`/mon-compte/adresses/${id}/default`);
    };

    return (
        <CustomerLayout title={t('account_nav_addresses')}>
            <Head title={docTitle(t, t('account_nav_addresses'))} />

            {/* Liste des adresses */}
            {addresses.length > 0 && (
                <div className="space-y-4 mb-8">
                    {addresses.map(addr => (
                        <div key={addr.id} className="border p-5" style={{ borderColor: addr.is_default ? '#C8A96E' : '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                            {editingId === addr.id ? (
                                <AddressForm
                                    initial={{ label: addr.label, first_name: addr.first_name, last_name: addr.last_name, address: addr.address, address2: addr.address2 ?? '', city: addr.city, postal_code: addr.postal_code, country: addr.country, phone: addr.phone ?? '', is_default: addr.is_default }}
                                    onSubmit={(form) => handleUpdate(form, addr.id)}
                                    submitLabel={t('addr_save')}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <div className="flex flex-wrap justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5" style={{ backgroundColor: addr.is_default ? '#C8A96E' : '#E8E2D9', color: addr.is_default ? 'white' : '#6B6560' }}>
                                                {addr.label}
                                            </span>
                                            {addr.is_default && (
                                                <span className="text-xs font-light" style={{ color: '#C8A96E' }}>✓ {t('addr_default')}</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{addr.first_name} {addr.last_name}</p>
                                        <p className="text-sm font-light" style={{ color: '#6B6560' }}>{addr.address}{addr.address2 ? `, ${addr.address2}` : ''}</p>
                                        <p className="text-sm font-light" style={{ color: '#6B6560' }}>{addr.postal_code} {addr.city}, {countryDisplayName(t, addr.country)}</p>
                                        {addr.phone && <p className="text-sm font-light mt-1" style={{ color: '#9A9490' }}>{addr.phone}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button type="button" onClick={() => setEditingId(addr.id)} className="text-xs underline transition-opacity hover:opacity-60" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>{t('addr_edit')}</button>
                                        {!addr.is_default && (
                                            <>
                                                <button type="button" onClick={() => handleSetDefault(addr.id)} className="text-xs underline transition-opacity hover:opacity-60" style={{ color: '#6B6560', textUnderlineOffset: '3px' }}>{t('addr_make_default')}</button>
                                                <button type="button" onClick={() => handleDelete(addr.id)} className="text-xs underline transition-opacity hover:opacity-60" style={{ color: '#dc2626', textUnderlineOffset: '3px' }}>{t('addr_delete')}</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Ajouter une adresse */}
            {!showAdd ? (
                <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-6 py-3 border text-sm font-medium transition-colors hover:border-amber-600"
                    style={{ borderColor: '#D4CDBF', color: '#1A1A1A', borderStyle: 'dashed' }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {t('addr_add')}
                </button>
            ) : (
                <div className="border p-6" style={{ borderColor: '#E8E2D9', backgroundColor: '#FAF8F4' }}>
                    <p className="text-xs tracking-widest uppercase font-medium mb-5" style={{ color: '#1A1A1A' }}>{t('addr_new')}</p>
                    <AddressForm
                        onSubmit={handleAdd}
                        submitLabel={t('addr_save')}
                        onCancel={() => setShowAdd(false)}
                    />
                </div>
            )}
        </CustomerLayout>
    );
}
