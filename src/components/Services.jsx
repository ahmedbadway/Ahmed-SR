import { ArrowUpRight } from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { navigate } from '../hooks/useHashRoute.js';
import { projects, coverSrc } from '../data/projects.js';

// Each service links to the real projects that prove it.
const SERVICES = [
  { key: 'clinics', projectIds: ['dr-galal', 'moghazy'] },
  { key: 'commerce', projectIds: ['elo', 'apothy', 'dasani', 'lufara'] },
  { key: 'studios', projectIds: ['amr-ziada', 'hosni-arc', 'nefeera'] },
  { key: 'personal', projectIds: ['amr-samir'] },
];

function ServiceRow({ service, t }) {
  const reveal = useReveal();
  const built = service.projectIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

  return (
    <li ref={reveal} data-reveal className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-12">
      <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink">
        {t(`services.${service.key}.title`)}
      </h3>
      <p className="mt-4 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted">
        {t(`services.${service.key}.body`)}
      </p>

      <div className="mt-7">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint rtl:tracking-normal">
          {t('services.builtFor')}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {built.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-full border border-line py-1.5 pe-4 ps-1.5 text-sm text-ink transition-[border-color,transform] duration-200 ease-out active:scale-[0.97] can-hover:hover:border-gold-line"
              >
                <img
                  src={coverSrc(p.image.replace(/\.webp$/, '-800.webp'))}
                  width="800"
                  height="500"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-12 rounded-full object-cover object-top"
                />
                {p.name}
                <ArrowUpRight
                  size={13}
                  weight="bold"
                  aria-hidden="true"
                  className="text-faint transition-colors rtl:-scale-x-100 can-hover:group-hover:text-gold"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Services() {
  const { t } = useLang();
  const reveal = useReveal();

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative scroll-mt-24 py-28 md:py-40"
    >
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Sticky intro: pure CSS position: sticky, so the split scroll costs
            nothing per frame. Mobile simply stacks. */}
        <div className="lg:col-span-5">
          <div ref={reveal} data-reveal className="lg:sticky lg:top-32">
            <h2
              id="services-title"
              className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-ink"
            >
              {t('services.title')}
            </h2>
            <p className="mt-5 max-w-[40ch] text-pretty text-lg leading-relaxed text-muted">
              {t('services.lead')}
            </p>
            <button
              type="button"
              onClick={() => navigate('/build')}
              className="btn btn-ghost mt-9"
            >
              {t('nav.cta')}
              <ArrowUpRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {SERVICES.map((service) => (
            <ServiceRow key={service.key} service={service} t={t} />
          ))}
        </ul>
      </div>
    </section>
  );
}
