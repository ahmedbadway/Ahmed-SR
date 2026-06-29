import { motion } from 'framer-motion';

// Shared section heading. Eyebrow is optional and used sparingly across the
// page (taste-skill: max ~1 per 3 sections), so it is off by default.
export default function SectionHeading({ eyebrow, title, lead, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[18ch] font-display text-4xl font-bold leading-[1.02] tracking-tightest text-ink md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>
      {lead ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[58ch] text-base leading-relaxed text-muted md:text-lg"
        >
          {lead}
        </motion.p>
      ) : null}
    </div>
  );
}
