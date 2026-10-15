import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiCode,
  FiDownload,
  FiZap,
  FiHome,
  FiUser,
  FiLayers,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiMail,
} from 'react-icons/fi';
import { profile } from '../data/profile';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

const links = [
  { href: '#hero', id: 'hero', label: 'Inicio', icon: FiHome },
  { href: '#about', id: 'about', label: 'Perfil', icon: FiUser },
  { href: '#skills', id: 'skills', label: 'Skills', icon: FiLayers },
  { href: '#experience', id: 'experience', label: 'Proyectos', icon: FiBriefcase },
  { href: '#education', id: 'education', label: 'Educación', icon: FiBookOpen },
  { href: '#certifications', id: 'certifications', label: 'Certificados', icon: FiAward },
  { href: '#contact', id: 'contact', label: 'Contacto', icon: FiMail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

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

  // Lock body scroll when mobile menu is open and close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && open) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-3 sm:py-4'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-10">
          <div
            className={`flex items-center justify-between gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 ${
              scrolled || open
                ? 'glass-crystal neon-border shadow-[0_14px_34px_rgba(3,4,7,0.55)]'
                : 'glass border border-nexus-border'
            }`}
          >
            {/* Brand Logo */}
            <a
              href="#hero"
              onClick={() => {
                setOpen(false);
                triggerDragonPulse();
              }}
              className="flex items-center gap-2 sm:gap-2.5 py-1 min-w-0 group"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-button grid place-items-center text-nexus-cyan group-hover:text-nexus-violet transition shrink-0">
                <FiCode className="text-base sm:text-lg" />
              </span>
              <div className="leading-none truncate">
                <span className="block font-display tracking-[0.18em] sm:tracking-[0.22em] text-xs sm:text-sm font-bold text-gradient truncate">
                  MRC.NEXUS
                </span>
                <span className="block text-[8px] sm:text-[9px] font-mono tracking-widest text-nexus-muted mt-0.5 truncate">
                  FULL STACK DEV
                </span>
              </div>
            </a>

            {/* Desktop Navigation Pills */}
            <nav
              aria-label="Navegación principal"
              className="hidden lg:flex items-center gap-1 p-1 rounded-full neu-pressed"
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

            {/* Desktop Right Action Controls */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
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

            {/* Mobile & Tablet Action Bar */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <a
                href={profile.cv}
                download
                aria-label="Descargar CV en PDF"
                className="neu-button px-2.5 py-2 rounded-xl text-[11px] font-mono inline-flex items-center gap-1 text-nexus-cyan"
              >
                <FiDownload size={14} />
                <span className="hidden xs:inline">CV</span>
              </a>
              <button
                type="button"
                className="w-10 h-10 rounded-xl neu-button grid place-items-center text-nexus-white"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                aria-expanded={open}
              >
                {open ? <FiX size={20} className="text-nexus-cyan" /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating Command Deck (No horizontal off-screen translation -> zero viewport overflow) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/65 backdrop-blur-sm z-40"
            />
            <motion.nav
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              aria-label="Menú móvil"
              className="lg:hidden fixed top-[4.4rem] inset-x-3 sm:inset-x-6 max-h-[calc(100dvh-5.2rem)] overflow-y-auto glass-crystal neon-border rounded-2xl z-50 p-4 sm:p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-nexus-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan animate-pulse" />
                  <span className="font-display text-[11px] tracking-[0.24em] uppercase text-gradient font-bold">
                    NAVEGACIÓN NEXUS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-nexus-muted">
                  7 SECCIONES
                </span>
              </div>

              {/* 2-Column Ergonomic Grid for Mobile Thumb Reach */}
              <div className="grid grid-cols-2 gap-2">
                {links.map((l) => {
                  const isActive = activeSection === l.id;
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 transition ${
                        isActive
                          ? 'bg-gradient-to-r from-nexus-violet/30 to-nexus-cyan/25 border border-nexus-cyan/45 text-nexus-white shadow-neon-cyan'
                          : 'neu-surface text-nexus-muted hover:text-nexus-white'
                      } ${l.id === 'contact' ? 'col-span-2 justify-center' : ''}`}
                    >
                      <Icon
                        className={`text-base shrink-0 ${
                          isActive ? 'text-nexus-cyan' : 'text-nexus-violet'
                        }`}
                      />
                      <span className="truncate">{l.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-4 pt-3.5 border-t border-nexus-border grid grid-cols-2 gap-2.5">
                <a
                  href={profile.cv}
                  download
                  onClick={() => setOpen(false)}
                  className="btn-ghost !py-2.5 !px-3 w-full justify-center text-xs"
                >
                  <FiDownload /> Descargar CV
                </a>
                <a
                  href="#contact"
                  onClick={() => {
                    setOpen(false);
                    triggerDragonPulse();
                  }}
                  className="btn-primary !py-2.5 !px-3 w-full justify-center text-xs"
                >
                  <FiZap /> Contactar
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
