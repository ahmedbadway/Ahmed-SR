import { useReducedMotion } from 'framer-motion';

// Fixed, GPU-friendly background: layered radial gold/dark blobs over a fine
// grain. Very subtle — it sets mood without competing with content.
// Animation is paused under prefers-reduced-motion.
export default function GradientMesh() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-bg" />

      {/* Gold mesh blobs */}
      <div
        className={`absolute -left-[20%] -top-[25%] h-[70vmax] w-[70vmax] rounded-full opacity-[0.16] blur-[120px] ${
          reduce ? '' : 'animate-gradient-pan'
        }`}
        style={{
          background:
            'radial-gradient(circle at center, var(--gold) 0%, transparent 60%)',
        }}
      />
      <div
        className={`absolute -bottom-[30%] -right-[15%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.12] blur-[130px] ${
          reduce ? '' : 'animate-gradient-pan'
        }`}
        style={{
          animationDelay: '-9s',
          background:
            'radial-gradient(circle at center, var(--gold-dim) 0%, transparent 60%)',
        }}
      />

      {/* Fine grain to kill banding on the blur */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

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
