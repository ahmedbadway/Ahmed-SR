import { useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import Magnetic from './Magnetic.jsx';
import Typewriter from './Typewriter.jsx';
import { scrollToId } from '../utils/scrollToId.js';
import { navigate } from '../hooks/useHashRoute.js';
import { useLang } from '../i18n/LanguageProvider.jsx';

// Per-character reveal for the name (0.08s stagger). Reduced-motion visitors
// get a single soft fade with no vertical travel — see `charReduced` below.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const charMotion = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};
const charReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const char = reduce ? charReduced : charMotion;

  const name = t('hero.name');

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24"
    >
      {/* Bold gold orb drifting behind the name. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`h-[min(900px,100vw)] w-[min(900px,100vw)] rounded-full ${
            reduce ? '' : 'animate-orb-drift'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(var(--gold-soft-rgb), 0.85) 0%, rgba(var(--gold-soft-rgb), 0.55) 24%, rgba(var(--gold-rgb), 0.32) 46%, rgba(var(--gold-rgb), 0.12) 62%, transparent 76%)',
            filter: 'blur(28px)',
            willChange: 'transform',
          }}
        />
      </div>

      <m.div style={{ y: yContent, opacity }} className="shell relative z-10">
        <m.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="eyebrow"
        >
          {t('hero.eyebrow')}
        </m.span>

        <m.h1
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={name}
          className="mt-6 font-display text-[clamp(2.75rem,11vw,9.5rem)] font-extrabold leading-[0.92] tracking-tightest text-ink"
        >
          {name.split(' ').map((word, wi) => (
            <span key={wi} className="me-[0.18em] inline-block whitespace-nowrap">
              {isAr ? (
                // Arabic letters connect — animate the whole word as one unit so
                // ligatures are preserved (per-character would isolate each form).
                <span className="inline-block overflow-hidden align-bottom">
                  <m.span variants={char} className="inline-block">
                    {word}
                  </m.span>
                </span>
              ) : (
                word.split('').map((c, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <m.span variants={char} className="inline-block">
                      {c}
                    </m.span>
                  </span>
                ))
              )}
            </span>
          ))}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-[52ch] font-mono text-sm text-muted sm:text-base md:text-lg"
        >
          {t('hero.leadPrefix')}{' '}
          <Typewriter words={t('hero.words')} />
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <button
              onClick={() => scrollToId('projects')}
              className="group flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-bg transition-colors duration-200 hover:bg-gold-soft active:scale-[0.98]"
            >
              {t('hero.viewWork')}
              <ArrowDown
                size={18}
                weight="bold"
                className="transition-transform group-hover:translate-y-0.5"
              />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToId('contact')}
              className="group flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-semibold text-ink transition-colors duration-200 hover:border-gold active:scale-[0.98]"
            >
              {t('hero.contact')}
              <ArrowUpRight
                size={18}
                weight="bold"
                className="text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
              />
            </button>
          </Magnetic>

          <button
            onClick={() => navigate('/build')}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-gold"
          >
            {t('hero.orBuild')}
            <ArrowUpRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
            />
          </button>
        </m.div>
      </m.div>

      {/* Scroll cue */}
      {!reduce && (
        <m.div
          style={{ opacity }}
          className="absolute inset-x-0 bottom-8 flex justify-center"
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-faint"
          >
            <span className="text-[0.7rem] uppercase tracking-[0.2em]">
              {t('hero.scroll')}
            </span>
            <ArrowDown size={16} />
          </m.div>
        </m.div>
      )}
    </section>
  );
}
