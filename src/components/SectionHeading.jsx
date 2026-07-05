import { m, useReducedMotion } from 'framer-motion';
import { useLang } from '../i18n/LanguageProvider.jsx';

// Shared section heading. Eyebrow is optional and used sparingly across the
// page (taste-skill: not on every section), so it is off by default.
// `underline` draws a gold rule that scans in from the inline-start as the
// title scrolls in. `slide="left"` makes the title fly in horizontally; the
// direction is mirrored under RTL so it always enters from the inline-start.
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  underline = false,
  slide,
}) {
  const reduce = useReducedMotion();
  const { dir } = useLang();
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-start';
  const sign = dir === 'rtl' ? 1 : -1;

  const from = reduce
    ? { opacity: 0 }
    : slide === 'left'
      ? { opacity: 0, x: 80 * sign }
      : { opacity: 0, y: 60 };
  const to = { opacity: 1, x: 0, y: 0 };

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <m.h2
        initial={from}
        whileInView={to}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.02] tracking-tightest text-ink md:text-5xl lg:text-6xl"
      >
        {title}
      </m.h2>
      {underline ? (
        <m.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-[3px] w-24 origin-[left_center] rounded-full bg-gradient-to-r from-gold to-gold-soft rtl:origin-[right_center]"
        />
      ) : null}
      {lead ? (
        <m.p
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[58ch] text-pretty text-base leading-relaxed text-muted md:text-lg"
        >
          {lead}
        </m.p>
      ) : null}
    </div>
  );
}
