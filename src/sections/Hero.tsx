import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiArrowRight,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiZap,
  FiTerminal,
} from 'react-icons/fi';
import { profile } from '../data/profile';
import InteractiveIDCard from '../components/3d/InteractiveIDCard';
import MagneticButton from '../components/ui/MagneticButton';
import { triggerDragonPulse, setDragonExcited } from '../hooks/usePointerPosition';

function useTyping(words: string[], speed = 65, pause = 1500) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = words[i % words.length];
    const t = setTimeout(
      () => {
        if (!del) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setDel(true), pause);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setDel(false);
            setI((v) => v + 1);
          }
        }
      },
      del ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}

export default function Hero() {
  const typed = useTyping(profile.roles);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Dynamic Ambient Spotlight */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      <div className="section !py-0 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* ==================== LEFT AREA: EDITORIAL IDENTITY ==================== */}
        <div className="lg:col-span-7 z-10">
          {/* Top HUD Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex flex-wrap items-center gap-3 px-4 py-1.5 rounded-full glass border border-nexus-cyan/25"
          >
            <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan animate-pulse" />
            <span className="font-display text-[11px] uppercase tracking-[0.28em] text-nexus-cyan">
              NEXUS // PORTAFOLIO OFICIAL
            </span>
            <span className="hidden sm:inline text-white/25">|</span>
            <button
              type="button"
              onClick={triggerDragonPulse}
              onMouseEnter={() => setDragonExcited(true)}
              onMouseLeave={() => setDragonExcited(false)}
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-grotesk text-nexus-muted hover:text-nexus-cyan transition"
            >
              <FiZap className="text-nexus-violet" /> Activar energía del dragón 3D
            </button>
          </motion.div>

          {/* Main Name Reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.04] tracking-tight mt-6"
          >
            <span className="block text-nexus-white/90 text-xl sm:text-2xl md:text-3xl font-medium tracking-widest uppercase mb-2">
              Hola, soy
            </span>
            <span className="text-gradient">Manuel</span>{' '}
            <span className="text-nexus-white">Rodríguez Calderón</span>
          </motion.h1>

          {/* Animated Role & Specialty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-5 flex items-center gap-3 text-lg sm:text-xl font-grotesk min-h-[2.2em]"
          >
            <FiTerminal className="text-nexus-cyan shrink-0" />
            <span className="text-gradient-electric font-semibold">{typed}</span>
            <span className="inline-block w-[2px] h-5 bg-nexus-cyan animate-pulse" />
          </motion.div>

          {/* Concise Executive Pitch from Real Profile */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-4 max-w-2xl text-sm sm:text-base text-nexus-muted leading-relaxed"
          >
            Arquitectura Full-Stack moderna con{' '}
            <span className="text-nexus-white font-medium">
              React, TypeScript, NestJS, Node.js, GraphQL y Python
            </span>
            . Construcción de plataformas escalables, sistemas administrativos y experiencias
            interactivas de alto rendimiento.
          </motion.p>

          {/* Verified Contact & Location Chips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-5 flex flex-wrap gap-2.5 text-xs sm:text-sm"
          >
            <span className="chip">
              <FiMapPin className="text-nexus-cyan" /> {profile.location}
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="chip hover:border-nexus-cyan/50 transition"
            >
              <FiMail className="text-nexus-violet" /> {profile.email}
            </a>
          </motion.div>

          {/* Primary CTA Actions with Magnetic Physics */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href={profile.cv} download variant="primary">
              <FiDownload /> Descargar CV
            </MagneticButton>
            <MagneticButton href="#experience" variant="ghost">
              Ver Proyectos <FiArrowRight />
            </MagneticButton>
            <MagneticButton href="#contact" variant="neu">
              Contactar <FiMail />
            </MagneticButton>
          </motion.div>

          {/* Social & Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-9 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-xl neu-button grid place-items-center text-lg text-nexus-white hover:text-nexus-cyan"
              >
                <FiGithub />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-xl neu-button grid place-items-center text-lg text-nexus-white hover:text-nexus-violet"
              >
                <FiLinkedin />
              </a>
              <button
                type="button"
                onClick={triggerDragonPulse}
                aria-label="Emitir pulso eléctrico en el dragón 3D"
                className="px-3.5 h-11 rounded-xl neu-button inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-nexus-cyan"
              >
                <FiZap className="text-nexus-violet" /> Pulso 3D
              </button>
            </div>

            <div className="flex items-center gap-6">
              {profile.stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="font-display text-xl sm:text-2xl font-bold text-gradient">
                    {s.value}+
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ==================== RIGHT AREA: DRAGGABLE HOLOGRAPHIC ID CARD ==================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, type: 'spring', damping: 20 }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center z-20"
        >
          <InteractiveIDCard />
        </motion.div>
      </div>
    </section>
  );
}
