import { useEffect } from 'react';
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

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}
