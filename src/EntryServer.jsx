import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';

// Build-time only: renders the English home route to static HTML so the page
// paints before the JavaScript bundle arrives. See scripts/prerender.mjs.
export function render() {
  return renderToString(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
