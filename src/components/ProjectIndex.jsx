import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { projects, CATEGORIES, coverSmall } from '../data/projects.js';

const FILTERS = ['all', ...CATEGORIES];

// Floating preview size (16:10, the covers' own ratio) and its distance from
// the pointer, in px.
const PREVIEW_W = 336;
const PREVIEW_H = 210;
const GAP = 28;
const EDGE = 16;

function countFor(filter) {
  return filter === 'all' ? projects.length : projects.filter((p) => p.category === filter).length;
}

// Where the preview's top-left corner goes for a pointer at (x, y): beside the
// pointer, flipped to the other side near the viewport edge, never off-screen.
function placeBeside(x, y) {
  const fitsAfter = x + GAP + PREVIEW_W <= window.innerWidth - EDGE;
  const left = fitsAfter ? x + GAP : x - GAP - PREVIEW_W;
  const top = Math.min(Math.max(y - PREVIEW_H / 2, EDGE), window.innerHeight - PREVIEW_H - EDGE);
  return { left: Math.max(left, EDGE), top };
}

// Hover preview for the project index, adapted from the 21st.dev "Project
// Index" pattern (ssychui): hovering a row floats its cover beside the pointer
// and dims the other rows; focusing a row from the keyboard shows the cover
// above it. No animation library: the preview is position: fixed and its
// transform is written straight to the element from a rAF loop that stops as
// soon as it settles, so an idle list costs nothing per frame. Only mounted on
// hover-capable pointers; touch devices get inline thumbnails instead.
function useFloatingPreview() {
  const previewRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(null);
  const motion = useRef({ tx: 0, ty: 0, x: 0, y: 0, raf: 0, shown: false, reduce: false });

  useEffect(() => {
    const m = motion.current;
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    m.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => cancelAnimationFrame(m.raf);
  }, []);

  const paint = useCallback(() => {
    const m = motion.current;
    if (previewRef.current) {
      previewRef.current.style.transform = `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0)`;
    }
  }, []);

  const tick = useCallback(() => {
    const m = motion.current;
    m.x += (m.tx - m.x) * 0.2;
    m.y += (m.ty - m.y) * 0.2;
    paint();
    const settled = Math.abs(m.tx - m.x) < 0.1 && Math.abs(m.ty - m.y) < 0.1;
    m.raf = settled ? 0 : requestAnimationFrame(tick);
  }, [paint]);

  const moveTo = useCallback(
    ({ left, top }, snap) => {
      const m = motion.current;
      m.tx = left;
      m.ty = top;
      if (snap || m.reduce) {
        cancelAnimationFrame(m.raf);
        m.raf = 0;
        m.x = left;
        m.y = top;
        paint();
        return;
      }
      if (!m.raf) m.raf = requestAnimationFrame(tick);
    },
    [paint, tick]
  );

  const listHandlers = {
    onPointerEnter: () => setArmed(true),
    onPointerMove: (e) => {
      if (motion.current.shown) moveTo(placeBeside(e.clientX, e.clientY), false);
    },
    onPointerLeave: () => {
      motion.current.shown = false;
      setActive(null);
    },
  };

  const rowHandlers = (id) => ({
    onPointerEnter: (e) => {
      setActive(id);
      // The first row entered places the preview at once; after that it
      // trails the pointer.
      if (!motion.current.shown) {
        motion.current.shown = true;
        moveTo(placeBeside(e.clientX, e.clientY), true);
      }
    },
    onFocus: (e) => {
      if (!enabled || !e.currentTarget.matches(':focus-visible')) return;
      setArmed(true);
      setActive(id);
      const row = e.currentTarget.getBoundingClientRect();
      const rtl = document.documentElement.dir === 'rtl';
      const left = rtl ? row.left + EDGE : row.right - PREVIEW_W - EDGE;
      const above = row.top - PREVIEW_H - 12;
      moveTo({ left, top: above > EDGE ? above : row.bottom + 12 }, true);
    },
    onBlur: () => {
      if (!motion.current.shown) setActive(null);
    },
  });

  return { previewRef, enabled, armed, active, listHandlers, rowHandlers };
}

function IndexRow({ project, isAr, categoryLabel, visitLabel, handlers }) {
  const type = isAr ? project.type_ar : project.type;

  return (
    <li style={{ viewTransitionName: `index-${project.id}` }}>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name}, ${type}. ${visitLabel}`}
        {...handlers}
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 border-t border-line py-4 transition-opacity duration-200 ease-out can-hover:group-hover/index:opacity-35 can-hover:hover:!opacity-100 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,10rem)_auto] md:gap-x-8 md:py-7"
      >
        <img
          src={coverSmall(project.image)}
          width="800"
          height="500"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-12 w-[4.8rem] rounded-[10px] object-cover object-top ring-1 ring-line md:hidden"
        />
        <div className="min-w-0 md:contents">
          <h4 className="text-balance font-display md:truncate text-[clamp(1.2rem,2.3vw,2rem)] font-medium leading-tight tracking-tight text-ink">
            {project.name}
          </h4>
          <p className="mt-1 truncate text-sm text-muted md:mt-0 md:text-base">{type}</p>
        </div>
        <p className="hidden truncate font-mono text-xs text-faint md:block">{categoryLabel}</p>
        <span
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-200 can-hover:group-hover:border-gold can-hover:group-hover:bg-gold can-hover:group-hover:text-bg"
        >
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-transform duration-300 ease-out rtl:-scale-x-100 can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:translate-x-0.5 can-hover:rtl:group-hover:-translate-x-0.5"
          />
        </span>
      </a>
    </li>
  );
}

export default function ProjectIndex() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState('all');
  const headerReveal = useReveal();
  const { previewRef, enabled, armed, active, listHandlers, rowHandlers } = useFloatingPreview();

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  // View Transitions morph each row from its old slot to its new one.
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
    <div className="mt-28 md:mt-40">
      <div ref={headerReveal} data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="font-display text-[clamp(1.75rem,3vw,2.6rem)] font-semibold leading-tight tracking-display text-ink">
            {t('work.index')}
          </h3>
          <p className="mt-3 max-w-[44ch] text-pretty leading-relaxed text-muted">{t('work.index.lead')}</p>
        </div>

        <div role="group" aria-label={t('work.filter')} className="-mx-1 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] ${
                  on
                    ? 'border-gold bg-gold-wash text-gold'
                    : 'border-line text-muted can-hover:hover:border-line-strong can-hover:hover:text-ink'
                }`}
              >
                {t(`work.filter.${f}`)}
                <span className={`font-mono text-xs tabular-nums ${on ? 'text-gold' : 'text-faint'}`}>
                  {countFor(f)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul data-index className="group/index mt-10 border-b border-line md:mt-12" {...listHandlers}>
        {visible.map((project) => (
          <IndexRow
            key={project.id}
            project={project}
            isAr={isAr}
            categoryLabel={t(`work.filter.${project.category}`)}
            visitLabel={t('work.visit')}
            handlers={rowHandlers(project.id)}
          />
        ))}
      </ul>

      {enabled ? (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 will-change-transform"
          style={{ width: PREVIEW_W, height: PREVIEW_H, zIndex: 'var(--z-content)' }}
        >
          <div
            className={`relative h-full w-full overflow-hidden rounded-card bg-surface shadow-[0_30px_70px_-30px_var(--shadow-deep)] ring-1 ring-line-strong transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-opacity ${
              active ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0'
            }`}
          >
            {/* Covers mount on the first hover, then cross-fade. */}
            {armed
              ? projects.map((p) => (
                  <img
                    key={p.id}
                    src={coverSmall(p.image)}
                    width="800"
                    height="500"
                    alt=""
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200 ${
                      active === p.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
