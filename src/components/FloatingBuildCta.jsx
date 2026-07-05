import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { PenNib } from '@phosphor-icons/react';
import { navigate } from '../hooks/useHashRoute.js';
import { useHoverCapable } from '../hooks/useHoverCapable.js';
import { useLang } from '../i18n/LanguageProvider.jsx';

// Persistent shortcut to the Build Your Design studio. Appears once the
// visitor scrolls past the Hero (where the same CTA already lives inline, so
// showing it from the very top would just repeat it) and stays fixed for the
// rest of the scroll. Hidden entirely on the /build route itself.
export default function FloatingBuildCta({ route }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = pastHero && route !== '/build';

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 16 }}
          transition={{ duration: reduce ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 end-6 z-40"
        >
          <button
            onClick={() => navigate('/build')}
            aria-label={t('nav.build')}
            className="group flex items-center overflow-hidden rounded-full bg-gold text-bg shadow-[0_16px_40px_-16px_rgba(var(--gold-rgb),0.7)] transition-colors duration-200 hover:bg-gold-soft active:scale-[0.97]"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center">
              <PenNib size={22} weight="fill" />
            </span>
            {canHover ? (
              <span className="max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-[max-width] duration-300 ease-out group-hover:max-w-[200px]">
                <span className="inline-block pe-6 text-sm">{t('nav.build')}</span>
              </span>
            ) : null}
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
