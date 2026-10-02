import { useEffect, useRef } from 'react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { projects, INDUSTRY_COUNT } from '../data/projects.js';

const TOOLS = [
  'React',
  'Vite',
  'Tailwind CSS',
  'Framer Motion',
  'GSAP',
  'Lenis',
  'Phosphor Icons',
  'Higgsfield AI',
  'Playwright',
  'GitHub Pages',
  'Vercel',
];

// Single marquee on the page. The CSS loop pauses whenever the strip is off
// screen, so it costs nothing while the visitor is elsewhere.
function ToolsMarquee({ label }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const row = (hidden) =>
    TOOLS.map((tool) => (
      <li
        key={`${hidden ? 'b' : 'a'}-${tool}`}
        aria-hidden={hidden || undefined}
        className={`${hidden ? 'marquee-dup ' : ''}flex items-center gap-10 pe-10 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tight text-faint`}
      >
        {tool}
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-line" />
      </li>
    ));

  return (
    // Tool names are Latin, so the strip always runs left to right.
    <div ref={ref} dir="ltr" className="marquee overflow-hidden" data-paused="">
      <ul aria-label={label} className="marquee-track">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}

export default function About() {
  const { t } = useLang();
  const statsReveal = useReveal();

  const stats = [
    { value: projects.length, label: t('about.stat.projects') },
    { value: INDUSTRY_COUNT, label: t('about.stat.industries') },
    { value: 2, label: t('about.stat.languages') },
  ];

  // Each word lights up as the paragraph scrolls through the viewport (CSS
  // view timeline). Words stay whole, so Arabic letter joining is preserved.
  const words = t('about.body').split(' ');

  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <h2 id="about-title" className="eyebrow">
          {t('about.title')}
        </h2>
        <p className="mt-8 max-w-[30ch] font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.22] tracking-tight text-ink">
          {words.map((w, i) => (
            <span key={i} className="scrub-word">
              {w}{' '}
            </span>
          ))}
        </p>

        <dl
          ref={statsReveal}
          data-reveal
          className="mt-20 grid grid-cols-3 gap-6 border-t border-line pt-10 md:mt-28 md:gap-10"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-none tracking-display text-ink tabular-nums">
                {s.value}
              </dd>
              <dd className="mt-3 max-w-[18ch] text-sm leading-snug text-muted md:text-base" aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-24 md:mt-32">
        <ToolsMarquee label={t('about.tools')} />
      </div>
    </section>
  );
}
