import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import SectionHeading from './SectionHeading.jsx';
import CardFanCarousel from './CardFanCarousel.jsx';
import { projects } from '../data/projects.js';
import { useLang } from '../i18n/LanguageProvider.jsx';

const DEFAULT_INDEX = projects.length > 7 ? 3 : projects.length >> 1;

export default function Projects() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);
  const active = projects[activeIndex];

  const cards = projects.map((project) => ({
    imgUrl: project.image ? `${import.meta.env.BASE_URL}projects/${project.image}` : '',
    alt: `${project.name} — ${isAr ? project.type_ar : project.type} website by Ahmed Badway`,
    linkUrl: project.url,
  }));

  return (
    <section id="projects" className="cv-auto relative scroll-mt-24 py-28 md:py-36">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t('projects.eyebrow')}
            title={t('projects.title')}
            slide="left"
          />
          <p className="max-w-[34ch] text-pretty text-sm text-faint md:text-end">
            {t('projects.intro')}
          </p>
        </div>

        <div className="mt-14">
          <CardFanCarousel
            cards={cards}
            initialIndex={DEFAULT_INDEX}
            onCenterChange={setActiveIndex}
          />
        </div>

        {/* Details panel for the currently centered project. Crossfades on
            every fan navigation instead of living inside each card, since the
            fan only carries images. */}
        <AnimatePresence mode="wait">
          <m.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass mx-auto mt-10 flex max-w-xl flex-col items-center rounded-card p-8 text-center"
          >
            <span className="w-fit rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
              {isAr ? active.type_ar : active.type}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tightest text-ink">
              {active.name}
            </h3>
            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
              {isAr ? active.description_ar : active.description}
            </p>

            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {active.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-faint"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-bg"
            >
              {t('projects.live')}
              <ArrowUpRight
                size={16}
                weight="bold"
                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100"
              />
            </a>
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
