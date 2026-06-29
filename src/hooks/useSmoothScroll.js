import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '../utils/lenis.js';

// Buttery, premium page scroll via Lenis. Fully bypassed when the visitor
// prefers reduced motion — they get native, instant scrolling instead.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      // easeOutExpo — fast to start, soft to settle (matches the site's easing)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
