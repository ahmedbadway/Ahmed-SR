import {
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
  InstagramLogo,
  GithubLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { useLang } from '../i18n/LanguageProvider.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { navigate } from '../hooks/useHashRoute.js';

const WHATSAPP_URL = 'https://wa.me/201552886293';

export default function Contact() {
  const { t } = useLang();
  const reveal = useReveal();
  const listReveal = useReveal();

  const channels = [
    { label: t('contact.call'), value: '+20 155 288 6293', href: 'tel:+201552886293', Icon: Phone },
    { label: t('contact.email'), value: 'ahoshos@icloud.com', href: 'mailto:ahoshos@icloud.com', Icon: EnvelopeSimple },
    { label: t('contact.instagram'), value: '@ahoshos993', href: 'https://instagram.com/ahoshos993', Icon: InstagramLogo, external: true },
    { label: t('contact.github'), value: 'ahmedbadway', href: 'https://github.com/ahmedbadway', Icon: GithubLogo, external: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <div
          ref={reveal}
          data-reveal
          className="relative overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-16 md:px-14 md:py-24"
        >
          {/* A single static glow inside the panel; painted once. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-1/4 -top-1/2 h-[140%] w-[80%] bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--gold)_16%,transparent),transparent)]"
          />

          <div className="relative max-w-3xl">
            <h2
              id="contact-title"
              className="text-balance font-display text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-display text-ink"
            >
              {t('contact.title')}
            </h2>
            <p className="mt-6 max-w-[42ch] text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {t('contact.lead')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsappLogo size={19} weight="fill" />
                {t('contact.whatsapp')}
              </a>
              <button type="button" onClick={() => navigate('/build')} className="btn btn-ghost">
                {t('nav.cta')}
                <ArrowUpRight size={16} weight="bold" className="rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        </div>

        <div ref={listReveal} data-reveal className="mt-14">
          <p className="text-sm text-faint">{t('contact.direct')}</p>
          <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ label, value, href, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-gold transition-colors duration-200 can-hover:group-hover:border-gold-line">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-faint">{label}</span>
                    <span
                      dir="ltr"
                      className="block truncate font-medium text-ink underline-offset-4 can-hover:group-hover:underline"
                    >
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
