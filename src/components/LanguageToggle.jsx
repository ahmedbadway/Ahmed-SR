import { useLang } from '../i18n/LanguageProvider.jsx';

// Compact SVG flags — inline (no emoji per CLAUDE.md), crisp at any size.
// Egypt marks the Arabic option, the UK marks English.
function EgyptFlag() {
  return (
    <svg viewBox="0 0 60 40" className="h-full w-full" aria-hidden="true">
      <rect width="60" height="40" fill="#f5f5f5" />
      <rect width="60" height="13.33" y="0" fill="#ce1126" />
      <rect width="60" height="13.34" y="26.66" fill="#111" />
      {/* Simplified gold Eagle of Saladin */}
      <g fill="#c09a3e">
        <path d="M30 15.5c2.6 0 4.6 1.2 5.4 3-1.1-.6-2.4-.9-3.7-.7 1 .5 1.8 1.3 2.2 2.4-1-.7-2.2-1-3.4-.9.7.6 1.2 1.5 1.3 2.5-.6-.7-1.4-1.2-2.3-1.4v3.1h-1.1v-3.1c-.9.2-1.7.7-2.3 1.4.1-1 .6-1.9 1.3-2.5-1.2-.1-2.4.2-3.4.9.4-1.1 1.2-1.9 2.2-2.4-1.3-.2-2.6.1-3.7.7.8-1.8 2.8-3 5.4-3z" />
        <rect x="25" y="24.4" width="10" height="1.1" rx="0.5" />
      </g>
    </svg>
  );
}

function UkFlag() {
  return (
    <svg viewBox="0 0 60 40" className="h-full w-full" aria-hidden="true">
      <clipPath id="uk-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        {/* White saltire, then thinner red saltire on top */}
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" strokeWidth="3" />
        {/* White cross, then thinner red cross */}
        <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0 V40 M0 20 H60" stroke="#c8102e" strokeWidth="7" />
      </g>
    </svg>
  );
}

const options = [
  { code: 'en', Flag: UkFlag },
  { code: 'ar', Flag: EgyptFlag },
];

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className={`flex items-center gap-1 rounded-full border border-line p-1 ${className}`}
    >
      {options.map(({ code, Flag }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={t(`lang.${code}`)}
            title={t(`lang.${code}`)}
            className={`h-6 w-9 overflow-hidden rounded-md ring-1 transition-[opacity,box-shadow,transform] duration-200 active:scale-95 ${
              active
                ? 'opacity-100 ring-gold'
                : 'opacity-45 ring-transparent hover:opacity-80'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            <Flag />
          </button>
        );
      })}
    </div>
  );
}
