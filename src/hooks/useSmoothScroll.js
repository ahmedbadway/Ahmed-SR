import { useEffect } from 'react';
import { frame, cancelFrame } from 'framer-motion';
import Lenis from 'lenis';
import { setLenis } from '../utils/lenis.js';

// Buttery, premium page scroll via Lenis. Fully bypassed when the visitor
// prefers reduced motion — they get native, instant scrolling instead.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // lerp-based damping (no duration/easing) — cheaper per-frame math than a
    // duration+easing tween and more responsive to interrupted scroll input.
    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    // Drive Lenis from Framer Motion's single shared rAF loop instead of a
    // second, independent requestAnimationFrame. Previously Lenis ran its own
    // rAF while Hero's `useScroll` ran Framer's rAF — two loops per frame,
    // out of phase, each triggering scroll-linked measurement and its own
    // layer commits (the continuous UpdateLayer storm in the trace). Sharing
    // one loop keeps Lenis and every Framer scroll animation on the same tick.
    const update = (data) => lenis.raf(data.timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}
