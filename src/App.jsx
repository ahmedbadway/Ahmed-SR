import { useEffect } from 'react';
import GradientMesh from './components/GradientMesh.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import BuildYourDesign from './components/BuildYourDesign.jsx';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { getLenis } from './utils/lenis.js';

export default function App() {
  useSmoothScroll();
  const route = useHashRoute();
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
      <GradientMesh />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Navbar route={route} />

      <main id="main" className="relative z-10">
        {isBuild ? (
          <BuildYourDesign />
        ) : (
          <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
