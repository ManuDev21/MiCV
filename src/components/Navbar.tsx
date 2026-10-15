import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCode, FiDownload, FiZap } from 'react-icons/fi';
import { profile } from '../data/profile';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

const links = [
  { href: '#hero', id: 'hero', label: 'Inicio' },
  { href: '#about', id: 'about', label: 'Perfil' },
  { href: '#skills', id: 'skills', label: 'Skills' },
  { href: '#experience', id: 'experience', label: 'Experiencia' },
  { href: '#education', id: 'education', label: 'Educación' },
  { href: '#certifications', id: 'certifications', label: 'Certificaciones' },
  { href: '#contact', id: 'contact', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const scrollPos = window.scrollY + window.innerHeight * 0.32;
      for (let i = links.length - 1; i >= 0; i--) {
        const el = document.getElementById(links[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(links[i].id);
          break;
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'glass-crystal neon-border shadow-[0_16px_40px_rgba(3,4,7,0.85)]'
              : 'glass border border-white/10'
          }`}
        >
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={triggerDragonPulse}
            className="flex items-center gap-2.5 py-1 group"
          >
            <span className="w-9 h-9 rounded-xl neu-button grid place-items-center text-nexus-cyan group-hover:text-nexus-violet transition">
              <FiCode className="text-lg" />
            </span>
            <div className="leading-none">
              <span className="block font-display tracking-[0.22em] text-xs sm:text-sm font-bold text-gradient">
                MRC.NEXUS
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-nexus-muted mt-0.5">
                FULL STACK DEV
              </span>
            </div>
          </a>

          {/* Desktop Navigation Pills */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 p-1 rounded-full neu-pressed border border-white/5"
          >
            {links.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-nexus-white'
                      : 'text-nexus-muted hover:text-nexus-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nexus-nav-pill"
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-nexus-violet/35 to-nexus-cyan/30 border border-nexus-cyan/40 shadow-neon-cyan"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={profile.cv}
              download
              className="neu-button px-3.5 py-2 rounded-full text-xs font-medium inline-flex items-center gap-1.5 text-nexus-white hover:text-nexus-cyan"
            >
              <FiDownload className="text-nexus-cyan" /> CV
            </a>
            <a
              href="#contact"
              onClick={triggerDragonPulse}
              className="btn-primary !py-2 !px-5 text-xs font-display uppercase tracking-wider"
            >
              <FiZap /> Hablemos
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-xl neu-button grid place-items-center text-nexus-white"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={open}
          >
            <FiMenu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              aria-label="Menú móvil"
              className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-crystal border-l border-nexus-cyan/25 z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan" />
                    <span className="font-display text-xs tracking-[0.25em] text-gradient">
                      NEXUS MENU
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar menú"
                    className="w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-white"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  {links.map((l) => {
                    const isActive = activeSection === l.id;
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-between transition ${
                          isActive
                            ? 'bg-gradient-to-r from-nexus-violet/25 to-nexus-cyan/20 border border-nexus-cyan/35 text-nexus-white'
                            : 'hover:bg-white/5 text-nexus-muted hover:text-nexus-white'
                        }`}
                      >
                        <span>{l.label}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={profile.cv}
                  download
                  onClick={() => setOpen(false)}
                  className="btn-ghost w-full justify-center text-xs"
                >
                  <FiDownload /> Descargar CV Oficial
                </a>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center text-xs"
                >
                  <FiZap /> Hablemos
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
