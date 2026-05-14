import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useTheme } from './hooks/useTheme';
import { useLenis } from './hooks/useLenis';

import Navbar from './components/Navbar';
import ParticlesBG from './components/ParticlesBG';
import ScrollProgress from './components/ScrollProgress';
import ThemeToggle from './components/ThemeToggle';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';

import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function HomeLayout() {
  const { theme, toggle } = useTheme();
  const [loading, setLoading] = useState(true);
  useLenis();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic', offset: 60 });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Spotlight tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // GSAP section reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section').forEach((sec) => {
        gsap.from(sec.querySelectorAll('.section-title'), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sec, start: 'top 80%' },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Loader show={loading} />
      <CustomCursor />
      <ScrollProgress />
      <ParticlesBG />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Certifications />
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
