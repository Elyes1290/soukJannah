import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { useT } from '../../contexts/LanguageContext';

export default function CheckoutCancel() {
    const { t } = useT();
    return (
        <PublicLayout>
            <Head title={t('checkout_cancel_title')} />
            <div className="min-h-96 flex items-center justify-center py-32">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border" style={{ borderColor: '#E8E2D9' }}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#9A9490' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-xs tracking-[0.4em] uppercase mb-4 font-light" style={{ color: '#9A9490' }}>{t('checkout_cancel_tag')}</p>
                    <h1 className="font-serif text-3xl font-normal mb-4" style={{ color: '#1A1A1A' }}>{t('checkout_cancel_h1')}</h1>
                    <div className="h-px w-10 mx-auto mb-6" style={{ backgroundColor: '#E8E2D9' }}></div>
                    <p className="text-sm font-light leading-relaxed mb-10" style={{ color: '#6B6560' }}>{t('checkout_cancel_desc')}</p>
                    <Link href="/panier" className="btn-primary" style={{ letterSpacing: '0.15em' }}>{t('checkout_cancel_cta')}</Link>
                </div>
            </div>
        </PublicLayout>
    );
}
