import { useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { projects, CATEGORIES, coverSrc, coverSrcSet } from '../data/projects.js';

const FILTERS = ['all', ...CATEGORIES];

function countFor(filter) {
  return filter === 'all' ? projects.length : projects.filter((p) => p.category === filter).length;
}

function WorkCard({ project, index, isAr, visitLabel }) {
  const reveal = useReveal();
  const description = isAr ? project.description_ar : project.description;
  const type = isAr ? project.type_ar : project.type;

  return (
    <li
      // Every second card sits lower on desktop: an editorial offset instead
      // of a rigid grid. The offset lives on the <li> and the reveal on the
      // link inside, so the two transforms never fight.
      className="md:even:translate-y-28"
      style={{ viewTransitionName: `work-${project.id}` }}
    >
      <a
        ref={reveal}
        data-reveal
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name}, ${type}. ${visitLabel}`}
        className="group block"
        style={{ '--i': index % 2 }}
      >
        <div className="relative overflow-hidden rounded-card bg-surface ring-1 ring-line">
          <img
            src={coverSrc(project.image)}
            srcSet={coverSrcSet(project.image)}
            sizes="(min-width: 768px) 46vw, 100vw"
            width="1600"
            height="1000"
            loading="lazy"
            decoding="async"
            alt={`${project.name} website, home page`}
            className="block aspect-[16/10] h-auto w-full object-cover object-top transition-transform duration-700 ease-out can-hover:group-hover:scale-[1.035]"
          />
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-[1.75rem]">
              {project.name}
            </h3>
            <p className="mt-1.5 text-sm text-gold">{type}</p>
          </div>
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-200 can-hover:group-hover:border-gold can-hover:group-hover:bg-gold can-hover:group-hover:text-bg"
          >
            <ArrowUpRight
              size={17}
              weight="bold"
              className="transition-transform duration-300 ease-out rtl:-scale-x-100 can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:translate-x-0.5 can-hover:rtl:group-hover:-translate-x-0.5"
            />
          </span>
        </div>
        <p className="mt-3 max-w-[54ch] text-pretty text-[0.95rem] leading-relaxed text-muted">
          {description}
        </p>
        <p className="mt-3 font-mono text-xs text-faint rtl:text-right" dir="ltr">
          {project.tech.join(', ')}
        </p>
      </a>
    </li>
  );
}

export default function Work() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState('all');
  const headerReveal = useReveal();

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  // View Transitions morph each card from its old grid slot to its new one.
  // Browsers without the API (and reduced-motion visitors) switch instantly.
  const choose = (next) => {
    if (next === filter) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
      setFilter(next);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setFilter(next));
    });
  };

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <div ref={headerReveal} data-reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="work-title"
              className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-ink"
            >
              {t('work.title')}
            </h2>
            <p className="mt-5 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted">
              {t('work.lead')}
            </p>
          </div>

          <div
            role="group"
            aria-label={t('work.filter')}
            className="-mx-1 flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(f)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] ${
                    active
                      ? 'border-gold bg-gold-wash text-gold'
                      : 'border-line text-muted can-hover:hover:border-line-strong can-hover:hover:text-ink'
                  }`}
                >
                  {t(`work.filter.${f}`)}
                  <span className={`tabular-nums text-xs ${active ? 'text-gold' : 'text-faint'}`}>
                    {countFor(f)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-20 md:mt-20 md:grid-cols-2 md:pb-28 lg:gap-x-14">
          {visible.map((project, i) => (
            <WorkCard
              key={project.id}
              project={project}
              index={i}
              isAr={isAr}
              visitLabel={t('work.visit')}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
