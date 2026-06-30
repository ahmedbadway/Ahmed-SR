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

// Gradient + monogram cover with the real screenshot layered on top.
function Screenshot({ project, imgOk, onError }) {
  const [from, to] = project.gradient;
  const imgSrc = project.image
    ? `${import.meta.env.BASE_URL}projects/${project.image}`
    : null;

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
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

      {imgSrc && imgOk ? (
        <img
          src={imgSrc}
          alt={`${project.name} — ${project.type} website by Ahmed Badway`}
          loading="lazy"
          decoding="async"
          onError={onError}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : null}
    </>
  );
}

// Name / type / description / tech / CTA — shared by the flip back face and
// the stacked (mobile / reduced-motion) layout.
function Details({ project, fill = false }) {
  return (
    <div className={`flex flex-col ${fill ? 'h-full' : ''}`}>
      <span className="w-fit rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
        {project.type}
      </span>
      <h3 className="mt-4 font-display text-xl font-bold tracking-tightest text-ink">
        {project.name}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed text-muted ${fill ? 'flex-1' : ''}`}>
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
        className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-bg"
      >
        Live Site
        <ArrowUpRight
          size={16}
          weight="bold"
          className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      </a>
    </div>
  );
}

export default function ProjectCard({ project }) {
  const [imgOk, setImgOk] = useState(Boolean(project.image));
  const reduce = useReducedMotion();
  const onError = () => setImgOk(false);

  // Child of the Projects stagger container — bold rise on entrance.
  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Flip needs a hover-capable pointer; reduced-motion visitors get the
  // stacked card instead of a spinning one.
  const canHover = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches,
    []
  );
  const useFlip = canHover && !reduce;

  if (!useFlip) {
    // Stacked card — screenshot on top, details below. Always visible.
    return (
      <motion.article
        variants={reveal}
        className="glass flex flex-col overflow-hidden rounded-card"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Screenshot project={project} imgOk={imgOk} onError={onError} />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg/40 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Details project={project} />
        </div>
      </motion.article>
    );
  }

  // 3D flip card (desktop). Hovering rotates the inner panel 180° to reveal
  // a gold-glowing back face with the full project details.
  return (
    <motion.article variants={reveal} className="h-[440px] [perspective:1600px]">
      <div className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
        {/* FRONT — screenshot */}
        <div className="glass absolute inset-0 overflow-hidden rounded-card [backface-visibility:hidden]">
          <Screenshot project={project} imgOk={imgOk} onError={onError} />
          {/* Bottom scrim with name so the front isn't anonymous */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent p-5 pt-14">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
                {project.type}
              </span>
              <h3 className="mt-1 font-display text-lg font-bold tracking-tightest text-ink">
                {project.name}
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-line bg-bg/50 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint backdrop-blur-sm">
              Hover
            </span>
          </div>
        </div>

        {/* BACK — details, gold border glow */}
        <div className="glass absolute inset-0 rounded-card border border-gold/55 p-7 shadow-[0_0_44px_-6px_rgba(var(--gold-rgb),0.45),inset_0_0_0_1px_rgba(var(--gold-rgb),0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Details project={project} fill />
        </div>
      </div>
    </motion.article>
  );
}
