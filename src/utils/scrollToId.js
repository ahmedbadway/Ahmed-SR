import { getLenis } from './lenis.js';

// Smoothly scroll to a section by id, honoring reduced-motion preference.
// Routes through Lenis when it's active so anchor jumps share the same
// buttery easing as wheel/touch scrolling.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = getLenis();

  if (lenis && !reduce) {
    lenis.scrollTo(el, { offset: 0 });
    return;
  }

  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
