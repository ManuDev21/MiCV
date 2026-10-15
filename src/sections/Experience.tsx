import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBriefcase,
  FiX,
  FiArrowUpRight,
  FiCheckCircle,
  FiLayers,
  FiCalendar,
} from 'react-icons/fi';
import { experience } from '../data/profile';
import HolographicCard from '../components/ui/HolographicCard';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

export default function Experience() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedInline, setExpandedInline] = useState<number | null>(0);

  const openDetailsModal = (idx: number) => {
    setSelectedIndex(idx);
    triggerDragonPulse();
  };

  return (
    <section id="experience" className="section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="section-eyebrow">
          <FiBriefcase /> // 03 • Trayectoria & Sistemas Construidos
        </span>
        <h2 className="section-title mt-3">
          Experiencia & <span className="text-gradient">Proyectos</span>
        </h2>
        <p className="mt-3 text-nexus-muted text-sm sm:text-base font-grotesk">
          Sistemas reales desarrollados de extremo a extremo: desde plataformas de
          administración deportiva hasta experiencias web inmersivas y comercio electrónico.
        </p>
      </div>

      {/* Luminous Energy Timeline */}
      <div className="relative mt-16 max-w-5xl mx-auto">
        {/* Central / Left Energy Conduit Line */}
        <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-nexus-cyan via-nexus-violet to-nexus-magenta opacity-70 shadow-neon-cyan" />

        {experience.map((exp, i) => {
          const isLeft = i % 2 === 0;
          const isExpanded = expandedInline === i;

          return (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-start ${
                isLeft ? '' : 'md:[&>div:first-child]:order-2'
              }`}
            >
              {/* Timeline Node Orb */}
              <button
                type="button"
                aria-label={`Seleccionar ${exp.title}`}
                onClick={() => {
                  setExpandedInline(isExpanded ? null : i);
                  triggerDragonPulse();
                }}
                className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 z-20 w-5 h-5 rounded-full bg-nexus-void border-2 border-nexus-cyan shadow-neon-cyan grid place-items-center group"
              >
                <span className="w-2 h-2 rounded-full bg-nexus-cyan group-hover:scale-125 transition" />
              </button>

              <div className={`pl-12 md:pl-0 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                <HolographicCard
                  maxTilt={6}
                  glowColor={i === 0 ? 'cyan' : i === 1 ? 'violet' : 'magenta'}
                  badge={`PRJ // 0${i + 1}`}
                  className="p-6 sm:p-7"
                >
                  {/* Period & Context Header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-nexus-cyan">
                    <FiCalendar />
                    <span>{exp.period}</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-nexus-white">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-nexus-violet mt-1">
                    {exp.company}
                  </p>

                  <p className="mt-3.5 text-sm text-nexus-muted leading-relaxed">
                    {exp.summary}
                  </p>

                  {/* Expandable Inline Architectural Highlights */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-3.5 border-t border-white/10 space-y-2 overflow-hidden"
                      >
                        {exp.details.map((d) => (
                          <li
                            key={d}
                            className="flex items-start gap-2 text-xs sm:text-sm text-nexus-white/85"
                          >
                            <FiCheckCircle className="text-nexus-cyan mt-0.5 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  {/* Tech Stack Chips */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <span key={t} className="chip text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Actions */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setExpandedInline(isExpanded ? null : i)}
                      className="text-xs font-mono uppercase tracking-wider text-nexus-muted hover:text-nexus-white transition"
                    >
                      {isExpanded ? 'Ocultar puntos clave' : 'Desplegar puntos clave'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openDetailsModal(i)}
                      className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-nexus-cyan hover:text-nexus-violet transition"
                    >
                      Inspeccionar <FiArrowUpRight className="text-sm" />
                    </button>
                  </div>
                </HolographicCard>
              </div>

              <div className="hidden md:block" />
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Project Inspection Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-nexus-void/80 backdrop-blur-lg grid place-items-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="exp-modal-title"
              className="relative max-w-xl w-full glass-crystal neon-border hud-corners rounded-2xl p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-muted hover:text-nexus-white"
                aria-label="Cerrar detalles"
              >
                <FiX size={18} />
              </button>

              <span className="section-eyebrow">
                <FiLayers /> {experience[selectedIndex].period}
              </span>
              <h3
                id="exp-modal-title"
                className="mt-2 font-display text-2xl font-bold text-nexus-white"
              >
                {experience[selectedIndex].title}
              </h3>
              <p className="text-sm text-nexus-cyan mt-1">
                {experience[selectedIndex].company}
              </p>

              <p className="mt-4 text-sm text-nexus-muted leading-relaxed">
                {experience[selectedIndex].summary}
              </p>

              <div className="mt-5 pt-4 border-t border-white/10">
                <h4 className="text-xs font-display uppercase tracking-widest text-nexus-white/80 mb-3">
                  Arquitectura & Entregables
                </h4>
                <ul className="space-y-2.5 text-sm text-nexus-white/90">
                  {experience[selectedIndex].details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <FiCheckCircle className="text-nexus-cyan mt-1 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {experience[selectedIndex].tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
