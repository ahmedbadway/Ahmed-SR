import { lazy, Suspense, useEffect } from 'react';
import SiteBackdrop from './components/SiteBackdrop.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useLang } from './i18n/LanguageProvider.jsx';
import { getLenis } from './utils/lenis.js';

// The Build Your Design studio only renders on /build, so keep it out of the
// initial bundle and load it on demand.
const BuildYourDesign = lazy(() => import('./components/BuildYourDesign.jsx'));

export default function App() {
  useSmoothScroll();
  const route = useHashRoute();
  const { t } = useLang();
  const isBuild = route === '/build';

  // Reset scroll to the top whenever the route changes so a page swap never
  // lands mid-way down the new view. Route through Lenis when it's active.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [route]);

  return (
    <>
      <SiteBackdrop />
      {/* Observed by the nav to know when the page has left the top. */}
      <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6" />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-skip focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
      >
        {t('nav.skip')}
      </a>

      <Navbar route={route} />

      <main id="main" className="relative z-[var(--z-content)]">
        {isBuild ? (
          <Suspense fallback={<div className="min-h-[100dvh]" />}>
            <BuildYourDesign />
          </Suspense>
        ) : (
          <>
            <Hero />
            <Work />
            <Services />
            <Process />
            <About />
            <Contact />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
