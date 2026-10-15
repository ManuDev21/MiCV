import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiAward, FiCheckCircle } from 'react-icons/fi';
import { education } from '../data/profile';
import HolographicCard from '../components/ui/HolographicCard';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="text-center max-w-3xl mx-auto">
        <span className="section-eyebrow">
          <FiBookOpen /> // 04 • Trayectoria Académica
        </span>
        <h2 className="section-title mt-3">
          Formación & <span className="text-gradient">Educación</span>
        </h2>
        <p className="mt-3 text-nexus-muted text-sm sm:text-base font-grotesk">
          Base académica enfocada en ingeniería de software multiplataforma,
          algoritmia, bases de datos y arquitectura de aplicaciones.
        </p>
      </div>

      <div className="mt-10 sm:mt-14 max-w-4xl mx-auto relative">
        {/* Vertical Holographic Spine */}
        <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-nexus-violet via-nexus-cyan to-transparent opacity-65 shadow-neon-cyan" />

        <div className="space-y-6 sm:space-y-8">
          {education.map((e, i) => {
            const isCurrent = e.period.toLowerCase().includes('presente');
            return (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative pl-11 sm:pl-20 min-w-0"
              >
                {/* Node Icon */}
                <span className="absolute left-0.5 sm:left-4 top-5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl glass-strong border border-nexus-cyan/45 grid place-items-center shadow-neon-cyan">
                  <FiBookOpen className="text-nexus-cyan text-xs sm:text-sm" />
                </span>

                <HolographicCard
                  maxTilt={5}
                  glowColor={isCurrent ? 'cyan' : 'violet'}
                  badge={isCurrent ? 'EN CURSO' : 'FINALIZADO'}
                  className="p-4 sm:p-7"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-nexus-cyan">
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar /> {e.period}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="inline-flex items-center gap-1 text-nexus-muted">
                      {isCurrent ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                          Formación Superior Activa
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="text-nexus-violet" />
                          Programa Concluido
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-nexus-white">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 text-sm sm:text-base text-nexus-muted flex items-center gap-2">
                    <FiAward className="text-nexus-violet shrink-0" />
                    <span>{e.school}</span>
                  </p>
                </HolographicCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
