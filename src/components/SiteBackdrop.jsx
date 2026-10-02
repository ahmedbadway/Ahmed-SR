// Static page backdrop: one fixed layer painted once, never animated. A soft
// champagne glow sits behind the hero headline and a faint film grain keeps
// the black from looking flat. Every colour comes from the CSS tokens, and all
// of the styling lives in `.site-backdrop` (index.css).
export default function SiteBackdrop() {
  return <div aria-hidden="true" className="site-backdrop" />;
}
