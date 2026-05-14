import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCode } from 'react-icons/fi';

const links = [
  { href: '#hero', label: 'Inicio' },
  { href: '#about', label: 'Perfil' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#education', label: 'Educación' },
  { href: '#certifications', label: 'Certificaciones' },
  { href: '#contact', label: 'Contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between rounded-2xl ${
          scrolled ? 'glass-strong shadow-neon-purple/30' : ''
        } transition-all`}
      >
        <a href="#hero" className="flex items-center gap-2 py-3">
          <FiCode className="text-neon-cyan text-xl" />
          <span className="font-display tracking-widest text-sm text-gradient">MRC.DEV</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-white/70 hover:text-white transition relative group"
            >
              {l.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-to-r from-neon-purple to-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex btn-primary !py-2 !px-5 text-sm">
          Hablemos
        </a>
        <button
          className="md:hidden p-3 text-white"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <FiMenu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="md:hidden fixed top-0 right-0 h-full w-72 glass-strong z-50 p-6 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-gradient">Menú</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar">
                <FiX size={22} />
              </button>
            </div>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 rounded-lg hover:bg-white/5 text-white/85"
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-4 justify-center">
              Hablemos
            </a>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
