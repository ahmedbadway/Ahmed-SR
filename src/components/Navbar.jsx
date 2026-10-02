import { useEffect, useRef, useState } from 'react';
import { List, X, ArrowUpRight } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';
import { getLenis } from '../utils/lenis.js';
import { navigate } from '../hooks/useHashRoute.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useLang } from '../i18n/LanguageProvider.jsx';
import Logo from './Logo.jsx';
import LanguageToggle from './LanguageToggle.jsx';

const LINKS = [
  { id: 'work', key: 'nav.work' },
  { id: 'services', key: 'nav.services' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
];
const SECTION_IDS = LINKS.map((l) => l.id);

// Releases the scroll lock the open mobile sheet holds. Called before any
// programmatic scroll from the sheet: otherwise the jump fires while Lenis is
// still stopped (and the body still overflow:hidden) and silently goes nowhere.
function unlockScroll() {
  document.body.style.overflow = '';
  getLenis()?.start();
}

export default function Navbar({ route = '/' }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const onHome = route === '/';
  const active = useActiveSection(SECTION_IDS, onHome);

  // The bar picks up its surface once the page leaves the top. An observer on
  // a sentinel at the top of the document replaces a per-frame scroll listener.
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return undefined;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Lock scroll while the mobile sheet is open (Lenis ignores overflow, so it
  // is paused explicitly) and close the sheet on Escape.
  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) lenis?.stop();
    else lenis?.start();

    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    unlockScroll();
    // Section anchors only exist on the home route. From the build page, route
    // home first, then scroll once the sections have mounted.
    if (onHome) {
      scrollToId(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToId(id), 90);
    }
  };

  const goBuild = () => {
    setOpen(false);
    navigate('/build');
  };

  const goHome = () => {
    setOpen(false);
    unlockScroll();
    if (onHome) scrollToId('main');
    else navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-nav">
      <div className="shell pt-3">
        <nav
          aria-label="Primary"
          className={`flex h-14 items-center justify-between gap-4 rounded-full border ps-4 pe-2 transition-[background-color,border-color,box-shadow] duration-300 ease-out md:h-16 md:ps-5 ${
            scrolled || open
              ? 'border-line bg-surface shadow-[0_18px_40px_-24px_var(--shadow-deep)]'
              : 'border-transparent bg-transparent'
          }`}
        >
          <button type="button" onClick={goHome} aria-label={t('nav.home')} className="shrink-0">
            <Logo />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-muted can-hover:hover:text-ink'
                    }`}
                  >
                    {t(l.key)}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={goBuild}
              className={`btn hidden px-5 py-3 text-sm md:inline-flex ${
                onHome ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {t('nav.cta')}
              <ArrowUpRight size={15} weight="bold" className="rtl:-scale-x-100" />
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? t('nav.close') : t('nav.open')}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-transform duration-150 active:scale-95 md:hidden"
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile sheet. Always in the DOM so it can transition; hidden from
            assistive tech and the tab order while closed. */}
        <div
          id="mobile-menu"
          inert={open ? undefined : ''}
          aria-hidden={!open}
          className={`glass mt-2 origin-top rounded-card p-3 transition-[opacity,transform] duration-200 ease-out md:hidden ${
            open
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
          }`}
        >
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="w-full rounded-field px-4 py-3.5 text-start text-lg text-ink transition-colors active:bg-surface-2"
                >
                  {t(l.key)}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-line px-2 pt-4">
            <button type="button" onClick={goBuild} className="btn btn-primary w-full py-3.5 text-sm">
              {t('nav.cta')}
              <ArrowUpRight size={15} weight="bold" className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
