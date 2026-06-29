import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

export default function ProjectCard({ project }) {
  const [from, to] = project.gradient;
  // Real live-site screenshot. Falls back to the gradient + monogram cover if
  // the file isn't present yet (added to public/projects/<slug>.jpg).
  const [imgOk, setImgOk] = useState(Boolean(project.image));
  const reduce = useReducedMotion();
  const imgSrc = project.image
    ? `${import.meta.env.BASE_URL}projects/${project.image}`
    : null;

  // Child of the Projects stagger container — parent controls the 0.1s delay.
  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Lift is a framer transform (inline style would override CSS hover), so
  // only arm it on true hover-capable, motion-allowed devices.
  const canHover = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches,
    []
  );

  return (
    <motion.article
      variants={reveal}
      whileHover={canHover && !reduce ? { y: -10 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group glass relative flex flex-col overflow-hidden rounded-card transition-[border-color,box-shadow] duration-300 ease-out [@media(hover:hover)]:hover:border-gold/50 [@media(hover:hover)]:hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(var(--gold-rgb),0.30)]"
    >
      {/* Visual cover (gradient + monogram placeholder) */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:[@media(hover:hover)]:group-hover:-translate-y-[8%] motion-safe:[@media(hover:hover)]:group-hover:scale-110"
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

        {/* Real screenshot layered over the gradient fallback. On hover it
            slowly scrolls upward (parallax) — any sliver below reveals the
            on-brand gradient, never a blank edge. */}
        {imgSrc && imgOk ? (
          <img
            src={imgSrc}
            alt={`${project.name} — ${project.type} website by Ahmed Badway`}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out motion-safe:[@media(hover:hover)]:group-hover:-translate-y-[8%] motion-safe:[@media(hover:hover)]:group-hover:scale-110"
          />
        ) : null}

        {/* Type tag */}
        <span className="absolute left-4 top-4 z-10 rounded-full bg-bg/55 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
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

        {/* Live Site fades up from the bottom on hover (desktop). On touch
            devices it stays visible — no hover to trigger it. */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-[opacity,transform,color,background-color] duration-300 ease-out hover:bg-gold hover:text-bg motion-safe:[@media(hover:hover)]:translate-y-2 motion-safe:[@media(hover:hover)]:opacity-0 motion-safe:[@media(hover:hover)]:group-hover:translate-y-0 motion-safe:[@media(hover:hover)]:group-hover:opacity-100"
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
