import { useCallback } from 'react';

// Scroll reveal without an animation library. Every element that wants to
// fade/rise in carries `data-reveal` and receives the callback ref returned
// here. One IntersectionObserver is shared by the whole page; when an element
// enters the viewport it gets `data-in` (CSS in index.css runs the transition)
// and is unobserved, so each reveal fires exactly once.
let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-in', '');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  return observer;
}

export function useReveal() {
  return useCallback((node) => {
    if (!node || node.hasAttribute('data-in')) return;
    if (typeof IntersectionObserver === 'undefined') {
      node.setAttribute('data-in', '');
      return;
    }
    getObserver().observe(node);
  }, []);
}
