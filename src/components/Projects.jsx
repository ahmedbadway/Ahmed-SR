import { m } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import ProjectCard from './ProjectCard.jsx';
import { projects } from '../data/projects.js';
import { useLang } from '../i18n/LanguageProvider.jsx';

// Parent orchestrates a 0.1s stagger so cards enter one after the next.
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function Projects() {
  const { t } = useLang();
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

        <m.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </m.div>
      </div>
    </section>
  );
}
