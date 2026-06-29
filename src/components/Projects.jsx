import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import ProjectCard from './ProjectCard.jsx';
import { projects } from '../data/projects.js';

// Parent orchestrates a 0.1s stagger so cards enter one after the next
// rather than all at once. Children supply their own translate/fade.
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected Work"
            title="Eight builds across luxury, beauty, and health."
          />
          <p className="max-w-[34ch] text-sm text-faint md:text-right">
            Every site is custom — no templates. Tap any project to view it live.
          </p>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
