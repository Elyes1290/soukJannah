import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import PasswordInput from '../../Components/PasswordInput';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

export default function CustomerSecurity({ has_password }) {
    const { t } = useT();

    const passwordForm = useForm(
        has_password
            ? { current_password: '', password: '', password_confirmation: '' }
            : { password: '', password_confirmation: '' }
    );

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post('/mon-compte/mot-de-passe', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <CustomerLayout title={t('account_nav_security')}>
            <Head title={docTitle(t, t('account_nav_security'))} />

            {!has_password && (
                <div className="mb-6 p-4 border text-sm font-light" style={{ borderColor: '#C8A96E', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E', color: '#6B6560' }}>
                    {t('account_oauth_password_hint')}
                </div>
            )}

            <section>
                <h2 className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#1A1A1A' }}>
                    {has_password ? t('account_change_password') : t('account_set_password_h2')}
                </h2>
                <form onSubmit={submitPassword} className="space-y-4 max-w-lg">

                    {has_password && (
                        <div>
                            <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_current_password')}</label>
                            <PasswordInput
                                value={passwordForm.data.current_password}
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                                placeholder="••••••••"
                                error={!!passwordForm.errors.current_password}
                                required
                            />
                            {passwordForm.errors.current_password && <p className="mt-1 text-xs text-red-600">{t(passwordForm.errors.current_password)}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>
                            {t('account_new_password')}
                        </label>
                        <PasswordInput
                            value={passwordForm.data.password}
                            onChange={e => passwordForm.setData('password', e.target.value)}
                            placeholder={t('account_password_placeholder_min')}
                            error={!!passwordForm.errors.password}
                            required
                        />
                        {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_confirm_password')}</label>
                        <PasswordInput
                            value={passwordForm.data.password_confirmation}
                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="px-8 py-3 text-xs font-medium uppercase tracking-widest transition-opacity disabled:opacity-50"
                            style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                        >
                            {passwordForm.processing ? t('account_saving') : (has_password ? t('account_change_password_btn') : t('account_define_password_btn'))}
                        </button>
                        {passwordForm.recentlySuccessful && (
                            <span className="text-xs font-medium" style={{ color: '#16a34a' }}>✓ {has_password ? t('account_password_changed') : t('account_password_set_done')}</span>
                        )}
                    </div>
                </form>
            </section>
        </CustomerLayout>
    );
}
