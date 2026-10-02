import { ArrowUpRight } from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { projects, FEATURED_IDS, coverSrc, coverSrcSet } from '../data/projects.js';
import ProjectIndex from './ProjectIndex.jsx';

const featured = FEATURED_IDS.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

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
  const headerReveal = useReveal();

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <div ref={headerReveal} data-reveal>
          <h2
            id="work-title"
            className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-ink"
          >
            {t('work.title')}
          </h2>
          <p className="mt-5 max-w-[48ch] text-pretty text-lg leading-relaxed text-muted">{t('work.lead')}</p>
        </div>

        <ul data-featured className="mt-16 grid gap-x-10 gap-y-20 md:mt-20 md:grid-cols-2 md:pb-28 lg:gap-x-14">
          {featured.map((project, i) => (
            <WorkCard
              key={project.id}
              project={project}
              index={i}
              isAr={isAr}
              visitLabel={t('work.visit')}
            />
          ))}
        </ul>

        <ProjectIndex />
      </div>
    </section>
  );
}
