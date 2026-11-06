// Provides the chosen language to the whole site (see ./index.ts for useI18n).
// The chosen language is stored in localStorage so it survives page reloads.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { en, type TKey } from './en';
import { I18nContext, type Lang } from './index';
import { mr } from './mr';

const STORAGE_KEY = 'kes_lang';

function readLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'mr' ? 'mr' : 'en';
  } catch {
    return 'en';
  }
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    // English pages load only a small Devanagari subset; Marathi needs the full font.
    if (lang === 'mr' && !document.getElementById('font-mr')) {
      const link = document.createElement('link');
      link.id = 'font-mr';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600&display=swap';
      document.head.appendChild(link);
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — language just won't be remembered */
    }
  }, []);

  const t = useCallback((key: TKey) => (lang === 'mr' && mr[key]) || en[key], [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
