import { m } from 'framer-motion';
import {
  Phone,
  WhatsappLogo,
  EnvelopeSimple,
  InstagramLogo,
  GithubLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import SectionHeading from './SectionHeading.jsx';
import { useLang } from '../i18n/LanguageProvider.jsx';

export default function Contact() {
  const { t } = useLang();

  const channels = [
    { label: t('contact.call'), value: '+20 155 288 6293', href: 'tel:+201552886293', Icon: Phone, external: false },
    { label: t('contact.whatsapp'), value: t('contact.whatsappValue'), href: 'https://wa.me/201552886293', Icon: WhatsappLogo, external: true },
    { label: t('contact.email'), value: 'ahoshos@icloud.com', href: 'mailto:ahoshos@icloud.com', Icon: EnvelopeSimple, external: false },
    { label: t('contact.instagram'), value: '@ahoshos993', href: 'https://instagram.com/ahoshos993', Icon: InstagramLogo, external: true },
    { label: t('contact.github'), value: 'ahmedbadway', href: 'https://github.com/ahmedbadway', Icon: GithubLogo, external: true },
  ];

  return (
    <section id="contact" className="cv-auto relative scroll-mt-24 py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          lead={t('contact.lead')}
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map(({ label, value, href, Icon, external }, i) => (
            <m.a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              data-magnetic
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group glass flex items-center justify-between gap-4 rounded-card p-6"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-bg">
                  <Icon size={22} weight="duotone" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-faint">{label}</p>
                  <p className="mt-1 font-display font-semibold tracking-tight text-ink" dir="ltr">
                    {value}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold rtl:-scale-x-100"
              />
            </m.a>
          ))}
        </div>
      </div>
    </section>
  );
}
