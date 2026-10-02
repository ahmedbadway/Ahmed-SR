import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

// Self-hosted variable fonts (no runtime Google <link>). AB Sans (declared in
// index.css) sets all Latin text, and its width axis turns the same family
// into the display face. Arabic glyphs fall through via unicode-range (Reem
// Kufi for headings, Alexandria for text), so the Arabic files only download
// when Arabic is on screen. Geist Mono sets small figures and labels.
import '@fontsource-variable/reem-kufi';
import '@fontsource-variable/alexandria';
import '@fontsource-variable/geist-mono';

import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';
import './styles/index.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

// The HTML ships prerendered (scripts/prerender.mjs) for the English home
// route, so first paint does not wait for JavaScript. Hydrate when the
// visitor will see exactly that markup; otherwise (Arabic, or a deep link to
// #/build) render fresh so React never patches a mismatched tree.
let storedLang = null;
try {
  storedLang = window.localStorage.getItem('ab-lang');
} catch {
  /* storage disabled */
}
const onHome = !window.location.hash.replace(/^#/, '').startsWith('/build');
const canHydrate = container.hasChildNodes() && onHome && storedLang !== 'ar';

if (canHydrate) {
  hydrateRoot(container, app);
} else {
  container.textContent = '';
  createRoot(container).render(app);
}
