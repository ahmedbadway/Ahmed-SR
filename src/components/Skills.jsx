import { motion, useReducedMotion } from 'framer-motion';
import {
  Atom,
  Wind,
  FilmReel,
  Lightning,
  GithubLogo,
  Sparkle,
  Translate,
  DeviceMobile,
} from '@phosphor-icons/react';
import SectionHeading from './SectionHeading.jsx';

const skills = [
  { label: 'React', Icon: Atom },
  { label: 'Tailwind CSS', Icon: Wind },
  { label: 'Framer Motion', Icon: FilmReel },
  { label: 'Vite', Icon: Lightning },
  { label: 'GitHub Pages', Icon: GithubLogo },
  { label: 'Higgsfield AI', Icon: Sparkle },
  { label: 'Arabic / English', Icon: Translate },
  { label: 'Mobile-First', Icon: DeviceMobile },
];

export default function Skills() {
  const reduce = useReducedMotion();
  return (
    <section id="skills" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="shell">
        <SectionHeading title="The toolkit behind the work." />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map(({ label, Icon }, i) => (
            <motion.div
              key={label}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                reduce
                  ? { duration: 0.4, delay: i * 0.05 }
                  : {
                      delay: i * 0.05,
                      type: 'spring',
                      stiffness: 460,
                      damping: 17,
                    }
              }
              whileHover={{ y: -6 }}
              data-magnetic
              className="glass flex items-center gap-3 rounded-card px-5 py-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                <Icon size={20} weight="duotone" />
              </span>
              <span className="font-display text-sm font-semibold tracking-tight text-ink sm:text-base">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
