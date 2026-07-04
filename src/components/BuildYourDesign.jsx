import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  WhatsappLogo,
  Copy,
  Check,
  Minus,
  Plus,
  Browsers,
  Storefront,
  Heartbeat,
  Rocket,
  ForkKnife,
  ChartLineUp,
} from '@phosphor-icons/react';
import { navigate } from '../hooks/useHashRoute.js';
import { scrollToId } from '../utils/scrollToId.js';

const WHATSAPP = '201552886293';

const PROJECT_TYPES = [
  { id: 'Portfolio', Icon: Browsers },
  { id: 'Clinic / Medical', Icon: Heartbeat },
  { id: 'E-commerce', Icon: Storefront },
  { id: 'Landing Page', Icon: Rocket },
  { id: 'Restaurant / Café', Icon: ForkKnife },
  { id: 'SaaS Dashboard', Icon: ChartLineUp },
];

const STYLES = ['Minimal', 'Luxury', 'Bold', 'Soft', 'Dark / Editorial'];

// Curated palette options a client can pick. These hexes are *content* — the
// colors the visitor is choosing for their own project — not the portfolio's
// design tokens, so they intentionally live here as data. Each is [surface,
// secondary, accent, light] for the live mock-up preview.
const PALETTES = [
  { id: 'Champagne Noir', swatches: ['#0b0c11', '#1a1c24', '#e8b84d', '#f6db8e'] },
  { id: 'Clinical Fresh', swatches: ['#0e1419', '#0ea5a5', '#5eead4', '#eafaf8'] },
  { id: 'Luxe Rosé', swatches: ['#150f12', '#b76e79', '#e8c0c0', '#faf3f2'] },
  { id: 'Editorial Mono', swatches: ['#0a0a0a', '#2a2a2a', '#ff5a3c', '#f5f5f5'] },
  { id: 'Deep Ocean', swatches: ['#0a0f1f', '#1e3a8a', '#38bdf8', '#e0f2fe'] },
  { id: 'Warm Sand', swatches: ['#1a1512', '#c26b3e', '#e0b088', '#f7efe6'] },
];

const EXTRAS = [
  'Animations & Motion',
  'Bilingual (AR / EN)',
  'Contact Form',
  'Online Store / Cart',
  'Booking System',
  'Blog / CMS',
  'SEO Setup',
];

const TIMELINES = ['Rush (1–2 wks)', 'Standard (3–4 wks)', 'Flexible'];

function Chip({ active, children, onClick, Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-magnetic
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'border-gold bg-gold/12 text-gold'
          : 'border-line text-muted hover:border-gold/50 hover:text-ink'
      }`}
    >
      {Icon ? <Icon size={17} weight={active ? 'fill' : 'regular'} /> : null}
      {children}
    </button>
  );
}

function Group({ step, label, children }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-gold">{step}</span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          {label}
        </h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

export default function BuildYourDesign() {
  const reduce = useReducedMotion();
  const [type, setType] = useState(null);
  const [style, setStyle] = useState(null);
  const [paletteId, setPaletteId] = useState(PALETTES[0].id);
  const [pages, setPages] = useState(5);
  const [extras, setExtras] = useState([]);
  const [timeline, setTimeline] = useState('Standard (3–4 wks)');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const palette = useMemo(
    () => PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0],
    [paletteId]
  );

  const toggleExtra = (val) =>
    setExtras((prev) =>
      prev.includes(val) ? prev.filter((e) => e !== val) : [...prev, val]
    );

  const pagesLabel = pages >= 12 ? '12+' : String(pages);

  const brief = useMemo(() => {
    const lines = [
      'Design brief — from ahmedbadway.github.io',
      '',
      `• Project: ${type ?? "Let's discuss"}`,
      `• Style: ${style ?? 'Open to suggestions'}`,
      `• Palette: ${palette.id}`,
      `• Pages: ${pagesLabel}`,
      `• Extras: ${extras.length ? extras.join(', ') : '—'}`,
      `• Timeline: ${timeline}`,
    ];
    if (name.trim()) lines.push(`• From: ${name.trim()}`);
    if (note.trim()) lines.push('', `Notes: ${note.trim()}`);
    return lines.join('\n');
  }, [type, style, palette, pagesLabel, extras, timeline, name, note]);

  const sendWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(brief)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const goHome = () => {
    navigate('/');
    setTimeout(() => scrollToId('contact'), 90);
  };

  const reveal = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="scroll-mt-24 pb-28 pt-32 md:pb-36 md:pt-40">
      <div className="shell">
        <motion.div {...reveal}>
          <button
            type="button"
            onClick={() => navigate('/')}
            data-magnetic
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to portfolio
          </button>

          <span className="eyebrow mt-8 block">Design Studio</span>
          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tightest text-ink">
            Build your <span className="text-gradient-gold">design</span>.
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
            Shape the brief in under a minute — pick the type, the mood, the
            colors, and the scope. When it looks right, send it straight to my
            WhatsApp and I&apos;ll reply with a tailored quote.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Builder */}
          <div className="flex flex-col gap-12 lg:col-span-7">
            <Group step="01" label="What are we building?">
              {PROJECT_TYPES.map(({ id, Icon }) => (
                <Chip
                  key={id}
                  Icon={Icon}
                  active={type === id}
                  onClick={() => setType(id)}
                >
                  {id}
                </Chip>
              ))}
            </Group>

            <Group step="02" label="Pick a vibe">
              {STYLES.map((s) => (
                <Chip key={s} active={style === s} onClick={() => setStyle(s)}>
                  {s}
                </Chip>
              ))}
            </Group>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-gold">03</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Choose your colors
                </h2>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PALETTES.map((p) => {
                  const active = paletteId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaletteId(p.id)}
                      aria-pressed={active}
                      className={`flex flex-col gap-3 rounded-card border p-3 text-left transition-colors duration-200 ${
                        active
                          ? 'border-gold bg-gold/8'
                          : 'border-line hover:border-gold/50'
                      }`}
                    >
                      <div className="flex h-9 overflow-hidden rounded-lg">
                        {p.swatches.map((c, i) => (
                          <span
                            key={i}
                            className="flex-1"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          active ? 'text-gold' : 'text-muted'
                        }`}
                      >
                        {p.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-gold">04</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  How many pages?
                </h2>
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="flex items-center gap-4 rounded-full border border-line px-3 py-2">
                  <button
                    type="button"
                    aria-label="Fewer pages"
                    onClick={() => setPages((p) => Math.max(1, p - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 disabled:opacity-30"
                    disabled={pages <= 1}
                  >
                    <Minus size={16} weight="bold" />
                  </button>
                  <span className="w-10 text-center font-display text-2xl font-bold text-ink">
                    {pagesLabel}
                  </span>
                  <button
                    type="button"
                    aria-label="More pages"
                    onClick={() => setPages((p) => Math.min(12, p + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 disabled:opacity-30"
                    disabled={pages >= 12}
                  >
                    <Plus size={16} weight="bold" />
                  </button>
                </div>
                <span className="text-sm text-faint">
                  {pages === 1
                    ? 'Single-page site'
                    : pages >= 12
                      ? 'Large multi-page build'
                      : `${pages} sections / pages`}
                </span>
              </div>
            </div>

            <Group step="05" label="Add-ons (optional)">
              {EXTRAS.map((e) => (
                <Chip
                  key={e}
                  active={extras.includes(e)}
                  onClick={() => toggleExtra(e)}
                >
                  {e}
                </Chip>
              ))}
            </Group>

            <Group step="06" label="Timeline">
              {TIMELINES.map((t) => (
                <Chip
                  key={t}
                  active={timeline === t}
                  onClick={() => setTimeline(t)}
                >
                  {t}
                </Chip>
              ))}
            </Group>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-gold">07</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Anything else?
                </h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none"
                />
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="A reference site, a deadline, a budget…"
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none sm:col-span-1"
                />
              </div>
            </div>
          </div>

          {/* Live summary + preview */}
          <div className="lg:col-span-5">
            <div className="glass sticky top-24 flex flex-col gap-6 rounded-card p-6 md:p-7">
              <div>
                <span className="eyebrow">Live preview</span>
                {/* Mini mock-up that repaints in the chosen palette */}
                <div
                  className="mt-4 overflow-hidden rounded-xl border border-line"
                  style={{ background: palette.swatches[0] }}
                >
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5"
                    style={{ background: palette.swatches[1] }}
                  >
                    <span className="h-2 w-2 rounded-full bg-white/40" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <span
                      className="h-3.5 w-2/3 rounded-full"
                      style={{ background: palette.swatches[3] }}
                    />
                    <span
                      className="h-2 w-full rounded-full opacity-40"
                      style={{ background: palette.swatches[3] }}
                    />
                    <span
                      className="h-2 w-5/6 rounded-full opacity-30"
                      style={{ background: palette.swatches[3] }}
                    />
                    <span
                      className="mt-2 h-8 w-28 rounded-full"
                      style={{ background: palette.swatches[2] }}
                    />
                  </div>
                </div>
              </div>

              <dl className="flex flex-col divide-y divide-line text-sm">
                {[
                  ['Project', type ?? '—'],
                  ['Vibe', style ?? '—'],
                  ['Palette', palette.id],
                  ['Pages', pagesLabel],
                  ['Add-ons', extras.length ? `${extras.length} selected` : '—'],
                  ['Timeline', timeline],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5">
                    <dt className="text-faint">{k}</dt>
                    <dd className="max-w-[60%] truncate text-right font-medium text-ink">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-bg transition-colors duration-200 hover:bg-gold-soft active:scale-[0.98]"
                >
                  <WhatsappLogo size={19} weight="fill" />
                  Send brief on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={copyBrief}
                  className="flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-muted transition-colors duration-200 hover:border-gold hover:text-ink"
                >
                  {copied ? (
                    <>
                      <Check size={17} weight="bold" className="text-gold" />
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy size={17} />
                      Copy brief instead
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-faint">
                Prefer to talk it through?{' '}
                <button
                  type="button"
                  onClick={goHome}
                  className="text-gold underline-offset-2 hover:underline"
                >
                  See all contact options
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
