import { useMemo, useState } from 'react';
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
import { useLang } from '../i18n/LanguageProvider.jsx';

const WHATSAPP = '201552886293';

const PROJECT_TYPES = [
  { id: 'portfolio', key: 'type.portfolio', Icon: Browsers },
  { id: 'clinic', key: 'type.clinic', Icon: Heartbeat },
  { id: 'ecommerce', key: 'type.ecommerce', Icon: Storefront },
  { id: 'landing', key: 'type.landing', Icon: Rocket },
  { id: 'restaurant', key: 'type.restaurant', Icon: ForkKnife },
  { id: 'saas', key: 'type.saas', Icon: ChartLineUp },
];

const STYLES = [
  { id: 'minimal', key: 'style.minimal' },
  { id: 'luxury', key: 'style.luxury' },
  { id: 'bold', key: 'style.bold' },
  { id: 'soft', key: 'style.soft' },
  { id: 'editorial', key: 'style.editorial' },
];

// Palette swatches are the colors the visitor is picking for THEIR project —
// content, not the portfolio's design tokens — so they live here as data.
// Order: [surface, secondary, accent, light] for the live mock-up.
const PALETTES = [
  { id: 'champagne', key: 'palette.champagne', swatches: ['#0b0c11', '#1a1c24', '#e8b84d', '#f6db8e'] },
  { id: 'clinical', key: 'palette.clinical', swatches: ['#0e1419', '#0ea5a5', '#5eead4', '#eafaf8'] },
  { id: 'rose', key: 'palette.rose', swatches: ['#150f12', '#b76e79', '#e8c0c0', '#faf3f2'] },
  { id: 'mono', key: 'palette.mono', swatches: ['#0a0a0a', '#2a2a2a', '#ff5a3c', '#f5f5f5'] },
  { id: 'ocean', key: 'palette.ocean', swatches: ['#0a0f1f', '#1e3a8a', '#38bdf8', '#e0f2fe'] },
  { id: 'sand', key: 'palette.sand', swatches: ['#1a1512', '#c26b3e', '#e0b088', '#f7efe6'] },
  { id: 'verdant', key: 'palette.verdant', swatches: ['#0c1512', '#0f766e', '#34d399', '#ecfdf5'] },
  { id: 'violet', key: 'palette.violet', swatches: ['#120f1a', '#6d28d9', '#a78bfa', '#f5f3ff'] },
];

const EXTRAS = [
  { id: 'motion', key: 'extra.motion' },
  { id: 'bilingual', key: 'extra.bilingual' },
  { id: 'form', key: 'extra.form' },
  { id: 'store', key: 'extra.store' },
  { id: 'booking', key: 'extra.booking' },
  { id: 'cms', key: 'extra.cms' },
  { id: 'seo', key: 'extra.seo' },
];

const TIMELINES = [
  { id: 'rush', key: 'time.rush' },
  { id: 'standard', key: 'time.standard' },
  { id: 'flexible', key: 'time.flexible' },
];

const DEFAULT_PALETTE = 'champagne';
const DEFAULT_TIMELINE = 'standard';
const DEFAULT_PAGES = 5;
const EASE_OUT = 'var(--ease-out)';

function Chip({ active, children, onClick, Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{ transitionTimingFunction: EASE_OUT }}
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-95 ${
        active
          ? 'border-gold bg-gold-wash text-gold'
          : 'border-line text-muted can-hover:hover:border-gold-line can-hover:hover:text-ink'
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
        <span className="text-xs font-semibold tabular-nums text-gold">{step}</span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{label}</h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

export default function BuildYourDesign() {
  const { t, lang } = useLang();

  const [type, setType] = useState(null);
  const [style, setStyle] = useState(null);
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE);
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [extras, setExtras] = useState([]);
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  // 'idle' | 'copied' | 'failed'
  const [copyState, setCopyState] = useState('idle');

  const palette = useMemo(
    () => PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0],
    [paletteId]
  );

  const toggleExtra = (id) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  const pagesLabel = pages >= 12 ? '12+' : String(pages);

  // Progress reflects genuine engagement across the seven groups.
  const touched = [
    type !== null,
    style !== null,
    paletteId !== DEFAULT_PALETTE,
    pages !== DEFAULT_PAGES,
    extras.length > 0,
    timeline !== DEFAULT_TIMELINE,
    Boolean(name.trim() || note.trim()),
  ].filter(Boolean).length;
  const progress = Math.round((touched / 7) * 100);

  const labelOf = (list, id, fallbackKey) => {
    const found = list.find((o) => o.id === id);
    return found ? t(found.key) : t(fallbackKey);
  };

  const brief = useMemo(() => {
    const lines = [
      t('brief.header'),
      '',
      `• ${t('brief.project')}: ${type ? labelOf(PROJECT_TYPES, type) : t('build.discuss')}`,
      `• ${t('brief.style')}: ${style ? labelOf(STYLES, style) : t('build.none')}`,
      `• ${t('brief.palette')}: ${t(palette.key)}`,
      `• ${t('brief.pages')}: ${pagesLabel}`,
      `• ${t('brief.extras')}: ${
        extras.length ? extras.map((id) => labelOf(EXTRAS, id)).join(lang === 'ar' ? '، ' : ', ') : '-'
      }`,
      `• ${t('brief.timeline')}: ${labelOf(TIMELINES, timeline)}`,
    ];
    if (name.trim()) lines.push(`• ${t('brief.from')}: ${name.trim()}`);
    if (note.trim()) lines.push('', `${t('brief.notes')}: ${note.trim()}`);
    return lines.join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, style, palette, pagesLabel, extras, timeline, name, note, lang]);

  const sendWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(brief)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    setTimeout(() => setCopyState('idle'), 2400);
  };

  const goContact = () => {
    navigate('/');
    setTimeout(() => scrollToId('contact'), 90);
  };

  const pagesHint =
    pages === 1
      ? t('build.pagesOne')
      : pages >= 12
        ? t('build.pagesLarge')
        : `${pages} ${t('build.pagesSome')}`;

  return (
    <section className="scroll-mt-24 pb-28 pt-32 md:pb-36 md:pt-40">
      <div className="shell">
        <div className="enter">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors can-hover:hover:text-ink"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100"
            />
            {t('build.back')}
          </button>

          <span className="eyebrow mt-8 block">{t('build.eyebrow')}</span>
          {/* Solid heading — no gradient text on large type (impeccable). */}
          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1] tracking-display text-ink">
            {t('build.titleA')} <span className="text-gold">{t('build.titleB')}</span>.
          </h1>
          <p className="mt-6 max-w-[52ch] text-pretty text-base leading-relaxed text-muted md:text-lg">
            {t('build.lead')}
          </p>

          {/* Progress */}
          <div className="mt-8 flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('build.progress')}
              className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2"
            >
              {/* scaleX instead of width: the bar animates on the compositor. */}
              <div
                className="h-full w-full origin-left rounded-full bg-gold transition-transform duration-[400ms] ease-out rtl:origin-right"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <span className="text-xs tabular-nums text-faint">
              {progress}% {t('build.progress')}
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Builder */}
          <div className="flex flex-col gap-12 lg:col-span-7">
            <Group step="01" label={t('build.q1')}>
              {PROJECT_TYPES.map(({ id, key, Icon }) => (
                <Chip key={id} Icon={Icon} active={type === id} onClick={() => setType(id)}>
                  {t(key)}
                </Chip>
              ))}
            </Group>

            <Group step="02" label={t('build.q2')}>
              {STYLES.map(({ id, key }) => (
                <Chip key={id} active={style === id} onClick={() => setStyle(id)}>
                  {t(key)}
                </Chip>
              ))}
            </Group>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold tabular-nums text-gold">03</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {t('build.q3')}
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
                      style={{ transitionTimingFunction: EASE_OUT }}
                      className={`flex flex-col gap-3 rounded-card border p-3 text-start transition-colors duration-200 ${
                        active ? 'border-gold bg-gold-wash' : 'border-line can-hover:hover:border-gold-line'
                      }`}
                    >
                      <div className="flex h-9 overflow-hidden rounded-lg">
                        {p.swatches.map((c, i) => (
                          <span key={i} className="flex-1" style={{ background: c }} />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${active ? 'text-gold' : 'text-muted'}`}>
                        {t(p.key)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold tabular-nums text-gold">04</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {t('build.q4')}
                </h2>
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="flex items-center gap-4 rounded-full border border-line px-3 py-2">
                  <button
                    type="button"
                    aria-label={t('build.pagesLess')}
                    onClick={() => setPages((p) => Math.max(1, p - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 disabled:opacity-30"
                    disabled={pages <= 1}
                  >
                    <Minus size={16} weight="bold" />
                  </button>
                  <span aria-live="polite" className="w-10 text-center font-display text-2xl font-semibold tabular-nums text-ink">
                    {pagesLabel}
                  </span>
                  <button
                    type="button"
                    aria-label={t('build.pagesMore')}
                    onClick={() => setPages((p) => Math.min(12, p + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 disabled:opacity-30"
                    disabled={pages >= 12}
                  >
                    <Plus size={16} weight="bold" />
                  </button>
                </div>
                <span className="text-sm text-faint">{pagesHint}</span>
              </div>
            </div>

            <Group step="05" label={t('build.q5')}>
              {EXTRAS.map(({ id, key }) => (
                <Chip key={id} active={extras.includes(id)} onClick={() => toggleExtra(id)}>
                  {t(key)}
                </Chip>
              ))}
            </Group>

            <Group step="06" label={t('build.q6')}>
              {TIMELINES.map(({ id, key }) => (
                <Chip key={id} active={timeline === id} onClick={() => setTimeline(id)}>
                  {t(key)}
                </Chip>
              ))}
            </Group>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold tabular-nums text-gold">07</span>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {t('build.q7')}
                </h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-muted">{t('build.nameLabel')}</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-field border border-line bg-surface px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-muted">{t('build.noteLabel')}</span>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t('build.notePlaceholder')}
                    className="rounded-field border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Live summary + preview */}
          <div className="lg:col-span-5">
            <div className="glass sticky top-24 flex flex-col gap-6 rounded-card p-6 md:p-7">
              <div>
                <span className="eyebrow">{t('build.preview')}</span>
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
                    <span className="h-3.5 w-2/3 rounded-full" style={{ background: palette.swatches[3] }} />
                    <span className="h-2 w-full rounded-full opacity-40" style={{ background: palette.swatches[3] }} />
                    <span className="h-2 w-5/6 rounded-full opacity-30" style={{ background: palette.swatches[3] }} />
                    <span className="mt-2 h-8 w-28 rounded-full" style={{ background: palette.swatches[2] }} />
                  </div>
                </div>
              </div>

              <dl className="flex flex-col divide-y divide-line text-sm">
                {[
                  [t('build.sumProject'), type ? labelOf(PROJECT_TYPES, type) : '-'],
                  [t('build.sumVibe'), style ? labelOf(STYLES, style) : '-'],
                  [t('build.sumPalette'), t(palette.key)],
                  [t('build.sumPages'), pagesLabel],
                  [t('build.sumAddons'), extras.length ? `${extras.length} ${t('build.selected')}` : '-'],
                  [t('build.sumTimeline'), labelOf(TIMELINES, timeline)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-faint">{k}</dt>
                    <dd className="max-w-[60%] truncate text-end font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="btn btn-primary w-full"
                >
                  <WhatsappLogo size={19} weight="fill" />
                  {t('build.send')}
                </button>
                <button
                  type="button"
                  onClick={copyBrief}
                  aria-live="polite"
                  className="btn btn-ghost w-full py-3 text-sm font-medium"
                >
                  {copyState === 'copied' ? (
                    <>
                      <Check size={17} weight="bold" className="text-gold" />
                      {t('build.copied')}
                    </>
                  ) : copyState === 'failed' ? (
                    t('build.copyFailed')
                  ) : (
                    <>
                      <Copy size={17} />
                      {t('build.copy')}
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-faint">
                {t('build.talk')}{' '}
                <button
                  type="button"
                  onClick={goContact}
                  className="text-gold underline-offset-2 can-hover:hover:underline"
                >
                  {t('build.contactOptions')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
