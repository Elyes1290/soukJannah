import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

export default function CheckoutSuccess() {
    const { t } = useT();
    return (
        <PublicLayout>
            <Head title={t('checkout_success_title')} />
            <div className="min-h-96 flex items-center justify-center py-32">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border" style={{ borderColor: '#C8A96E' }}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#C8A96E' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#C8A96E' }}>{t('checkout_success_tag')}</p>
                    <h1 className="font-serif text-3xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('checkout_success_h1')}</h1>
                    <div className="h-px w-10 mx-auto mb-6" style={{ backgroundColor: '#C8A96E' }}></div>
                    <p className="text-sm font-light leading-relaxed mb-10" style={{ color: '#6B6560' }}>{t('checkout_success_desc')}</p>
                    <Link href="/boutique" className="btn-primary" style={{ letterSpacing: '0.15em' }}>{t('checkout_success_cta')}</Link>
                </div>
            </div>
        </PublicLayout>
    );
}
