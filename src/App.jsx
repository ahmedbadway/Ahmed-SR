import GradientMesh from './components/GradientMesh.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <CustomCursor />
      <GradientMesh />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
