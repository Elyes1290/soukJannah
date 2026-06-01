import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import PasswordInput from '../../Components/PasswordInput';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
    );
}

export default function CustomerRegister() {
    const { t, lang } = useT();
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        locale: lang,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/mon-compte/inscription');
    };

    return (
        <PublicLayout>
            <Head title={docTitle(t, t('account_register_title'))} />

            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('account_tag')}</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('account_register_h1')}</h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-md mx-auto px-4 py-16">

                {/* Google signup button */}
                <a
                    href="/auth/google/redirect"
                    className="flex items-center justify-center gap-3 w-full py-3 border text-sm font-medium transition-colors hover:bg-gray-50 mb-6"
                    style={{ borderColor: '#E8E2D9', backgroundColor: '#fff', color: '#1A1A1A' }}
                >
                    <GoogleIcon />
                    {t('account_google_continue')}
                </a>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E8E2D9' }}></div>
                    <span className="text-xs font-light uppercase tracking-widest" style={{ color: '#9A9490' }}>{t('account_or')}</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E8E2D9' }}></div>
                </div>

                <div className="mb-6 p-4 border" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E' }}>
                    <p className="text-sm font-light" style={{ color: '#6B6560' }}>
                        💡 {t('account_register_hint')}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="register-first-name" className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                {t('account_firstname')}
                            </label>
                            <input
                                id="register-first-name"
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors"
                                style={{ borderColor: errors.first_name ? '#dc2626' : '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                            {errors.first_name && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.first_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="register-last-name" className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                                {t('account_lastname')}
                            </label>
                            <input
                                id="register-last-name"
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors"
                                style={{ borderColor: errors.last_name ? '#dc2626' : '#E8E2D9', backgroundColor: '#FAF8F4' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="register-email" className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                            {t('account_email')}
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border px-4 py-3 text-sm font-light outline-none focus:border-amber-600 transition-colors"
                            style={{ borderColor: errors.email ? '#dc2626' : '#E8E2D9', backgroundColor: '#FAF8F4' }}
                            placeholder={t('account_email_placeholder')}
                            required
                        />
                        {errors.email && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                            {t('account_password')}
                        </label>
                        <PasswordInput
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder={t('account_password_placeholder_min')}
                            error={!!errors.password}
                            required
                        />
                        {errors.password && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs tracking-widest uppercase font-medium mb-2" style={{ color: '#1A1A1A' }}>
                            {t('account_password_confirm')}
                        </label>
                        <PasswordInput
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 text-xs font-medium uppercase transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#1A1A1A', color: 'white', letterSpacing: '0.15em' }}
                        onMouseEnter={e => !processing && (e.target.style.backgroundColor = '#C8A96E')}
                        onMouseLeave={e => !processing && (e.target.style.backgroundColor = '#1A1A1A')}
                    >
                        {processing ? '...' : t('account_register_btn')}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: '#E8E2D9' }}>
                    <p className="text-sm font-light" style={{ color: '#9A9490' }}>
                        {t('account_have_account')}{' '}
                        <Link href="/mon-compte/connexion" className="underline transition-opacity hover:opacity-60" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>
                            {t('account_login_link')}
                        </Link>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
