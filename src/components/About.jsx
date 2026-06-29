import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp.js';
import SectionHeading from './SectionHeading.jsx';

function StatNumber({ value, suffix = '' }) {
  const { ref, value: n } = useCountUp(value);
  return (
    <span ref={ref} className="font-display text-5xl font-bold tracking-tightest text-ink md:text-6xl">
      {n}
      {suffix}
    </span>
  );
}

const stats = [
  { kind: 'num', value: 8, label: 'Projects shipped' },
  { kind: 'num', value: 6, label: 'Industry niches' },
  { kind: 'text', value: 'AR · EN', label: 'Bilingual delivery' },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="About"
            title="Premium work, without the agency price tag."
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-[60ch] text-lg leading-relaxed text-muted md:text-xl"
          >
            I build premium websites for luxury brands, clinics, and e-commerce
            stores. Clean React code meets AI-generated visuals and cinematic
            animations — results that look expensive without the agency price tag.
          </motion.p>
        </div>

        {/* Stats — plain layout, no boxed cards (density stays low) */}
        <div className="lg:col-span-5 lg:pl-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-1 lg:divide-y lg:divide-line">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:py-7 lg:first:pt-0"
              >
                {s.kind === 'num' ? (
                  <StatNumber value={s.value} />
                ) : (
                  <span className="font-display text-5xl font-bold tracking-tightest text-gradient-gold md:text-6xl">
                    {s.value}
                  </span>
                )}
                <p className="mt-2 text-sm text-faint">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
