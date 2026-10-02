import { useLang } from '../i18n/LanguageProvider.jsx';

// Two-option segmented control. Text labels instead of flags: a flag names a
// country, not a language, and Arabic and English are both spoken far beyond
// any one of them. Each option is labelled in its own language.
const OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
];

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className={`flex items-center rounded-full border border-line p-0.5 ${className}`}
    >
      {OPTIONS.map(({ code, label }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={t(`lang.${code}`)}
            className={`grid h-8 min-w-9 place-items-center rounded-full px-2.5 text-[0.8rem] font-semibold transition-[background-color,color,transform] duration-200 ease-out active:scale-95 ${
              active ? 'bg-surface-2 text-gold' : 'text-faint can-hover:hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
