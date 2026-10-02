import { useEffect, useState } from 'react';

// Tracks which home-page section is currently under the middle of the
// viewport so the nav can mark the visitor's position. Uses one
// IntersectionObserver with a thin horizontal band at 40% of the viewport
// height instead of a scroll listener.
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return undefined;
    }
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -59% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // ids is a static module-level list in the only caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return active;
}
