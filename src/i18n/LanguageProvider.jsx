import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

// Lightweight i18n — a Context + dictionary lookup, no external library (the
// string set is finite and this keeps the bundle lean per CLAUDE.md). Language
// is persisted to localStorage and mirrored onto <html lang/dir> so RTL,
// font selection, and screen readers all follow. An inline script in index.html
// applies the stored dir before React mounts, so returning Arabic visitors get
// no left-to-right flash.
const STORAGE_KEY = 'ab-lang';
const LanguageContext = createContext(null);

function readInitial() {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'ar' || stored === 'en' ? stored : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitial);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private-mode / storage disabled — the in-memory state still works */
    }
  }, [lang, dir]);

  const t = useCallback(
    (key) => {
      const table = translations[lang] || translations.en;
      return table[key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
