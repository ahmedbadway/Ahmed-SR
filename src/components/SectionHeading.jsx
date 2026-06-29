import { motion, useReducedMotion } from 'framer-motion';

// Shared section heading. Eyebrow is optional and used sparingly across the
// page (taste-skill: max ~1 per 3 sections), so it is off by default.
// `underline` draws a gold rule left-to-right as the title scrolls in.
export default function SectionHeading({ eyebrow, title, lead, align = 'left', underline = false }) {
  const reduce = useReducedMotion();
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[18ch] font-display text-4xl font-bold leading-[1.02] tracking-tightest text-ink md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>
      {underline ? (
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="h-[3px] w-24 origin-left rounded-full bg-gradient-to-r from-gold to-gold-soft"
        />
      ) : null}
      {lead ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[58ch] text-base leading-relaxed text-muted md:text-lg"
        >
          {lead}
        </motion.p>
      ) : null}
    </div>
  );
}
