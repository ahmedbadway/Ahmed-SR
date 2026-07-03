import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Desktop-only gold dot + trailing ring. Pointer position is tracked with
// motion values (never useState) so it stays off the React render path.
// No-op on touch devices and under prefers-reduced-motion.
// Ring is rendered at its hover (largest) size and scaled down at rest, so
// the hover transition only ever touches `transform`/`opacity` — never
// width/height/margin — keeping it on the GPU compositor.
const RING_SIZE = 56;
const RING_REST_SCALE = 32 / RING_SIZE;

export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-none');

    // Position update is the only work done on every move — and it only
    // touches motion values (off the React render path), never state or the
    // DOM. The expensive hover test (a `closest()` DOM query + a React state
    // update) used to run here on every single pointermove; it now lives on
    // pointerover/pointerout, which fire only when the pointer crosses into a
    // new element, not on every pixel of movement.
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const INTERACTIVE = 'a, button, [data-magnetic], input, textarea, select';
    const over = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(true);
    };
    const out = (e) => {
      // Only clear when leaving an interactive element for a non-interactive
      // one (relatedTarget is where the pointer is heading).
      if (
        e.target.closest(INTERACTIVE) &&
        !(e.relatedTarget && e.relatedTarget.closest(INTERACTIVE))
      ) {
        setHovering(false);
      }
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerout', out, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.documentElement.classList.remove('cursor-none');
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      {/* Trailing ring — fixed size, hover scales it via transform only */}
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-gold"
        style={{
          x: ringX,
          y: ringY,
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
        }}
        animate={{
          scale: hovering ? 1 : RING_REST_SCALE,
          opacity: hovering ? 0.9 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-gold"
        style={{ x, y }}
      />
    </div>
  );
}
