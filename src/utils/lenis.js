// Module-level singleton so non-React utilities (e.g. scrollToId) and the
// Navbar can reach the active Lenis instance without prop-drilling a context.
let instance = null;

export function setLenis(l) {
  instance = l;
}

export function getLenis() {
  return instance;
}
