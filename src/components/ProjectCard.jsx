import { useRef, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';

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
function Screenshot({ project, label, imgOk, onError }) {
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
        <span className="absolute bottom-3 end-5 font-display text-[5.5rem] font-extrabold leading-none tracking-tightest text-ink/15">
          {initials(project.name)}
        </span>
      </div>

      {imgSrc && imgOk ? (
        <img
          src={imgSrc}
          alt={`${project.name} — ${label} website by Ahmed Badway`}
          loading="lazy"
          decoding="async"
          onError={onError}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : null}
    </>
  );
}

// Name / type / description / tech / CTA — shared by the flip back face and the
// stacked (reduced-motion) layout.
function Details({ project, type, description, live, fill = false }) {
  return (
    <div className={`flex flex-col ${fill ? 'h-full' : ''}`}>
      <span className="w-fit rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
        {type}
      </span>
      <h3 className="mt-4 font-display text-xl font-bold tracking-tightest text-ink">
        {project.name}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed text-muted ${fill ? 'flex-1' : ''}`}>
        {description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-faint"
          >
            {tech}
          </li>
        ))}
      </ul>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-magnetic
        onClick={(e) => e.stopPropagation()}
        className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold transition-colors duration-200 hover:bg-gold hover:text-bg"
      >
        {live}
        <ArrowUpRight
          size={16}
          weight="bold"
          className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100"
        />
      </a>
    </div>
  );
}

export default function ProjectCard({ project }) {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const type = isAr ? project.type_ar : project.type;
  const description = isAr ? project.description_ar : project.description;
  const live = t('projects.live');

  const [imgOk, setImgOk] = useState(Boolean(project.image));
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef('mouse');
  const reduce = useReducedMotion();
  const onError = () => setImgOk(false);

  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const useFlip = !reduce;

  if (!useFlip) {
    return (
      <m.article
        variants={reveal}
        className="glass flex flex-col overflow-hidden rounded-card"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Screenshot project={project} label={type} imgOk={imgOk} onError={onError} />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg/40 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <Details project={project} type={type} description={description} live={live} />
        </div>
      </m.article>
    );
  }

  // Flip triggers are pointer-type aware (a hover media query is unreliable
  // across engines): a mouse flips on enter/leave, a touch flips on tap. The
  // lastPointer ref stops a mouse click from cancelling the hover flip and a
  // tap's synthetic mouseenter from fighting the tap toggle.
  const flipHandlers = {
    onPointerDown: (e) => {
      lastPointer.current = e.pointerType;
    },
    onPointerEnter: (e) => {
      if (e.pointerType === 'mouse') setFlipped(true);
    },
    onPointerLeave: (e) => {
      if (e.pointerType === 'mouse') setFlipped(false);
    },
    onClick: () => {
      if (lastPointer.current !== 'mouse') setFlipped((f) => !f);
    },
  };

  // backdrop-filter would collapse preserve-3d, so inline the glass look here.
  const faceBase = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 0.08), 0 24px 60px -32px oklch(0 0 0 / 0.8)',
  };

  return (
    <m.article variants={reveal} style={{ height: '440px', perspective: '1000px' }}>
      {/* CSS transition on transform (compositor), not a Framer rAF loop. */}
      <div
        {...flipHandlers}
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-in-out',
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      >
        {/* FRONT — screenshot */}
        <div style={{ ...faceBase, overflow: 'hidden' }}>
          <Screenshot project={project} label={type} imgOk={imgOk} onError={onError} />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent p-5 pt-14">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">
                {type}
              </span>
              <h3 className="mt-1 font-display text-lg font-bold tracking-tightest text-ink">
                {project.name}
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-line bg-bg/50 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              {t('projects.tap')}
            </span>
          </div>
        </div>

        {/* BACK — details, gold border glow */}
        <div
          style={{
            ...faceBase,
            transform: 'rotateY(180deg)',
            border: '1px solid rgba(var(--gold-rgb), 0.55)',
            boxShadow:
              '0 0 44px -6px rgba(var(--gold-rgb), 0.45), inset 0 0 0 1px rgba(var(--gold-rgb), 0.25), inset 0 1px 0 oklch(1 0 0 / 0.08)',
            padding: '1.75rem',
          }}
        >
          <Details project={project} type={type} description={description} live={live} fill />
        </div>
      </div>
    </m.article>
  );
}
