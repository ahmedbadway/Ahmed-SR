import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';

const links = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
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
          onClick={() => go('main')}
          className="font-display text-base font-bold tracking-tightest text-ink"
        >
          AB<span className="text-gold">.</span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              data-magnetic
              onClick={() => go(l.id)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </button>
          ))}
          <button
            data-magnetic
            onClick={() => go('contact')}
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-bg transition-transform duration-200 hover:bg-gold-soft active:scale-[0.97]"
          >
            Contact
          </button>
        </div>

        {/* Mobile trigger */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:hidden"
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="shell md:hidden"
          >
            <div className="glass mt-2 flex flex-col gap-1 rounded-card p-3">
              {[...links, { id: 'contact', label: 'Contact' }].map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="rounded-xl px-4 py-3 text-left text-lg text-ink transition-colors hover:bg-surface-2"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
