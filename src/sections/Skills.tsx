import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { skills } from '../data/profile';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="text-center" data-aos="fade-up">
        <span className="section-eyebrow">// Stack</span>
        <h2 className="section-title mt-3">
          Tecnologías & <span className="text-gradient">Skills</span>
        </h2>
        <p className="mt-4 text-white/65 max-w-2xl mx-auto font-grotesk">
          Herramientas con las que diseño, construyo y desplegamos productos digitales modernos.
        </p>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-6">
        {Object.entries(skills).map(([category, items], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="relative glass rounded-2xl p-6 neon-border"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl">{category}</h3>
              <span className="text-xs text-white/50">{items.length} skills</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((s, i) => (
                <Tilt key={s.name} tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.2} glareColor="#22d3ee">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-4 group hover:shadow-neon-cyan transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <s.icon className="text-2xl text-neon-cyan group-hover:text-neon-purple transition" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{s.name}</span>
                          <span className="text-[11px] text-white/55">{s.level}%</span>
                        </div>
                        <div className="skill-bar mt-2">
                          <motion.span
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
