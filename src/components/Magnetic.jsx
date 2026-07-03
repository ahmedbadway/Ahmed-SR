import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Wraps children so they drift toward the pointer on hover, then spring back.
// Uses motion values (no useState) per the pointer-physics rule.
// Disabled under reduced-motion. Renders an inline-block wrapper.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  // Measure the element ONCE on pointer enter. Reading getBoundingClientRect()
  // inside onPointerMove forced a synchronous layout on every mouse move,
  // which — with Lenis driving scroll each frame — thrashed the main thread.
  // The element doesn't move relative to the page while hovered, so the cached
  // rect stays valid for the duration of the hover.
  const handleEnter = () => {
    if (reduce || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMove = (e) => {
    if (reduce) return;
    const rect = rectRef.current;
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
