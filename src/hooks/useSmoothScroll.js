import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '../utils/lenis.js';

// Inertial page scroll via Lenis on wheel/trackpad. Touch devices keep native
// scrolling (Lenis leaves touch alone by default), and visitors who prefer
// reduced motion get native, instant scrolling everywhere.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // lerp-based damping: cheaper per frame than a duration+easing tween and
    // more responsive to interrupted input. 0.11 keeps a premium glide while
    // tracking the wheel closely enough to feel instant.
    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: true,
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}
