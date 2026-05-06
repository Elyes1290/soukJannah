import { Head } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

export default function CheckEmail({ email }) {
    const { t } = useT();

    return (
        <PublicLayout>
            <Head title={`${t('account_check_email_title')} — SoukJannah`} />

            <section className="border-b py-12 text-center" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-3 font-light" style={{ color: '#C8A96E' }}>{t('account_tag')}</p>
                <h1 className="font-serif text-3xl font-normal" style={{ color: '#1A1A1A' }}>{t('account_check_email_h1')}</h1>
                <div className="h-px w-10 mx-auto mt-4" style={{ backgroundColor: '#C8A96E' }}></div>
            </section>

            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="mb-8" style={{ fontSize: '64px', lineHeight: 1 }}>✉</div>

                <p className="text-sm font-light leading-relaxed mb-6" style={{ color: '#6B6560' }}>
                    {t('account_check_email_desc_1')}{' '}
                    <strong style={{ color: '#1A1A1A', fontWeight: 500 }}>{email}</strong>
                    {t('account_check_email_desc_2')}
                </p>

                <div className="p-4 border text-left" style={{ borderColor: '#E8E2D9', backgroundColor: '#F0EBE1', borderLeft: '3px solid #C8A96E' }}>
                    <p className="text-sm font-light" style={{ color: '#6B6560' }}>
                        💡 {t('account_check_email_hint')}
                    </p>
                </div>

                <p className="mt-8 text-xs font-light" style={{ color: '#9A9490' }}>
                    {t('account_check_email_already')}{' '}
                    <a href="/mon-compte/connexion" className="underline transition-opacity hover:opacity-60" style={{ color: '#C8A96E', textUnderlineOffset: '3px' }}>
                        {t('account_login_link')}
                    </a>
                </p>
            </div>
        </PublicLayout>
    );
}
