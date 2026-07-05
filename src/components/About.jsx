import { m, useReducedMotion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp.js';
import SectionHeading from './SectionHeading.jsx';
import { useLang } from '../i18n/LanguageProvider.jsx';

function StatNumber({ value, suffix = '' }) {
  const { ref, count } = useCountUp(value);
  return (
    <span ref={ref} className="font-display text-5xl font-bold tracking-tightest text-ink md:text-6xl">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const reduce = useReducedMotion();
  const { t } = useLang();

  const stats = [
    { kind: 'num', value: 8, label: t('about.stat.projects') },
    { kind: 'num', value: 6, label: t('about.stat.niches') },
    { kind: 'text', value: t('about.stat.bilingualValue'), label: t('about.stat.bilingual') },
  ];

  return (
    <section id="about" className="cv-auto relative scroll-mt-24 py-28 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow={t('about.eyebrow')}
            title={t('about.title')}
            underline
          />
          <m.p
            initial={{ opacity: 0, y: reduce ? 0 : 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-[60ch] text-pretty text-lg leading-relaxed text-muted md:text-xl"
          >
            {t('about.body')}
          </m.p>
        </div>

        {/* Stats — plain layout, no boxed cards (density stays low) */}
        <div className="lg:col-span-5 lg:ps-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-1 lg:divide-y lg:divide-line">
            {stats.map((s, i) => (
              <m.div
                key={s.label}
                initial={{ opacity: 0, y: reduce ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="lg:py-7 lg:first:pt-0"
              >
                {s.kind === 'num' ? (
                  <StatNumber value={s.value} />
                ) : (
                  <span className="font-display text-5xl font-bold tracking-tightest text-gold md:text-6xl">
                    {s.value}
                  </span>
                )}
                <p className="mt-2 text-sm text-faint">{s.label}</p>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
