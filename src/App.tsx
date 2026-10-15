import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useTheme } from './hooks/useTheme';
import { useLenis } from './hooks/useLenis';
import { useReducedMotionPreference } from './hooks/useReducedMotionPreference';

import Navbar from './components/Navbar';
import DragonFallback from './components/3d/DragonFallback';
import ScrollProgress from './components/ScrollProgress';
import ThemeToggle from './components/ThemeToggle';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import EnergyDivider from './components/ui/EnergyDivider';

import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const DragonScene = lazy(() => import('./components/3d/DragonScene'));

gsap.registerPlugin(ScrollTrigger);

function HomeLayout() {
  const { theme, toggle } = useTheme();
  const reducedMotion = useReducedMotionPreference();
  const [loading, setLoading] = useState(true);
  useLenis();

  useEffect(() => {
    const delay = reducedMotion ? 150 : 750;
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Unified GSAP ScrollTrigger section title narrative reveals (cleaned up via gsap.context)
  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section').forEach((sec) => {
        const titles = sec.querySelectorAll('.section-title');
        if (!titles.length) return;
        gsap.fromTo(
          titles,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 84%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <Loader show={loading} />
      <CustomCursor />
      <ScrollProgress />
      <Suspense fallback={<DragonFallback />}>
        <DragonScene theme={theme} />
      </Suspense>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <EnergyDivider label="PERFIL PROFESIONAL" />
        <About />
        <EnergyDivider label="ECOSISTEMA TÉCNICO" />
        <Skills />
        <EnergyDivider label="EXPERIENCIA & PROYECTOS" />
        <Experience />
        <EnergyDivider label="FORMACIÓN ACADÉMICA" />
        <Education />
        <EnergyDivider label="CREDENCIALES" />
        <Certifications />
        <EnergyDivider label="COMUNICACIÓN DIRECTA" />
        <Contact />
      </main>
      <Footer />
      <ThemeToggle theme={theme} toggle={toggle} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="*" element={<HomeLayout />} />
    </Routes>
  );
}
