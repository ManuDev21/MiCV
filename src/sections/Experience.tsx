import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiX, FiArrowUpRight } from 'react-icons/fi';
import { experience } from '../data/profile';

export default function Experience() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="experience" className="section">
      <div className="text-center" data-aos="fade-up">
        <span className="section-eyebrow">// Trayectoria</span>
        <h2 className="section-title mt-3">
          Experiencia & <span className="text-gradient">Proyectos</span>
        </h2>
      </div>

      <div className="relative mt-16 max-w-4xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-cyan to-neon-pink opacity-60" />

        {experience.map((exp, i) => {
          const left = i % 2 === 0;
          return (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative mb-12 md:grid md:grid-cols-2 md:gap-12 ${left ? '' : 'md:[&>div:first-child]:order-2'}`}
            >
              <div className={`pl-12 md:pl-0 ${left ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan shadow-neon mt-2" />
                <div className="glass rounded-2xl p-6 neon-border hover:shadow-neon transition-all">
                  <div className="flex items-center gap-2 text-xs text-neon-cyan uppercase tracking-widest">
                    <FiBriefcase /> {exp.period}
                  </div>
                  <h3 className="mt-2 font-display text-xl">{exp.title}</h3>
                  <p className="text-sm text-white/60">{exp.company}</p>
                  <p className="mt-3 text-sm text-white/75">{exp.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-start md:justify-end">
                    {exp.tags.map((t) => (
                      <span key={t} className="chip text-[11px]">{t}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => setOpen(i)}
                    className="mt-5 inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-purple transition"
                  >
                    Ver detalles <FiArrowUpRight />
                  </button>
                </div>
              </div>
              <div className="hidden md:block" />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full glass-strong neon-border rounded-2xl p-7"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
                aria-label="Cerrar"
              >
                <FiX size={22} />
              </button>
              <span className="section-eyebrow">{experience[open].period}</span>
              <h3 className="mt-2 font-display text-2xl">{experience[open].title}</h3>
              <p className="text-sm text-white/60">{experience[open].company}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/80 list-disc list-inside">
                {experience[open].details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {experience[open].tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
