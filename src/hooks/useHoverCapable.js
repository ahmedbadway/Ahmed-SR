import { useEffect, useState } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

// True only on devices with a real hover-capable pointer (desktop mouse/
// trackpad). Touch phones and tablets report `hover: none` — components that
// reveal content on hover should fall back to an always-visible layout there
// instead of a hover state the visitor can never trigger.
export function useHoverCapable() {
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return canHover;
}
