import { ArrowUp } from '@phosphor-icons/react';
import { scrollToId } from '../utils/scrollToId.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="shell flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg font-bold tracking-tightest text-ink">
            Ahmed Badway
          </p>
          <p className="mt-1 text-sm text-faint">
            Built with React · Vite · Framer Motion
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-faint">© {year} — Mansoura, Egypt</span>
          <button
            data-magnetic
            onClick={() => scrollToId('main')}
            className="group flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-ink"
          >
            Back to top
            <ArrowUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
