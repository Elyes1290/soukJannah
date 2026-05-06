import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

function FormSection({ title, desc, children }) {
    return (
        <div className="bg-white border" style={{ borderColor: '#E8E2D9' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#F0EBE1' }}>
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{title}</p>
                {desc && <p className="text-xs font-light mt-0.5" style={{ color: '#9A9490' }}>{desc}</p>}
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <div>
            <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6B6560' }}>
                {label}
            </label>
            {children}
            {hint && <p className="text-xs font-light mt-1.5" style={{ color: '#9A9490' }}>{hint}</p>}
        </div>
    );
}

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

export default function Settings({ settings }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        shop_name:       settings.shop_name       ?? '',
        shop_email:      settings.shop_email      ?? '',
        meta_pixel_id:   settings.meta_pixel_id   ?? '',
        tiktok_pixel_id: settings.tiktok_pixel_id ?? '',
        ga4_id:          settings.ga4_id          ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/parametres', { forceFormData: true });
    };

    return (
        <AdminLayout title="Paramètres">
            <Head title="Paramètres" />

            <form onSubmit={submit} className="max-w-2xl space-y-5">

                <FormSection title="Informations de la boutique" desc="Nom et email affichés dans les emails et sur le site">
                    <Field label="Nom de la boutique">
                        <input
                            type="text"
                            value={data.shop_name}
                            onChange={(e) => setData('shop_name', e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                            onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            placeholder="SoukJannah"
                        />
                    </Field>
                    <Field label="Email de contact">
                        <input
                            type="email"
                            value={data.shop_email}
                            onChange={(e) => setData('shop_email', e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                            onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            placeholder="support@halalstore.com"
                        />
                    </Field>
                </FormSection>

                <FormSection
                    title="Tracking & Analytics"
                    desc="Les scripts sont injectés automatiquement dès qu'un ID est renseigné"
                >
                    <Field label="Meta Pixel ID" hint="Ex : 123456789012345">
                        <input
                            type="text"
                            value={data.meta_pixel_id}
                            onChange={(e) => setData('meta_pixel_id', e.target.value)}
                            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                            onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                            onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            placeholder="123456789012345"
                        />
                    </Field>
                    <Field label="TikTok Pixel ID" hint="Ex : ABCDE12345">
                        <input
                            type="text"
                            value={data.tiktok_pixel_id}
                            onChange={(e) => setData('tiktok_pixel_id', e.target.value)}
                            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                            onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                            onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            placeholder="ABCDE12345"
                        />
                    </Field>
                    <Field label="Google Analytics 4 (Measurement ID)" hint="Ex : G-XXXXXXXXXX">
                        <input
                            type="text"
                            value={data.ga4_id}
                            onChange={(e) => setData('ga4_id', e.target.value)}
                            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8125rem' }}
                            onFocus={(e) => e.target.style.borderColor = '#C8A96E'}
                            onBlur={(e) => e.target.style.borderColor = '#D4CFC8'}
                            placeholder="G-XXXXXXXXXX"
                        />
                    </Field>
                </FormSection>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 text-xs font-medium tracking-wider uppercase transition-all"
                        style={{ backgroundColor: '#1A1A1A', color: 'white', opacity: processing ? 0.6 : 1 }}
                        onMouseEnter={(e) => { if (!processing) e.target.style.backgroundColor = '#C8A96E'; }}
                        onMouseLeave={(e) => { if (!processing) e.target.style.backgroundColor = '#1A1A1A'; }}
                    >
                        {processing ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                    {recentlySuccessful && (
                        <p className="text-xs font-light" style={{ color: '#7B9E87' }}>✓ Paramètres enregistrés</p>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}
