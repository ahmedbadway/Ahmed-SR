# Background video

Drop your looping background clip here as **`hero-bg.mp4`** and it will play
automatically behind the whole site (muted, looped, `playsinline`).

- Path used by the app: `media/hero-bg.mp4` (resolved via `import.meta.env.BASE_URL`).
- Recommended: 1080p or smaller, H.264/MP4, a few MB, ~10–20s seamless loop.
- `poster.svg` (also in this folder) shows while the video loads.

If `hero-bg.mp4` is missing, the visitor prefers reduced motion, or the tab is
hidden, the site falls back to the animated gradient mesh automatically — nothing
breaks. Swap the file anytime; no code change needed.
