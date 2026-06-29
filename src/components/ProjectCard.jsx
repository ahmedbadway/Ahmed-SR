import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function ProjectCard({ project, index }) {
  const [from, to] = project.gradient;
  // Real live-site screenshot. Falls back to the gradient + monogram cover if
  // the file isn't present yet (added to public/projects/<slug>.jpg).
  const [imgOk, setImgOk] = useState(Boolean(project.image));
  const imgSrc = project.image
    ? `${import.meta.env.BASE_URL}projects/${project.image}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group glass flex flex-col overflow-hidden rounded-card"
    >
      {/* Visual cover (gradient + monogram placeholder) */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {/* Faint grid texture for depth */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.6) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(120% 90% at 30% 20%, black, transparent 75%)',
            }}
          />
          <span className="absolute bottom-3 right-5 font-display text-[5.5rem] font-extrabold leading-none tracking-tightest text-ink/15">
            {initials(project.name)}
          </span>
        </div>

        {/* Real screenshot layered over the gradient fallback */}
        {imgSrc && imgOk ? (
          <img
            src={imgSrc}
            alt={`${project.name} — ${project.type} website by Ahmed Badway`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : null}

        {/* Type tag */}
        <span className="absolute left-4 top-4 rounded-full bg-bg/55 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
          {project.type}
        </span>

        {/* Top gradient scrim for tag legibility */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg/40 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold tracking-tightest text-ink">
          {project.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-faint"
            >
              {t}
            </li>
          ))}
        </ul>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-bg"
        >
          Live Site
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </a>
      </div>
    </motion.article>
  );
}
