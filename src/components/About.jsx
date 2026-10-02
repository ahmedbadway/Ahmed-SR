import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { projects } from '../data/projects.js';

// Plain facts instead of headline stats: a buyer learns more from "which
// industries" than from a count of them.
const FACTS = ['sites', 'industries', 'languages', 'stack'];

export default function About() {
  const { t } = useLang();
  const factsReveal = useReveal();

  // Each word lights up as the paragraph scrolls through the viewport (CSS
  // view timeline). Words stay whole, so Arabic letter joining is preserved.
  const words = t('about.body').split(' ');

  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <h2 id="about-title" className="eyebrow">
          {t('about.title')}
        </h2>
        <p className="mt-8 max-w-[30ch] font-display text-[clamp(1.6rem,3.1vw,2.75rem)] font-medium leading-[1.25] tracking-tight text-ink">
          {words.map((w, i) => (
            <span key={i} className="scrub-word">
              {w}{' '}
            </span>
          ))}
        </p>

        {/* Offset to the end edge so the facts read as a margin note to the
            paragraph, not as a stats band. */}
        <div ref={factsReveal} data-reveal className="mt-20 md:mt-28 lg:ms-auto lg:w-[min(100%,54rem)]">
          <h3 className="sr-only">{t('about.facts')}</h3>
          <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {FACTS.map((key) => (
              <div key={key} className="border-t border-line pt-5">
                <dt className="font-mono text-[0.8rem] text-gold">{t(`about.fact.${key}.label`)}</dt>
                <dd className="mt-3 max-w-[36ch] text-pretty text-lg leading-snug text-ink">
                  {t(`about.fact.${key}.value`).replace('{count}', projects.length)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
