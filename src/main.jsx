import React from 'react';
import ReactDOM from 'react-dom/client';

// Self-hosted fonts (no runtime Google <link> in production).
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// Arabic display + body face (loaded once; used when dir="rtl").
import '@fontsource/cairo/500.css';
import '@fontsource/cairo/700.css';

import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
