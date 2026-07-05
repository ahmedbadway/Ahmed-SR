import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useHoverCapable } from '../hooks/useHoverCapable.js';

export const MAX_VISIBLE = 3;
export const HALF = 1;

const FAN_POSITIONS = [
  { rot: -13, scale: 0.85, x: -16, y: 3.2, zIndex: 1 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 13, scale: 0.85, x: 16, y: 3.2, zIndex: 1 },
];

function getResponsiveMultiplier(width) {
  if (width < 480) return 0.45;
  if (width < 640) return 0.55;
  if (width < 768) return 0.7;
  if (width < 1024) return 0.85;
  return 1.0;
}

// Scales y-offsets and entry-animation distances down when the viewport is
// too short for the ideal layout height (matches the .fan-layout breakpoint
// heights in index.css).
function getHeightMultiplier(width) {
  let idealPx;
  if (width < 480) idealPx = 20 * 16;
  else if (width < 640) idealPx = 23 * 16;
  else if (width < 768) idealPx = 26 * 16;
  else if (width < 1024) idealPx = 32 * 16;
  else idealPx = 36 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 13,
    scale: 1.0 - 0.15 * absDistance * absDistance,
    x: distance * 16,
    y: absDistance * absDistance * 3.2,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border border-line bg-surface text-faint cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_-4px_oklch(0_0_0_/_0.6)] hover:border-gold/50 hover:text-gold active:opacity-70 transition-colors duration-200";

// Card-fan carousel: 3 cards spread in a hand-of-cards arc; extra cards page
// in one at a time from the trailing edge. Hover-capable pointers get arrow
// buttons; touch devices swipe the fan left/right instead (no reliable
// hover, and a drag reads more naturally on a phone than tapping a small
// arrow). Reports the centered card's index to the parent (via
// onCenterChange) so a details panel elsewhere on the page stays in sync.
export default function CardFanCarousel({ cards, initialIndex, onCenterChange }) {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef(null);
  const prevVisible = useRef(new Set());
  const onCenterChangeRef = useRef(onCenterChange);
  onCenterChangeRef.current = onCenterChange;
  const canHover = useHoverCapable();

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const centerRef = useRef(
    initialIndex ?? (needsPagination ? HALF : totalCards >> 1)
  );
  // Mirrors centerRef purely to re-render the active dot — the animation
  // logic below reads/writes centerRef directly so GSAP callbacks never see
  // a stale value from a React closure.
  const [activeDot, setActiveDot] = useState(centerRef.current);

  const getVisibleMap = useCallback(
    (center) => {
      const map = new Map();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination, cards]
  );

  const render = useCallback(
    (center) => {
      const container = containerRef.current;
      if (!container || !totalCards) return;

      const cardElements = Array.from(container.querySelectorAll('.fan-card'));
      if (!cardElements.length) return;

      const visibleMap = getVisibleMap(center);
      const previouslyVisible = prevVisible.current;
      const direction = directionRef.current;
      const isFirstMount = !hasEntered.current;
      const multiplier = getResponsiveMultiplier(window.innerWidth);
      const hMult = getHeightMultiplier(window.innerWidth);
      const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
      const config = (slot) => getSlotConfig(slotCount, slot);

      if (isFirstMount) isAnimating.current = true;

      let completedCount = 0;
      const visibleCount = visibleMap.size;
      const onCardDone = () => {
        if (++completedCount >= visibleCount) {
          isAnimating.current = false;
          if (isFirstMount) hasEntered.current = true;
        }
      };

      cardElements.forEach((card, cardIndex) => {
        const slot = visibleMap.get(cardIndex);
        const wasVisible = previouslyVisible.has(cardIndex);

        if (slot !== undefined) {
          const { x, y, rot, scale, zIndex } = config(slot);
          const target = {
            x: `${x * multiplier}rem`,
            y: `${y * hMult}rem`,
            rotation: rot,
            scale,
            opacity: 1,
            zIndex,
          };

          if (isFirstMount) {
            gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
            gsap.to(card, {
              ...target,
              duration: 1.2,
              ease: 'elastic.out(1.05,.78)',
              delay: 0.2 + slot * 0.06,
              onComplete: onCardDone,
            });
          } else if (!wasVisible) {
            const enterX = direction === 'right' ? 40 : -40;
            gsap.set(card, {
              x: `${enterX}rem`,
              y: `${y * hMult}rem`,
              rotation: direction === 'right' ? 30 : -30,
              scale: 0.5,
              opacity: 0,
            });
            gsap.to(card, { ...target, duration: 0.6, ease: 'power2.out', onComplete: onCardDone });
          } else {
            gsap.to(card, { ...target, duration: 0.5, ease: 'power2.out', onComplete: onCardDone });
          }
        } else if (wasVisible) {
          const exitX = direction === 'right' ? -40 : 40;
          gsap.to(card, {
            x: `${exitX}rem`,
            opacity: 0,
            scale: 0.5,
            rotation: direction === 'right' ? -30 : 30,
            duration: 0.4,
            ease: 'power2.in',
            zIndex: 0,
          });
        } else if (isFirstMount) {
          gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
        }
      });

      prevVisible.current = new Set(visibleMap.keys());
    },
    [totalCards, needsPagination, getVisibleMap]
  );

  useEffect(() => {
    render(centerRef.current);
    onCenterChangeRef.current?.(centerRef.current);

    const onResize = () => render(centerRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // Intentionally run once: `cycle` re-renders on demand via refs, and the
    // fan's own resize handler keeps proportions in sync with the viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycle = (direction) => {
    if (isAnimating.current || !needsPagination) return;
    directionRef.current = direction;
    centerRef.current =
      direction === 'right'
        ? (centerRef.current + 1) % totalCards
        : (centerRef.current - 1 + totalCards) % totalCards;
    render(centerRef.current);
    setActiveDot(centerRef.current);
    onCenterChangeRef.current?.(centerRef.current);
  };

  // Touch-only swipe: a real drag (past a small threshold) cycles the fan
  // and suppresses the card <a>'s click so a swipe never also fires a
  // navigation; a short tap with no meaningful movement still opens the link.
  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const suppressNextClick = useRef(false);
  const DRAG_THRESHOLD = 40;

  const onPointerDown = (e) => {
    if (canHover) return;
    dragStartX.current = e.clientX;
    dragMoved.current = false;
  };
  const onPointerMove = (e) => {
    if (canHover || dragStartX.current === 0) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) dragMoved.current = true;
  };
  const onPointerUp = (e) => {
    if (canHover) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = 0;
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      suppressNextClick.current = true;
      cycle(delta < 0 ? 'right' : 'left');
    }
    dragMoved.current = false;
  };
  const onClickCapture = (e) => {
    if (suppressNextClick.current) {
      e.preventDefault();
      suppressNextClick.current = false;
    }
  };

  if (!totalCards) return null;

  // `flex` reverses the arrows' screen position under dir="rtl" automatically,
  // but the glyphs themselves don't — mirror them so "Next" still points the
  // way the fan actually advances (matches the rtl:-scale-x-100 pattern used
  // on every other directional icon in the site).
  const chevron = (direction) => (
    <svg
      className="relative z-[2] h-4 w-4 rtl:-scale-x-100 md:h-5 md:w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClickCapture={onClickCapture}
          className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] touch-pan-y"
        >
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fan-card block cursor-pointer overflow-hidden"
            >
              <img
                src={card.imgUrl}
                loading="lazy"
                decoding="async"
                alt={card.alt || `Card ${index}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>

      {needsPagination ? (
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
          {canHover ? (
            <button
              className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`}
              onClick={() => cycle('left')}
              aria-label="Previous"
            >
              {chevron('left')}
            </button>
          ) : null}
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === activeDot ? 'scale-[1.3] bg-gold' : 'bg-line'
                }`}
              />
            ))}
          </div>
          {canHover ? (
            <button
              className={`${ARROW_CLASSES} h-10 w-10 md:h-12 md:w-12`}
              onClick={() => cycle('right')}
              aria-label="Next"
            >
              {chevron('right')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
