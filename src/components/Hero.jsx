import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import Magnetic from './Magnetic.jsx';
import Typewriter from './Typewriter.jsx';
import { scrollToId } from '../utils/scrollToId.js';

const NAME = 'AHMED BADWAY';

// Per-character reveal for the name (0.05s stagger). Reduced-motion visitors
// get a single soft fade with no vertical travel — see `charVariant` below.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
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

// Deterministic-ish particle field (avoids layout cost of many state updates).
const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: (i * 61.8) % 100,
  top: (i * 37.5) % 100,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.9,
  duration: 6 + (i % 5),
}));

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const char = reduce ? charReduced : charMotion;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24"
    >
      {/* Floating particles */}
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute animate-float rounded-full bg-gold/40"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <motion.div style={{ y: yContent, opacity }} className="shell relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="eyebrow"
        >
          Frontend Developer · Mansoura, Egypt
        </motion.span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={NAME}
          className="mt-6 font-display text-[clamp(2.75rem,11vw,9.5rem)] font-extrabold leading-[0.92] tracking-tightest text-ink"
        >
          {NAME.split(' ').map((word, wi) => (
            <span key={wi} className="mr-[0.18em] inline-block whitespace-nowrap">
              {word.split('').map((c, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <motion.span variants={char} className="inline-block">
                    {c}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-[46ch] font-mono text-sm text-muted sm:text-base md:text-lg"
        >
          Frontend Developer{' '}
          <span className="text-faint">&mdash;</span>{' '}
          <Typewriter words={['React', 'Framer Motion', 'AI-Powered Visuals']} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <button
              onClick={() => scrollToId('projects')}
              className="group flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-bg transition-colors duration-200 hover:bg-gold-soft active:scale-[0.98]"
            >
              View Work
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
              Contact
              <ArrowUpRight
                size={18}
                weight="bold"
                className="text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-x-0 bottom-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-faint"
          >
            <span className="text-[0.7rem] uppercase tracking-[0.2em]">Scroll</span>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
