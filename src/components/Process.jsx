import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';

const STEPS = ['brief', 'direction', 'build', 'launch'];

function Step({ step, index, t }) {
  const reveal = useReveal();
  return (
    <li ref={reveal} data-reveal style={{ '--i': index }} className="relative">
      {/* The list is an <ol>, so the order is already announced; the figure
          is for the eye only. */}
      <span aria-hidden="true" className="block font-mono text-sm tabular-nums text-gold">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight text-ink">
        {t(`process.${step}.title`)}
      </h3>
      <p className="mt-3 max-w-[34ch] text-pretty leading-relaxed text-muted">
        {t(`process.${step}.body`)}
      </p>
    </li>
  );
}

export default function Process() {
  const { t } = useLang();
  const reveal = useReveal();

  return (
    <section aria-labelledby="process-title" className="relative py-28 md:py-36">
      <div className="shell">
        <h2
          ref={reveal}
          data-reveal
          id="process-title"
          className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-ink"
        >
          {t('process.title')}
        </h2>

        <div className="relative mt-16 md:mt-20">
          {/* The rail draws itself as the row scrolls into view (CSS view
              timeline). It runs between the step figures and the titles on
              wide screens. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[2.6rem] hidden h-px bg-line lg:block"
          >
            <div className="process-line h-full w-full bg-gold-line" />
          </div>
          <ol className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((step, i) => (
              <Step key={step} step={step} index={i} t={t} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
