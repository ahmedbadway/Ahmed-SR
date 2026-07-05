import { useEffect, useRef } from 'react';

// Refined Canvas 2D node field — the site's ambient background.
// Sparse gold nodes drift slowly and link with thin lines when near; the cursor
// gently repels nodes around it. The brief is restraint: low density, low
// opacity, slow motion — texture you feel more than see, not a template effect.
//
// Every color is read from the site's own CSS variables (--gold-rgb, --bg), so
// re-theming the tokens re-themes the field. It honors prefers-reduced-motion
// (a single frozen frame, no loop), pauses the render loop when the tab is
// hidden, caps particle count + frame-rate on small screens, and renders at
// devicePixelRatio for crisp lines. It never intercepts pointer events.
export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // --- colors from CSS variables only (no hardcoded values) ---
    const rootStyles = getComputedStyle(document.documentElement);
    const goldRaw = rootStyles.getPropertyValue('--gold-rgb').trim();
    const gold = goldRaw ? goldRaw.replace(/\s+/g, ',') : '232,184,77';

    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId = 0;
    let running = false;
    let lastFrame = 0;
    let resizeTimer = 0;

    // Viewport-aware budget: small screens get fewer nodes and a 30fps cap so
    // mid-range phones never jank.
    const readConfig = () => {
      const mobile = window.innerWidth < 768;
      return {
        mobile,
        maxDist: mobile ? 108 : 148, // link distance
        frameInterval: mobile ? 1000 / 30 : 1000 / 60, // fps cap
        area: mobile ? 26000 : 22000, // px² per node (higher = sparser)
        cap: mobile ? 24 : 60, // hard ceiling
        floor: mobile ? 10 : 26, // keep it from looking empty
        repel: finePointer, // no cursor repulsion on touch
        repelRadius: mobile ? 90 : 132,
      };
    };
    let cfg = readConfig();

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Draw in CSS pixels; the transform handles the device-pixel scale so
      // lines and dots stay crisp on retina/hidpi screens.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      const target = Math.max(
        cfg.floor,
        Math.min(cfg.cap, Math.round((width * height) / cfg.area))
      );
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16, // slow drift (~9px/s @60fps)
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.8 + Math.random() * 1.1,
      }));
    };

    const render = (animate) => {
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          // wrap softly around the edges so the field never thins out
          if (p.x < -24) p.x = width + 24;
          else if (p.x > width + 24) p.x = -24;
          if (p.y < -24) p.y = height + 24;
          else if (p.y > height + 24) p.y = -24;

          if (cfg.repel && mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            const R = cfg.repelRadius;
            if (d2 > 0.01 && d2 < R * R) {
              const d = Math.sqrt(d2);
              const force = (1 - d / R) * 0.7; // gentle push near the cursor
              p.x += (dx / d) * force;
              p.y += (dy / d) * force;
            }
          }
        }
      }

      // thin connecting lines (fade with distance) — O(n²) is cheap at this
      // node count, so no spatial grid is needed.
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < cfg.maxDist) {
            const alpha = (1 - dist / cfg.maxDist) * 0.15;
            ctx.strokeStyle = `rgba(${gold},${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.fillStyle = `rgba(${gold},0.5)`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      if (now - lastFrame < cfg.frameInterval) return; // frame-rate cap
      lastFrame = now;
      // Ease the cursor toward its target so repulsion feels natural with
      // momentum rather than snapping (Emil Kowalski: decorative mouse-tracking
      // should never be instant).
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      render(true);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrame = 0;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    const onPointerMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      }
    };
    const onPointerLeave = () => {
      mouse.active = false;
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cfg = readConfig();
        resize();
        build();
        if (reduceMQ.matches) render(false);
      }, 150);
    };

    const onVisibility = () => {
      if (reduceMQ.matches) return;
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    const onReduceChange = () => {
      if (reduceMQ.matches) {
        stop();
        render(false); // freeze to a static frame
      } else {
        start();
      }
    };

    // init
    resize();
    build();
    if (reduceMQ.matches) {
      render(false); // static, no loop
    } else {
      start();
    }

    if (cfg.repel) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMQ.addEventListener?.('change', onReduceChange);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMQ.removeEventListener?.('change', onReduceChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Radial vignette (part of this component, not a stacked extra layer):
          deepens the edges toward --bg so the hero text keeps full contrast even
          where nodes cluster. color-mix gives --bg an alpha without hardcoding. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 42%, color-mix(in oklch, var(--bg) 55%, transparent) 78%, color-mix(in oklch, var(--bg) 80%, transparent) 100%)',
        }}
      />
    </div>
  );
}
