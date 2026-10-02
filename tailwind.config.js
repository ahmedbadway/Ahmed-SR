import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // All colors are sourced from CSS variables defined in src/styles/index.css.
        // This keeps a single OKLCH source of truth and avoids hardcoded hex in components.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        gold: 'var(--gold)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        line: 'var(--border)',
        'line-strong': 'var(--border-strong)',
        // Translucent gold mixes. Tailwind 3 opacity modifiers (bg-gold/10)
        // cannot act on var() colors, so the tints are explicit tokens.
        'gold-wash': 'color-mix(in oklch, var(--gold) 12%, transparent)',
        'gold-line': 'color-mix(in oklch, var(--gold) 50%, transparent)',
      },
      fontFamily: {
        // AB Sans (index.css) covers Latin only, so Arabic glyphs fall through
        // to the next face via unicode-range and one stack serves both
        // languages: Reem Kufi for display, Alexandria for running text.
        // `font-display` also widens AB Sans (font-stretch, set in index.css).
        display: ['"AB Sans"', '"Reem Kufi Variable"', 'system-ui', 'sans-serif'],
        sans: ['"AB Sans"', '"Alexandria Variable"', 'system-ui', 'sans-serif'],
        // Labels and figures. Arabic labels switch to Alexandria (index.css).
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        display: '-0.025em',
      },
      borderRadius: {
        // Shape system: buttons are full pills, media and panels use `card`,
        // inputs use `field`.
        card: '18px',
        field: '12px',
      },
      zIndex: {
        nav: 'var(--z-nav)',
        skip: 'var(--z-skip)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
    },
  },
  plugins: [
    // `can-hover:` gates hover-only motion to real pointers, so touch devices
    // never get a stuck hover state after a tap.
    plugin(({ addVariant }) => {
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
};
