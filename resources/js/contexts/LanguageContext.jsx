import { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const getInitialLang = () => {
        try {
            return localStorage.getItem('lang') || 'en';
        } catch {
            return 'en';
        }
    };

    const [lang, setLang] = useState(getInitialLang);

    const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

    const switchLang = (l) => {
        setLang(l);
        try {
            localStorage.setItem('lang', l);
        } catch {}
    };

    return (
        <LanguageContext.Provider value={{ lang, t, switchLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useT = () => useContext(LanguageContext);
