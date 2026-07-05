import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import GradientMesh from './GradientMesh.jsx';

// Site-wide ambient video backdrop with a graceful fallback.
// Drop an `hero-bg.mp4` into `public/media/` and it plays muted + looped behind
// everything. If the file is missing (404 → onError), the visitor prefers
// reduced motion, or the tab is hidden, we fall back to the static GradientMesh
// — so the page always has a finished-looking background and never pays for a
// video it can't show. A dark scrim over the video keeps all copy legible.
const VIDEO_SRC = `${import.meta.env.BASE_URL}media/hero-bg.mp4`;
const POSTER = `${import.meta.env.BASE_URL}media/poster.svg`;

export default function VideoBackground() {
  const reduce = useReducedMotion();
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const showVideo = !reduce && !failed;

  // Pause the video whenever the tab isn't visible; resume on return. One
  // element, and no decoding work while the user is looking elsewhere.
  useEffect(() => {
    if (!showVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onVisibility = () => {
      if (document.visibilityState === 'visible') v.play().catch(() => {});
      else v.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [showVideo]);

  return (
    <>
      {/* Base layer + fallback. Blob drift parks while the video covers it. */}
      <GradientMesh animate={!showVideo} />

      {showVideo ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.55 }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER}
            onError={() => setFailed(true)}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          {/* Legibility scrim: even veil + edge vignette so text stays readable
              over any frame of the video, across the whole scroll. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,11,17,0.72) 0%, rgba(10,11,17,0.5) 40%, rgba(10,11,17,0.66) 100%), radial-gradient(120% 80% at 50% 0%, transparent 55%, oklch(0.1 0.01 265 / 0.72) 100%)',
            }}
          />
        </div>
      ) : null}
    </>
  );
}
