// Custom AB monogram — an interlocking geometric ligature: the "A" (ink) and
// "B" (gold) share the lower-right vertex, so they read as one designed mark
// rather than two letters. Vector paths (no font dependency), crisp at any size.
export default function Logo({ withWordmark = true, className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-7 w-7 shrink-0"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        aria-hidden="true"
      >
        {/* A — ink */}
        <path d="M10 36 L20 12 L30 36" className="stroke-ink" />
        <path d="M14.5 27 H25.5" className="stroke-ink" />
        {/* B — gold, sharing the A's right foot at (30,36) */}
        <path d="M30 12 V36" className="stroke-gold" />
        <path d="M30 12 H37 a6 6 0 0 1 0 12 H30" className="stroke-gold" />
        <path d="M30 24 H39 a6.5 6.5 0 0 1 0 12 H30" className="stroke-gold" />
      </svg>
      {withWordmark ? (
        <span className="hidden font-display text-[0.975rem] font-semibold tracking-tight text-ink sm:inline md:max-lg:hidden">
          Ahmed Badway
        </span>
      ) : null}
    </span>
  );
}
