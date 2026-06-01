import { Link, router, usePage } from '@inertiajs/react';
import PublicLayout from './PublicLayout';
import { useT } from '../contexts/LanguageContext';

const NAV_ITEMS = (t) => [
    {
        href: '/mon-compte',
        label: t('account_nav_overview'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
        exact: true,
    },
    {
        href: '/mon-compte/commandes',
        label: t('account_nav_orders'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/favoris',
        label: t('account_nav_wishlist'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/avis',
        label: t('account_nav_reviews'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/promos',
        label: t('account_nav_promos'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/adresses',
        label: t('account_nav_addresses'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/profil',
        label: t('account_nav_profile'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        href: '/mon-compte/securite',
        label: t('account_nav_security'),
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
    },
];

export default function CustomerLayout({ children, title }) {
    const { t, translateFlash } = useT();
    const { authCustomer, flash } = usePage().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const flashOk = translateFlash(flash?.success);
    const flashErr = translateFlash(flash?.error);
    const showFlashOk = flash?.success != null && flashOk !== null && flashOk !== '';
    const showFlashErr = flash?.error != null && flashErr !== null && flashErr !== '';

    const isActive = (href, exact = false) => {
        if (exact) return currentPath === href;
        return currentPath.startsWith(href);
    };

    const handleLogout = () => router.post('/mon-compte/deconnexion');

    return (
        <PublicLayout>
            {/* Hero bande */}
            <div className="border-b" style={{ backgroundColor: '#F0EBE1', borderColor: '#E8E2D9' }}>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <p className="text-xs tracking-[0.4em] uppercase font-light mb-1" style={{ color: '#C8A96E' }}>{t('account_tag')}</p>
                    <h1 className="font-serif text-2xl font-normal" style={{ color: '#1A1A1A' }}>
                        {t('account_welcome')}, {authCustomer?.first_name}
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* ── Sidebar ── */}
                    <aside className="w-full md:w-56 flex-shrink-0">
                        {/* Avatar + infos */}
                        <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E8E2D9' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: '#C8A96E', color: '#1A1A1A' }}>
                                    {authCustomer?.first_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{authCustomer?.first_name}</p>
                                    <p className="text-xs font-light truncate" style={{ color: '#9A9490' }}>{authCustomer?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            {NAV_ITEMS(t).map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors"
                                    style={{
                                        color: isActive(item.href, item.exact) ? '#1A1A1A' : '#6B6560',
                                        backgroundColor: isActive(item.href, item.exact) ? '#F0EBE1' : 'transparent',
                                        borderLeft: isActive(item.href, item.exact) ? '2px solid #C8A96E' : '2px solid transparent',
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Déconnexion */}
                        <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E8E2D9' }}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left transition-opacity hover:opacity-60"
                                style={{ color: '#9A9490' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                {t('account_logout')}
                            </button>
                        </div>
                    </aside>

                    {/* ── Contenu principal ── */}
                    <main className="flex-1 min-w-0">
                        {title && (
                            <p className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: '#1A1A1A' }}>{title}</p>
                        )}
                        {showFlashErr ? (
                            <div className="mb-6 p-4 border text-sm font-light" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                {flashErr}
                            </div>
                        ) : showFlashOk ? (
                            <div className="mb-6 p-4 border text-sm font-light" style={{ borderColor: '#16a34a', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                ✓ {flashOk}
                            </div>
                        ) : null}
                        {children}
                    </main>

                </div>
            </div>
        </PublicLayout>
    );
}
