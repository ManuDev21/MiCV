import { motion } from 'framer-motion';
import {
  FiCpu,
  FiLayers,
  FiServer,
  FiZap,
  FiMapPin,
  FiCode,
  FiCheckCircle,
} from 'react-icons/fi';
import { profile } from '../data/profile';
import HolographicCard from '../components/ui/HolographicCard';
import GlassPanel from '../components/ui/GlassPanel';

const pillars = [
  {
    icon: FiLayers,
    code: 'SYS // 01',
    title: 'Frontend Moderno',
    text: 'React, React Native, TypeScript y TailwindCSS con interfaces inmersivas, animaciones fluidas y arquitectura de componentes reutilizables.',
    accent: 'cyan' as const,
  },
  {
    icon: FiServer,
    code: 'SYS // 02',
    title: 'Backend Escalable',
    text: 'APIs robustas con NestJS, Node.js, GraphQL, Flask y Python conectadas a MySQL, PostgreSQL y MariaDB mediante TypeORM.',
    accent: 'violet' as const,
  },
  {
    icon: FiCpu,
    code: 'SYS // 03',
    title: 'Software Engineering',
    text: 'Modelado de datos, código limpio, control de versiones con Git/GitHub, rendimiento optimizado y mantenibilidad a largo plazo.',
    accent: 'cyan' as const,
  },
  {
    icon: FiZap,
    code: 'SYS // 04',
    title: 'UX/UI Experimental',
    text: 'Sistemas de diseño con Glassmorphism, profundidad 3D, microinteracciones reactivas y accesibilidad multi-dispositivo.',
    accent: 'magenta' as const,
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Editorial Narrative Column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="lg:col-span-6 min-w-0 space-y-6"
        >
          <span className="section-eyebrow">
            <FiCode /> // 01 • Identidad & Arquitectura
          </span>
          <h2 className="section-title">
            Ingeniería de software con{' '}
            <span className="text-gradient">visión creativa</span>
          </h2>

          <GlassPanel variant="crystal" neonBorder hudCorners className="p-6 sm:p-8">
            <p className="text-nexus-white/90 leading-relaxed text-base sm:text-lg font-grotesk">
              {profile.about}
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-nexus-muted">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-nexus-cyan" /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-nexus-cyan font-mono">
                <FiCheckCircle /> Full Stack Multiplataforma
              </span>
            </div>
          </GlassPanel>

          {/* Real Profile Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {profile.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="neu-surface rounded-2xl p-4 text-center border border-white/5 hover:border-nexus-cyan/35 transition"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-gradient">
                  {s.value}+
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-nexus-muted mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4 Holographic Engineering Pillars */}
        <div className="lg:col-span-6 min-w-0 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {pillars.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="h-full"
            >
              <HolographicCard
                glowColor={c.accent}
                badge={c.code}
                className="p-6 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl neu-pressed grid place-items-center text-2xl text-nexus-cyan group-hover:text-nexus-violet transition">
                    <c.icon />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-nexus-white">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-nexus-muted leading-relaxed">
                    {c.text}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-nexus-cyan/80">
                  <span>NEXUS CORE</span>
                  <span>ACTIVO</span>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
