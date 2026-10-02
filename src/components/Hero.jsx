import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';
import { navigate } from '../hooks/useHashRoute.js';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { projects, coverSrc, coverSrcSet } from '../data/projects.js';

// Three real covers fanned behind the headline. Order: back, middle, front.
// `depth` is the parallax travel in px at the pointer's furthest reach.
const STACK = [
  {
    id: 'elo',
    frame: 'top-0 end-0 w-[70%]',
    tilt: 'rotate-[4deg]',
    depth: 10,
  },
  {
    id: 'amr-ziada',
    frame: 'top-[24%] start-0 w-[64%]',
    tilt: '-rotate-[3deg]',
    depth: 18,
  },
  {
    id: 'nefeera',
    frame: 'bottom-0 end-[8%] w-[60%]',
    tilt: 'rotate-[1.5deg]',
    depth: 30,
  },
];

// Headline words wrapped in *asterisks* in the translation render in gold.
function parseWords(text) {
  return text.split(' ').map((token) => {
    const match = token.match(/^\*(.+?)\*(.*)$/);
    return match ? { word: match[1], tail: match[2], accent: true } : { word: token, tail: '', accent: false };
  });
}

// Pointer parallax for the cover stack. Runs only on hover-capable pointers
// with motion allowed. Transforms are written straight to the layer elements
// (no React state, no CSS-variable cascade), and the rAF loop stops as soon
// as the layers settle, so an idle hero costs nothing per frame.
function useStackParallax(sectionRef, layerRefs) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = STACK[i].depth;
        el.style.transform = `translate3d(${(current.x * d).toFixed(2)}px, ${(current.y * d).toFixed(2)}px, 0)`;
      });
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Rect is read on enter only; reading it on every move would force layout.
    let rect = null;
    const onEnter = () => {
      rect = section.getBoundingClientRect();
    };
    const onMove = (e) => {
      if (!rect) rect = section.getBoundingClientRect();
      target.x = -((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      rect = null;
      target.x = 0;
      target.y = 0;
      kick();
    };

    section.addEventListener('pointerenter', onEnter);
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('pointerenter', onEnter);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, [sectionRef, layerRefs]);
}

export default function Hero() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const layerRefs = useRef([]);
  useStackParallax(sectionRef, layerRefs);

  const words = parseWords(t('hero.title'));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] items-center pb-16 pt-28 md:pt-32"
    >
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="eyebrow enter" style={{ '--d': 0 }}>
            {t('hero.kicker')}
          </p>

          <h1 className="mt-6 text-balance font-display text-[clamp(2.5rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-display text-ink">
            {words.map(({ word, tail, accent }, i) => (
              <span key={i}>
                <span className="word-mask">
                  <span className={`word ${accent ? 'text-gold' : ''}`} style={{ '--i': i }}>
                    {word}
                  </span>
                  {tail ? (
                    <span className="word" style={{ '--i': i }}>
                      {tail}
                    </span>
                  ) : null}
                </span>{' '}
              </span>
            ))}
          </h1>

          <p
            className="enter mt-7 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted md:text-xl"
            style={{ '--d': 520 }}
          >
            {t('hero.lead')}
          </p>

          <div className="enter mt-10 flex flex-wrap items-center gap-3" style={{ '--d': 640 }}>
            <button type="button" onClick={() => navigate('/build')} className="btn btn-primary">
              {t('hero.primary')}
              <ArrowUpRight size={17} weight="bold" className="rtl:-scale-x-100" />
            </button>
            <button type="button" onClick={() => scrollToId('work')} className="btn btn-ghost">
              {t('hero.secondary')}
              <ArrowDown size={17} weight="bold" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div
            role="img"
            aria-label={t('hero.visual')}
            className="relative mx-auto aspect-[1.08] w-full max-w-[560px]"
          >
            {STACK.map((layer, i) => {
              const project = projects.find((p) => p.id === layer.id);
              return (
                <div
                  key={layer.id}
                  className={`enter absolute ${layer.frame}`}
                  style={{ '--d': 260 + i * 130 }}
                >
                  <div ref={(el) => (layerRefs.current[i] = el)} className="will-change-transform">
                    <div
                      className={`${layer.tilt} overflow-hidden rounded-card bg-surface shadow-[0_40px_80px_-36px_var(--shadow-deep)] ring-1 ring-line-strong`}
                    >
                      <img
                        src={coverSrc(project.image)}
                        srcSet={coverSrcSet(project.image)}
                        sizes="(min-width: 1024px) 28vw, 64vw"
                        width="1600"
                        height="1000"
                        alt=""
                        decoding="async"
                        fetchPriority={i === STACK.length - 1 ? 'high' : 'auto'}
                        className="block aspect-[16/10] h-auto w-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
