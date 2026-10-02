import { ArrowUp } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';
import { useLang } from '../i18n/LanguageProvider.jsx';
import Logo from './Logo.jsx';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[var(--z-content)] border-t border-line">
      <div className="shell flex flex-col items-start justify-between gap-8 py-10 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-faint">
            {/* The build-time year can differ from the visitor's clock. */}
            <span suppressHydrationWarning>{t('footer.rights').replace('{year}', year)}</span>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            {t('footer.place')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => scrollToId('main')}
          className="btn btn-ghost px-5 py-3 text-sm"
        >
          {t('footer.top')}
          <ArrowUp size={15} weight="bold" />
        </button>
      </div>
    </footer>
  );
}
