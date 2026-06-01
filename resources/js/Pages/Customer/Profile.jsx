import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useT } from '../../contexts/LanguageContext';
import { docTitle } from '../../i18n/docTitle';

export default function CustomerProfile({ customer }) {
    const { t } = useT();

    const profileForm = useForm({
        first_name: customer.first_name ?? '',
        last_name:  customer.last_name  ?? '',
        phone:      customer.phone      ?? '',
    });

    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post('/mon-compte/profil', { preserveScroll: true });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post('/mon-compte/mot-de-passe', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <CustomerLayout title={t('account_nav_profile')}>
            <Head title={docTitle(t, t('account_nav_profile'))} />

            <div className="space-y-10">

                {/* Informations personnelles */}
                <section>
                    <h2 className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#1A1A1A' }}>{t('account_profile_info')}</h2>
                    <form onSubmit={submitProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_first_name')}</label>
                                <input
                                    type="text"
                                    value={profileForm.data.first_name}
                                    onChange={e => profileForm.setData('first_name', e.target.value)}
                                    className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                    style={{ borderColor: profileForm.errors.first_name ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                    placeholder={t('account_first_name')}
                                    required
                                />
                                {profileForm.errors.first_name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_last_name')}</label>
                                <input
                                    type="text"
                                    value={profileForm.data.last_name}
                                    onChange={e => profileForm.setData('last_name', e.target.value)}
                                    className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                    style={{ borderColor: profileForm.errors.last_name ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                    placeholder={t('account_last_name')}
                                    required
                                />
                                {profileForm.errors.last_name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.last_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_email')}</label>
                            <input
                                type="email"
                                value={customer.email}
                                className="w-full px-4 py-3 border text-sm font-light"
                                style={{ borderColor: '#D4CDBF', backgroundColor: '#F0EBE1', color: '#9A9490' }}
                                disabled
                            />
                            <p className="mt-1 text-xs font-light" style={{ color: '#9A9490' }}>{t('account_email_readonly')}</p>
                        </div>

                        <div>
                            <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_phone')}</label>
                            <input
                                type="tel"
                                value={profileForm.data.phone}
                                onChange={e => profileForm.setData('phone', e.target.value)}
                                className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                style={{ borderColor: profileForm.errors.phone ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                placeholder={t('account_phone_placeholder')}
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="px-8 py-3 text-xs font-medium uppercase tracking-widest transition-opacity disabled:opacity-50"
                                style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                            >
                                {profileForm.processing ? t('account_saving') : t('account_save')}
                            </button>
                            {profileForm.recentlySuccessful && (
                                <span className="text-xs font-medium" style={{ color: '#16a34a' }}>✓ {t('account_saved')}</span>
                            )}
                        </div>
                    </form>
                </section>

                <hr style={{ borderColor: '#E8E2D9' }} />

                {/* Changer de mot de passe */}
                <section>
                    <h2 className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#1A1A1A' }}>{t('account_change_password')}</h2>
                    <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                            <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_current_password')}</label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                                className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                style={{ borderColor: passwordForm.errors.current_password ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                placeholder="••••••••"
                                required
                            />
                            {passwordForm.errors.current_password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.current_password}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_new_password')}</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={e => passwordForm.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                    style={{ borderColor: passwordForm.errors.password ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                    placeholder="••••••••"
                                    required
                                />
                                {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs tracking-wider uppercase font-medium mb-2" style={{ color: '#6B6560' }}>{t('account_confirm_password')}</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 border text-sm font-light outline-none focus:border-amber-600"
                                    style={{ borderColor: passwordForm.errors.password_confirmation ? '#dc2626' : '#D4CDBF', backgroundColor: '#FAF8F4' }}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="px-8 py-3 text-xs font-medium uppercase tracking-widest transition-opacity disabled:opacity-50"
                                style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                            >
                                {passwordForm.processing ? t('account_saving') : t('account_change_password_btn')}
                            </button>
                            {passwordForm.recentlySuccessful && (
                                <span className="text-xs font-medium" style={{ color: '#16a34a' }}>✓ {t('account_password_changed')}</span>
                            )}
                        </div>
                    </form>
                </section>

            </div>
        </CustomerLayout>
    );
}
