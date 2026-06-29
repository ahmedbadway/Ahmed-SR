import { motion } from 'framer-motion';
import {
  Phone,
  WhatsappLogo,
  EnvelopeSimple,
  InstagramLogo,
  GithubLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import SectionHeading from './SectionHeading.jsx';

const channels = [
  {
    label: 'Call',
    value: '+20 155 288 6293',
    href: 'tel:+201552886293',
    Icon: Phone,
    external: false,
  },
  {
    label: 'WhatsApp',
    value: 'Message me directly',
    href: 'https://wa.me/201552886293',
    Icon: WhatsappLogo,
    external: true,
  },
  {
    label: 'Email',
    value: 'ahoshos@icloud.com',
    href: 'mailto:ahoshos@icloud.com',
    Icon: EnvelopeSimple,
    external: false,
  },
  {
    label: 'Instagram',
    value: '@ahoshos993',
    href: 'https://instagram.com/ahoshos993',
    Icon: InstagramLogo,
    external: true,
  },
  {
    label: 'GitHub',
    value: 'ahmedbadway',
    href: 'https://github.com/ahmedbadway',
    Icon: GithubLogo,
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow="Contact"
          title="Have a project in mind? Let's build it."
          lead="Available for freelance work — luxury brands, clinics, e-commerce, and beyond. Pick whichever channel suits you."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map(({ label, value, href, Icon, external }, i) => (
            <motion.a
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
                  <p className="mt-1 font-display font-semibold tracking-tight text-ink">
                    {value}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
