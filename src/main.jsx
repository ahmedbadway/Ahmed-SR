import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

// Self-hosted variable fonts (no runtime Google <link>). Geist sets Latin
// text; Arabic glyphs fall through to Alexandria via unicode-range, so the
// Arabic file only downloads when Arabic text is on screen.
import '@fontsource-variable/geist';
import '@fontsource-variable/alexandria';

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
