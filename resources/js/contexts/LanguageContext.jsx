import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

function interpolate(template, vars) {
    if (vars == null || typeof template !== 'string') {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (_, name) =>
        vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : `{${name}}`,
    );
}

export function LanguageProvider({ children }) {
    const getInitialLang = () => {
        try {
            return localStorage.getItem('lang') || 'en';
        } catch {
            return 'en';
        }
    };

    const [lang, setLang] = useState(getInitialLang);

    const t = useMemo(() => {
        return (key, vars) => {
            const raw = translations[lang]?.[key] ?? translations.en?.[key] ?? key;
            return interpolate(raw, vars);
        };
    }, [lang]);

    const translateFlash = useMemo(() => {
        return (payload) => {
            if (payload === null || payload === undefined || payload === '') {
                return null;
            }
            if (typeof payload === 'object' && !Array.isArray(payload) && typeof payload.key === 'string') {
                const raw = translations[lang]?.[payload.key] ?? translations.en?.[payload.key] ?? payload.key;

                return interpolate(raw, payload.vars ?? {});
            }
            if (typeof payload === 'string') {
                const raw = translations[lang]?.[payload] ?? translations.en?.[payload] ?? '';
                return raw !== '' ? interpolate(raw, {}) : payload;
            }
            return String(payload);
        };
    }, [lang]);

    const switchLang = (l) => {
        setLang(l);
        try {
            localStorage.setItem('lang', l);
        } catch {}
    };

    const value = useMemo(
        () => ({ lang, t, translateFlash, switchLang }),
        [lang, t, translateFlash],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useT = () => useContext(LanguageContext);
