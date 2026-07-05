import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Fixed, GPU-friendly background: layered radial gold/dark blobs over a fine
// grain. Very subtle — it sets mood without competing with content.
// Animation is paused under prefers-reduced-motion, and also paused whenever
// the page itself isn't visible (backgrounded tab, minimized window). This
// root is `fixed inset-0`, i.e. always geometrically inside the viewport, so
// an IntersectionObserver on it would only ever report isIntersecting: true
// and pause nothing — the Page Visibility API is the correct signal for "the
// user can't currently see this" here, so we use that instead.
export default function GradientMesh({ animate = true }) {
  const reduce = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(
    typeof document === 'undefined' || document.visibilityState === 'visible'
  );

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // `animate={false}` (passed when a video backdrop is covering the mesh) parks
  // the infinite blob drift so it costs nothing while hidden.
  const running = animate && !reduce && pageVisible;

  return (
    <div
      aria-hidden="true"
      className="gradient-mesh pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-bg" />

      {/* Gold mesh blobs */}
      <div
        className={`absolute -left-[20%] -top-[25%] h-[70vmax] w-[70vmax] rounded-full opacity-[0.16] blur-[48px] ${
          running ? 'animate-gradient-pan' : ''
        }`}
        style={{
          background:
            'radial-gradient(circle at center, var(--gold) 0%, transparent 60%)',
        }}
      />
      <div
        className={`absolute -bottom-[30%] -right-[15%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.12] blur-[52px] ${
          running ? 'animate-gradient-pan' : ''
        }`}
        style={{
          animationDelay: '-9s',
          background:
            'radial-gradient(circle at center, var(--gold-dim) 0%, transparent 60%)',
        }}
      />

      {/* Fine grain (soft-light noise) is painted via the `.gradient-mesh::after`
          pseudo-element in index.css — kept out of the DOM so it can't be
          selected as the LCP element. */}

      {/* Vignette to focus the center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, transparent 55%, oklch(0.1 0.004 60 / 0.7) 100%)',
        }}
      />
    </div>
  );
}
