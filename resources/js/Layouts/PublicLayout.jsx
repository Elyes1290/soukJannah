import { Link, usePage, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import Analytics from "../Components/Analytics";
import CookieBanner from "../Components/CookieBanner";
import { useT } from "../contexts/LanguageContext";

function NewsletterForm() {
    const { t, lang } = useT();
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({ email: '', locale: lang });
    const success = flash?.newsletter_success;

    useEffect(() => {
        setData('locale', lang);
    }, [lang, setData]);

    const submit = (e) => {
        e.preventDefault();
        post('/newsletter/subscribe', { onSuccess: () => reset('email') });
    };

    return (
        <div id="newsletter" className="border-t border-b py-10 mb-12 scroll-mt-24" style={{ borderColor: '#2C2C2C' }}>
            <div className="max-w-xl mx-auto text-center">
                <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#C8A96E' }}>
                    {t('newsletter_tag')}
                </p>
                <h3 className="font-serif text-xl mb-2" style={{ color: '#FAF8F4' }}>
                    {t('newsletter_title')}
                </h3>
                <p className="text-xs mb-6 font-light" style={{ color: '#6B6560' }}>
                    {t('newsletter_intro')}
                </p>

                {success ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: '#C8A96E' }}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('newsletter_success')}
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex gap-0 max-w-sm mx-auto">
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder={t('newsletter_placeholder')}
                            required
                            className="flex-1 px-4 py-3 text-sm font-light outline-none"
                            style={{ backgroundColor: '#2C2C2C', color: '#FAF8F4', border: '1px solid #3C3C3C', borderRight: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-3 text-xs font-medium uppercase tracking-wider flex-shrink-0 transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#C8A96E', color: '#1A1A1A', letterSpacing: '0.1em' }}
                        >
                            {processing ? t('newsletter_sending') : t('newsletter_submit')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function PublicLayout({ children }) {
    const {
        cartCount,
        settings,
        navCategories = [],
        authCustomer,
        popularSearches = [],
    } = usePage().props;
    const shopName = settings?.shop_name || t("brand_name");
    const { t, lang, switchLang } = useT();

    const getInitialConsent = () => {
        try {
            return localStorage.getItem("cookie_consent");
        } catch {
            return null;
        }
    };
    const [cookieConsent, setCookieConsent] = useState(getInitialConsent);

    const handleAccept = () => {
        try {
            localStorage.setItem("cookie_consent", "accepted");
        } catch {}
        setCookieConsent("accepted");
    };
    const handleDecline = () => {
        try {
            localStorage.setItem("cookie_consent", "declined");
        } catch {}
        setCookieConsent("declined");
    };

    // Dropdown catégories desktop
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoveredCatId, setHoveredCatId] = useState(null);
    const dropdownTimeout = useRef(null);
    const openDropdown = () => {
        clearTimeout(dropdownTimeout.current);
        setDropdownOpen(true);
    };
    const closeDropdown = () => {
        dropdownTimeout.current = setTimeout(() => { setDropdownOpen(false); setHoveredCatId(null); }, 150);
    };

    // Menu mobile
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
    const closeMobile = () => {
        setMobileOpen(false);
        setMobileCatsOpen(false);
    };

    // Recherche
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const searchBlurTimeout = useRef(null);
    const searchRef = useRef(null);
    const openSearch = () => {
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
    };
    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };
    const submitSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        closeSearch();
        window.location.href = `/boutique?q=${encodeURIComponent(q)}`;
    };

    const LangSwitcher = ({ mobile = false }) => (
        <div className={`flex items-center gap-1 ${mobile ? "" : ""}`}>
            <button
                onClick={() => switchLang("en")}
                className="text-xs font-medium tracking-wider uppercase transition-opacity"
                style={{
                    color:
                        lang === "en"
                            ? "#C8A96E"
                            : mobile
                              ? "#5A5550"
                              : "#9A9490",
                    opacity: lang === "en" ? 1 : 0.7,
                }}
            >
                EN
            </button>
            <span
                className="text-xs"
                style={{ color: mobile ? "#3A3530" : "#D4CFC8" }}
            >
                |
            </span>
            <button
                onClick={() => switchLang("fr")}
                className="text-xs font-medium tracking-wider uppercase transition-opacity"
                style={{
                    color:
                        lang === "fr"
                            ? "#C8A96E"
                            : mobile
                              ? "#5A5550"
                              : "#9A9490",
                    opacity: lang === "fr" ? 1 : 0.7,
                }}
            >
                FR
            </button>
        </div>
    );

    return (
        <>
            <Analytics consent={cookieConsent} />
            {cookieConsent === null && (
                <CookieBanner
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                />
            )}
            <div
                className="min-h-screen flex flex-col"
                style={{ backgroundColor: "#FAF8F4" }}
            >
                {/* Barre livraison */}
                <div
                    style={{ backgroundColor: "#1A1A1A" }}
                    className="text-center py-2.5 px-4"
                >
                    <p className="text-xs tracking-widest uppercase text-white/70 font-light">
                        {t("topbar")}
                    </p>
                </div>

                {/* Header */}
                <header
                    className="bg-white sticky top-0 z-50"
                    style={{ borderBottom: "1px solid #E8E2D9" }}
                >
                    {/* ── Rangée 1 : Logo + Recherche + Actions ── */}
                    <div className="max-w-6xl mx-auto px-4 max-md:pl-3 max-md:pr-1.5 py-2 flex items-center gap-3 max-md:gap-2 justify-between md:justify-start">
                        {/* Logo — overflow-hidden pour rogner le padding transparent du PNG */}
                        <Link href="/" className="flex-shrink-0 block overflow-hidden" style={{ height: '80px' }}>
                            <img
                                src="/images/logo.png"
                                alt={shopName}
                                className="w-auto object-contain"
                                style={{ height: '160px', marginTop: '-36px' }}
                            />
                        </Link>

                        {/* Barre de recherche (desktop) */}
                        <div className="hidden md:block flex-1 relative">
                            <form
                                onSubmit={submitSearch}
                                className="flex items-center border-2 rounded-full overflow-hidden transition-all"
                                style={{ borderColor: searchFocused ? "#C8A96E" : "#1A1A1A" }}
                            >
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => { clearTimeout(searchBlurTimeout.current); setSearchFocused(true); }}
                                    onBlur={() => { searchBlurTimeout.current = setTimeout(() => setSearchFocused(false), 200); }}
                                    placeholder={t("nav_search_placeholder") || "Rechercher un produit halal…"}
                                    className="flex-1 px-5 py-2.5 text-sm font-light outline-none bg-transparent"
                                    style={{ color: "#1A1A1A" }}
                                />
                                <button type="submit"
                                    className="flex items-center justify-center w-12 h-10 flex-shrink-0 transition-colors"
                                    style={{ backgroundColor: searchFocused ? "#C8A96E" : "#1A1A1A" }}
                                    aria-label={t("nav_search_btn")}>
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </button>
                            </form>

                            {/* Dropdown suggestions au focus */}
                            {searchFocused && !searchQuery && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-xl border z-[60] rounded-lg overflow-hidden"
                                    style={{ borderColor: "#E8E2D9" }}
                                    onMouseDown={e => e.preventDefault()}>

                                    {/* Catégories rapides */}
                                    {navCategories.length > 0 && (
                                        <div className="px-5 pt-4 pb-3">
                                            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C8A96E" }}>
                                                {t("nav_categories")}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {navCategories.slice(0, 6).map(cat => (
                                                    <Link key={cat.slug} href={`/boutique?categorie=${cat.slug}`}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-full border transition-colors hover:border-amber-400 hover:bg-amber-50"
                                                        style={{ borderColor: "#E8E2D9", color: "#1A1A1A" }}>
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recherches populaires */}
                                    {popularSearches.length > 0 && (
                                        <div className="px-5 py-4 border-t" style={{ borderColor: "#F0EBE1" }}>
                                            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#C8A96E" }}>
                                                {t("nav_search_popular_heading")}
                                            </p>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                {popularSearches.map(term => (
                                                    <button key={term}
                                                        onMouseDown={() => { setSearchQuery(term); setTimeout(() => { window.location.href = `/boutique?q=${encodeURIComponent(term)}`; }, 50); }}
                                                        className="flex items-center gap-2 text-sm font-light text-left hover:opacity-70 transition-opacity"
                                                        style={{ color: "#1A1A1A" }}>
                                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#9A9490" }}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                        </svg>
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions droite */}
                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 max-md:mr-0">
                            {/* Compte */}
                            {authCustomer ? (
                                <Link
                                    href="/mon-compte"
                                    className="hidden md:flex items-center gap-2 transition-opacity hover:opacity-60"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                                        style={{
                                            backgroundColor: "#C8A96E",
                                            color: "#1A1A1A",
                                        }}
                                    >
                                        {authCustomer.first_name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <span
                                        className="hidden lg:block text-xs font-medium"
                                        style={{
                                            color: "#1A1A1A",
                                            maxWidth: "80px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {authCustomer.first_name}
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    href="/mon-compte/connexion"
                                    className="hidden md:flex items-center gap-1.5 transition-opacity hover:opacity-60"
                                    title={t("account_nav")}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        style={{ color: "#1A1A1A" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    </svg>
                                </Link>
                            )}

                            {/* Langue */}
                            <div className="hidden md:block">
                                <LangSwitcher />
                            </div>

                            {/* Recherche mobile */}
                            <button
                                onClick={openSearch}
                                className="md:hidden transition-opacity hover:opacity-60"
                                aria-label={t("nav_search_btn")}
                                style={{ color: "#1A1A1A" }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </button>

                            {/* Panier */}
                            <Link
                                href="/panier"
                                className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
                                style={{ color: "#1A1A1A" }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span
                                        className="text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                                        style={{ backgroundColor: "#C8A96E" }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Hamburger mobile */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
                                aria-label={t("nav_open_menu")}
                            >
                                <span
                                    className="block h-px w-5"
                                    style={{ backgroundColor: "#1A1A1A" }}
                                />
                                <span
                                    className="block h-px w-5"
                                    style={{ backgroundColor: "#1A1A1A" }}
                                />
                                <span
                                    className="block h-px w-3"
                                    style={{ backgroundColor: "#1A1A1A" }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* ── Rangée 2 : Navigation (desktop uniquement) ── */}
                    <div
                        className="hidden md:block border-t"
                        style={{ borderColor: "#E8E2D9" }}
                    >
                        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center gap-8">
                            <Link
                                href="/boutique"
                                className="text-xs tracking-widest uppercase font-medium hover:opacity-60 transition-opacity"
                                style={{ color: "#1A1A1A" }}
                            >
                                {t("nav_shop")}
                            </Link>

                            {navCategories.length > 0 && (
                                <div
                                    className="relative h-full flex items-center"
                                    onMouseEnter={openDropdown}
                                    onMouseLeave={closeDropdown}
                                >
                                    <button
                                        className="flex items-center gap-1 text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60"
                                        style={{ color: "#6B6560" }}
                                    >
                                        {t("nav_categories")}
                                        <svg
                                            className="w-3 h-3 transition-transform"
                                            style={{
                                                transform: dropdownOpen
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                            }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            className="absolute left-0 top-full bg-white shadow-xl z-50 flex"
                                            style={{ minWidth: "640px", borderTop: "3px solid #C8A96E", border: "1px solid #E8E2D9", borderTop: "3px solid #C8A96E", maxHeight: "420px" }}
                                            onMouseEnter={openDropdown}
                                            onMouseLeave={closeDropdown}
                                        >
                                            {/* Colonne gauche — catégories principales */}
                                            <div className="w-52 flex-shrink-0 border-r overflow-y-auto" style={{ borderColor: "#E8E2D9", backgroundColor: "#FAF8F4" }}>
                                                <div className="px-4 py-3 border-b" style={{ borderColor: "#E8E2D9" }}>
                                                    <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#C8A96E" }}>{t("nav_categories")}</span>
                                                </div>
                                                {navCategories.map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        onMouseEnter={() => setHoveredCatId(cat.id)}
                                                        onClick={() => { window.location.href = `/boutique?categorie=${cat.slug}`; }}
                                                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors border-b"
                                                        style={{
                                                            borderColor: "#F0EBE1",
                                                            backgroundColor: hoveredCatId === cat.id ? "#FFFFFF" : "transparent",
                                                            color: hoveredCatId === cat.id ? "#1A1A1A" : "#4A4540",
                                                            fontWeight: hoveredCatId === cat.id ? "500" : "400",
                                                        }}
                                                    >
                                                        {cat.name}
                                                        {cat.children?.length > 0 && (
                                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#C8A96E" }}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                                <Link href="/boutique" className="flex items-center gap-1 px-4 py-3 text-xs font-medium tracking-wider uppercase hover:opacity-70 transition-opacity" style={{ color: "#C8A96E" }}>
                                                    {t("nav_view_full_shop")} →
                                                </Link>
                                            </div>

                                            {/* Colonne droite — sous-catégories */}
                                            <div className="flex-1 p-5 overflow-y-auto">
                                                {(() => {
                                                    const active = hoveredCatId
                                                        ? navCategories.find(c => c.id === hoveredCatId)
                                                        : navCategories[0];
                                                    if (!active) return null;
                                                    const palette = ["#1B4332","#C8A96E","#2D5A3D","#8B7355","#1A3A2A","#D4B896","#3D7A55","#A0845C"];
                                                    const textPalette = ["#FAF8F4","#1A1A1A","#FAF8F4","#FAF8F4","#C8A96E","#1A1A1A","#FAF8F4","#FAF8F4"];
                                                    const subs = active.children?.length > 0 ? active.children : [];
                                                    return (
                                                        <>
                                                            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#C8A96E" }}>{active.name}</p>
                                                            {subs.length > 0 ? (
                                                                <div className="grid grid-cols-3 gap-3">
                                                                    {subs.map((sub, i) => (
                                                                        <Link key={sub.slug} href={`/boutique?categorie=${sub.slug}`}
                                                                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-amber-50 transition-colors group">
                                                                            {sub.image ? (
                                                                                <img
                                                                                    src={`/storage/${sub.image}`}
                                                                                    alt={sub.name}
                                                                                    className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform border-2"
                                                                                    style={{ borderColor: "#E8E2D9" }}
                                                                                />
                                                                            ) : (
                                                                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-105 transition-transform"
                                                                                    style={{ backgroundColor: palette[i % palette.length], color: textPalette[i % textPalette.length] }}>
                                                                                    {sub.name.charAt(0).toUpperCase()}
                                                                                </div>
                                                                            )}
                                                                            <span className="text-xs text-center font-medium leading-tight" style={{ color: "#1A1A1A" }}>{sub.name}</span>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-32">
                                                                    <Link href={`/boutique?categorie=${active.slug}`}
                                                                        className="text-sm font-medium flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "#1A1A1A" }}>
                                                                        Voir tous les produits →
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Link
                                href="/blog"
                                className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60"
                                style={{ color: "#6B6560" }}
                            >
                                {t("nav_blog")}
                            </Link>
                            <Link
                                href="/a-propos"
                                className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60"
                                style={{ color: "#6B6560" }}
                            >
                                {t("nav_about")}
                            </Link>
                            <Link
                                href="/contact"
                                className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60"
                                style={{ color: "#6B6560" }}
                            >
                                {t("nav_contact")}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ══════════════════════════════════════
                OVERLAY RECHERCHE
            ══════════════════════════════════════ */}
                {searchOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            style={{ backgroundColor: "rgba(26,26,26,0.6)" }}
                            onClick={closeSearch}
                        />
                        <div
                            className="fixed top-0 left-0 right-0 z-[70] bg-white shadow-lg"
                            style={{ borderBottom: "2px solid #C8A96E" }}
                        >
                            <form
                                onSubmit={submitSearch}
                                className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-4"
                            >
                                <svg
                                    className="w-5 h-5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    style={{ color: "#C8A96E" }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder={t("nav_search_placeholder")}
                                    className="flex-1 text-base font-light outline-none bg-transparent"
                                    style={{ color: "#1A1A1A" }}
                                />
                                {searchQuery && (
                                    <button
                                        type="submit"
                                        className="text-xs font-medium tracking-widest uppercase px-4 py-2"
                                        style={{
                                            backgroundColor: "#1A1A1A",
                                            color: "#FAF8F4",
                                        }}
                                    >
                                        {t("nav_search_btn")}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    className="opacity-40 hover:opacity-100 transition-opacity"
                                    aria-label={t("nav_close")}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        style={{ color: "#1A1A1A" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* ══════════════════════════════════════
                MENU MOBILE
            ══════════════════════════════════════ */}
                {mobileOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            style={{ backgroundColor: "rgba(26,26,26,0.5)" }}
                            onClick={closeMobile}
                        />

                        <div
                            className="fixed top-0 left-0 h-full w-[85vw] max-w-xs z-[70] flex flex-col"
                            style={{ backgroundColor: "#1A1A1A" }}
                        >
                            <div
                                className="flex items-center justify-between px-6 py-5 border-b"
                                style={{ borderColor: "#2C2C2C" }}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/logo.png"
                                        alt={shopName}
                                        className="h-10 w-auto object-contain"
                                    />
                                    <span
                                        className="font-serif text-sm tracking-[0.15em] uppercase"
                                        style={{ color: "#FAF8F4" }}
                                    >
                                        {shopName}
                                    </span>
                                </div>
                                <button
                                    onClick={closeMobile}
                                    aria-label={t("nav_close")}
                                    className="opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        style={{ color: "#FAF8F4" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto py-4">
                                <Link
                                    href="/boutique"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: "#FAF8F4",
                                    }}
                                >
                                    {t("nav_shop")}
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        style={{ color: "#C8A96E" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                </Link>

                                {navCategories.length > 0 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setMobileCatsOpen(
                                                    !mobileCatsOpen,
                                                )
                                            }
                                            className="w-full flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                            style={{
                                                borderColor: "#2C2C2C",
                                                color: "#6B6560",
                                            }}
                                        >
                                            {t("nav_categories")}
                                            <svg
                                                className="w-3.5 h-3.5 transition-transform"
                                                style={{
                                                    transform: mobileCatsOpen
                                                        ? "rotate(180deg)"
                                                        : "none",
                                                    color: "#C8A96E",
                                                }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        {mobileCatsOpen && (
                                            <div
                                                style={{
                                                    backgroundColor: "#111111",
                                                }}
                                            >
                                                {navCategories.map((cat) => (
                                                    <Link
                                                        key={cat.slug}
                                                        href={`/boutique?categorie=${cat.slug}`}
                                                        onClick={closeMobile}
                                                        className="flex items-center gap-3 pl-10 pr-6 py-3.5 border-b text-sm font-light transition-opacity hover:opacity-70"
                                                        style={{
                                                            borderColor:
                                                                "#1E1E1E",
                                                            color: "#9A9490",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#C8A96E",
                                                                fontSize:
                                                                    "10px",
                                                            }}
                                                        >
                                                            —
                                                        </span>
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                <Link
                                    href="/blog"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: "#6B6560",
                                    }}
                                >
                                    {t("nav_blog")}
                                </Link>

                                <Link
                                    href="/a-propos"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: "#6B6560",
                                    }}
                                >
                                    {t("nav_about")}
                                </Link>

                                <Link
                                    href="/mon-compte"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: authCustomer
                                            ? "#C8A96E"
                                            : "#6B6560",
                                    }}
                                >
                                    {authCustomer
                                        ? authCustomer.first_name
                                        : t("account_nav")}
                                    {authCustomer && (
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                                            style={{
                                                backgroundColor: "#C8A96E",
                                                color: "#1A1A1A",
                                            }}
                                        >
                                            {authCustomer.first_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </Link>

                                <Link
                                    href="/contact"
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: "#6B6560",
                                    }}
                                >
                                    {t("nav_contact")}
                                </Link>

                                <Link
                                    href="/panier"
                                    onClick={closeMobile}
                                    className="flex items-center gap-3 px-6 py-4 border-b text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
                                    style={{
                                        borderColor: "#2C2C2C",
                                        color: "#FAF8F4",
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                                        />
                                    </svg>
                                    {t("nav_cart")}
                                    {cartCount > 0 && (
                                        <span
                                            className="text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium text-[10px]"
                                            style={{
                                                backgroundColor: "#C8A96E",
                                                color: "#1A1A1A",
                                            }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </nav>

                            {/* Recherche mobile */}
                            <div
                                className="px-6 py-3 border-t"
                                style={{ borderColor: "#2C2C2C" }}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const q = e.target.q.value.trim();
                                        if (q) {
                                            closeMobile();
                                            window.location.href = `/boutique?q=${encodeURIComponent(q)}`;
                                        }
                                    }}
                                    className="flex items-center gap-3 border rounded px-3 py-2"
                                    style={{ borderColor: "#2C2C2C" }}
                                >
                                    <svg
                                        className="w-4 h-4 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        style={{ color: "#5A5550" }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                    <input
                                        name="q"
                                        type="text"
                                        placeholder={t(
                                            "nav_search_mobile_placeholder",
                                        )}
                                        className="flex-1 bg-transparent text-sm font-light outline-none"
                                        style={{ color: "#FAF8F4" }}
                                    />
                                </form>
                            </div>

                            {/* Bas du drawer — langue + info */}
                            <div
                                className="px-6 py-4 border-t flex items-center justify-between"
                                style={{ borderColor: "#2C2C2C" }}
                            >
                                <p
                                    className="text-xs font-light"
                                    style={{ color: "#5A5550" }}
                                >
                                    {t("footer_free_shipping")}
                                </p>
                                <LangSwitcher mobile />
                            </div>
                        </div>
                    </>
                )}

                {/* Main */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <footer
                    style={{ backgroundColor: "#1A1A1A", color: "#FAF8F4" }}
                >
                    <div className="max-w-6xl mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            <div>
                                <div className="mb-4">
                                    <img
                                        src="/images/logo.png"
                                        alt={shopName}
                                        className="h-48 w-auto object-contain"
                                    />
                                    <div
                                        className="h-px w-8 mt-3"
                                        style={{ backgroundColor: "#C8A96E" }}
                                    ></div>
                                </div>
                                <p
                                    className="text-xs leading-relaxed"
                                    style={{ color: "#9A9490" }}
                                >
                                    {t("footer_tagline")}
                                </p>
                            </div>
                            <div>
                                <h4
                                    className="text-xs tracking-widest uppercase mb-4"
                                    style={{ color: "#C8A96E" }}
                                >
                                    {t("footer_navigation")}
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        [t("nav_shop"), "/boutique"],
                                        [t("nav_blog"), "/blog"],
                                        [t("nav_about"), "/a-propos"],
                                        [t("nav_contact"), "/contact"],
                                        [t("account_nav"), "/mon-compte"],
                                    ].map(([label, href]) => (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className="text-xs hover:text-white transition-colors"
                                                style={{ color: "#9A9490" }}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4
                                    className="text-xs tracking-widest uppercase mb-4"
                                    style={{ color: "#C8A96E" }}
                                >
                                    {t("footer_information")}
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        [t("footer_delivery"), "/livraison"],
                                        [t("footer_faq"), "/faq"],
                                        [t("tracking_page_title"), "/suivi"],
                                        [
                                            t("footer_legal"),
                                            "/mentions-legales",
                                        ],
                                    ].map(([label, href]) => (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className="text-xs hover:text-white transition-colors"
                                                style={{ color: "#9A9490" }}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Newsletter */}
                        <NewsletterForm />

                        <div
                            className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                            style={{ borderColor: "#2C2C2C" }}
                        >
                            <p className="text-xs" style={{ color: "#6B6560" }}>
                                © {new Date().getFullYear()} {shopName}.{" "}
                                {t("footer_rights")}
                            </p>
                            <p className="text-xs" style={{ color: "#6B6560" }}>
                                {t("footer_payment")}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
