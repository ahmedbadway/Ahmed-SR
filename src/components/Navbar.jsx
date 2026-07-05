import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { List, X, PenNib } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';
import { getLenis } from '../utils/lenis.js';
import { navigate } from '../hooks/useHashRoute.js';
import { useLang } from '../i18n/LanguageProvider.jsx';
import Logo from './Logo.jsx';
import LanguageToggle from './LanguageToggle.jsx';

const links = [
  { id: 'about', key: 'nav.about' },
  { id: 'projects', key: 'nav.work' },
  { id: 'skills', key: 'nav.skills' },
];

export default function Navbar({ route = '/' }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = route === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open. Lenis ignores
  // overflow:hidden, so pause it explicitly too.
  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
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

  return (
    <m.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`shell flex h-[68px] items-center justify-between transition-colors duration-300 ${
          scrolled ? 'glass !rounded-none border-x-0 border-t-0' : ''
        }`}
      >
        <button
          onClick={() => (onHome ? go('main') : navigate('/'))}
          aria-label={t('nav.home')}
        >
          <Logo />
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              data-magnetic
              onClick={() => go(l.id)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {t(l.key)}
            </button>
          ))}
          <button
            data-magnetic
            onClick={() => go('contact')}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            {t('nav.contact')}
          </button>
          <button
            data-magnetic
            onClick={goBuild}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 active:scale-[0.97] ${
              onHome
                ? 'bg-gold text-bg hover:bg-gold-soft'
                : 'border border-gold bg-gold/12 text-gold'
            }`}
          >
            <PenNib size={16} weight="fill" />
            {t('nav.build')}
          </button>
          <LanguageToggle />
        </div>

        {/* Mobile trigger + language */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <m.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="shell md:hidden"
          >
            <div className="glass mt-2 flex flex-col gap-1 rounded-card p-3">
              {[...links, { id: 'contact', key: 'nav.contact' }].map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="rounded-xl px-4 py-3 text-start text-lg text-ink transition-colors hover:bg-surface-2"
                >
                  {t(l.key)}
                </button>
              ))}
              <button
                onClick={goBuild}
                className="mt-1 flex items-center gap-2 rounded-xl bg-gold px-4 py-3 text-start text-lg font-semibold text-bg transition-colors hover:bg-gold-soft"
              >
                <PenNib size={19} weight="fill" />
                {t('nav.build')}
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.header>
  );
}
