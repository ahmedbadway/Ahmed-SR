import { useEffect, useState } from 'react';

// Minimal, dependency-free hash router. Two routes only:
//   '/'       → the portfolio (default)
//   '/build'  → the Build Your Design brief studio
//
// Section anchors (scrollToId) never write the hash, so the hash is free to
// carry the route. Anything that isn't a real route ('#main', '#about', …)
// falls back to home. Works on GitHub Pages with no server rewrites because
// the fragment is client-only and base-path independent.
function readRoute() {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.hash.replace(/^#/, '');
  return raw.startsWith('/build') ? '/build' : '/';
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

// Navigate to a route. Kept as a plain function so non-hook call sites (event
// handlers) can use it without wiring extra context.
export function navigate(route) {
  window.location.hash = route === '/' ? '/' : route;
}
