import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayers, FiCheck } from 'react-icons/fi';
import { skills, Skill } from '../data/profile';
import HolographicCard from '../components/ui/HolographicCard';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

const ALL_TAB = 'Todas';

function getMasteryLabel(level: number): string {
  if (level >= 90) return 'Dominio Avanzado';
  if (level >= 80) return 'Dominio Sólido';
  return 'Experiencia Práctica';
}

export default function Skills() {
  const categories = useMemo(() => [ALL_TAB, ...Object.keys(skills)], []);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_TAB);
  const [selectedSkill, setSelectedSkill] = useState<string | null>('React');

  const filteredEntries = useMemo(() => {
    if (activeCategory === ALL_TAB) {
      return Object.entries(skills);
    }
    return Object.entries(skills).filter(([cat]) => cat === activeCategory);
  }, [activeCategory]);

  const totalCount = useMemo(
    () => Object.values(skills).reduce((acc, arr) => acc + arr.length, 0),
    []
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    triggerDragonPulse();
  };

  return (
    <section id="skills" className="section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="section-eyebrow">
            <FiLayers /> // 02 • Ecosistema Tecnológico
          </span>
          <h2 className="section-title mt-3">
            Stack & <span className="text-gradient">Capacidades</span>
          </h2>
          <p className="mt-3 text-nexus-muted max-w-2xl font-grotesk text-sm sm:text-base">
            Tecnologías empleadas en el diseño, desarrollo y despliegue de aplicaciones
            web, móviles y sistemas empresariales.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filtrar tecnologías por categoría"
          className="flex flex-wrap gap-2 p-1.5 rounded-2xl neu-pressed border border-white/5 self-start"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            const count =
              cat === ALL_TAB ? totalCount : skills[cat]?.length ?? 0;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-display tracking-wider uppercase transition ${
                  active
                    ? 'text-nexus-white'
                    : 'text-nexus-muted hover:text-nexus-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="skills-filter-pill"
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-nexus-violet/40 to-nexus-cyan/30 border border-nexus-cyan/45 shadow-neon-cyan"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat}
                  <span className="text-[10px] opacity-70 font-mono">({count})</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Panels */}
      <div className="mt-12 grid lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map(([category, items]: [string, Skill[]], idx) => (
            <motion.div
              key={category}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className={
                filteredEntries.length === 1 ? 'lg:col-span-2' : ''
              }
            >
              <HolographicCard
                maxTilt={5}
                glowColor={idx % 2 === 0 ? 'cyan' : 'violet'}
                className="p-6 sm:p-7"
              >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-nexus-cyan">
                      MÓDULO // 0{idx + 1}
                    </span>
                    <h3 className="font-display text-xl font-bold text-nexus-white mt-0.5">
                      {category}
                    </h3>
                  </div>
                  <span className="chip font-mono text-[11px]">
                    {items.length} tecnologías
                  </span>
                </div>

                <div
                  className={`grid gap-3.5 ${
                    filteredEntries.length === 1
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : 'sm:grid-cols-2'
                  }`}
                >
                  {items.map((s) => {
                    const isSelected = selectedSkill === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setSelectedSkill(s.name);
                          triggerDragonPulse();
                        }}
                        className={`text-left rounded-xl p-4 transition-all duration-300 border ${
                          isSelected
                            ? 'glass-strong border-nexus-cyan/60 shadow-neon-cyan'
                            : 'neu-surface border-white/5 hover:border-nexus-violet/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-lg grid place-items-center text-xl shrink-0 transition ${
                              isSelected
                                ? 'bg-nexus-cyan/20 text-nexus-cyan shadow-neon-cyan'
                                : 'neu-pressed text-nexus-cyan group-hover:text-nexus-violet'
                            }`}
                          >
                            <s.icon />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-nexus-white truncate">
                                {s.name}
                              </span>
                              <span className="text-[11px] font-mono text-nexus-cyan">
                                {s.level}%
                              </span>
                            </div>
                            <div className="text-[10px] text-nexus-muted mt-0.5 flex items-center justify-between">
                              <span>{getMasteryLabel(s.level)}</span>
                              {isSelected && (
                                <FiCheck className="text-nexus-cyan inline" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="skill-bar mt-3" aria-hidden="true">
                          <motion.span
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
