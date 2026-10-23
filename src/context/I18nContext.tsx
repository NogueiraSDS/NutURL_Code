'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import pt from '@/locales/pt.json';
import en from '@/locales/en.json';

type Locale = 'pt' | 'en';
type Translations = typeof pt;

const translations: Record<Locale, Translations> = { pt, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'pt',
  setLocale: () => {},
  t: () => '',
});

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nuturl_locale') as Locale;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocaleState(saved);
    } else {
      // Checa idioma e fuso horário para garantir detecção do Brasil
      const userLang = (navigator.language || '').toLowerCase();
      const userLangs = (navigator.languages || []).map(l => l.toLowerCase());
      const timeZone = Intl?.DateTimeFormat?.().resolvedOptions()?.timeZone || '';
      
      const isBrazilTimeZone = timeZone.includes('Sao_Paulo') || 
                               timeZone.includes('Fortaleza') || 
                               timeZone.includes('Belem') || 
                               timeZone.includes('Manaus') || 
                               timeZone.includes('Cuiaba') || 
                               timeZone.includes('Recife') || 
                               timeZone.includes('Maceio') || 
                               timeZone.includes('Noronha') || 
                               timeZone.includes('Porto_Velho') || 
                               timeZone.includes('Boa_Vista') || 
                               timeZone.includes('Rio_Branco');

      const isPortuguese = userLang.startsWith('pt') || userLangs.some(l => l.startsWith('pt'));

      if (isBrazilTimeZone || isPortuguese) {
        setLocaleState('pt');
      } else {
        setLocaleState(userLang.startsWith('en') ? 'en' : 'pt');
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('nuturl_locale', l);
    // document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`; // Optional if we ever need it in server components
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Fallback to key name if not found
      }
    }

    if (typeof value !== 'string') return key;

    let text = value;
    if (variables) {
      for (const [vKey, vVal] of Object.entries(variables)) {
        text = text.replace(`{${vKey}}`, vVal);
      }
    }
    
    return text;
  };

  // Prevent hydration mismatch by not rendering until we know the locale
  if (!mounted) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}></div>;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
