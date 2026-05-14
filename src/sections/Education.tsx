import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import { education } from '../data/profile';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="text-center" data-aos="fade-up">
        <span className="section-eyebrow">// Formación</span>
        <h2 className="section-title mt-3">
          <span className="text-gradient">Educación</span>
        </h2>
      </div>

      <div className="mt-14 max-w-3xl mx-auto relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple to-neon-cyan opacity-60" />
        {education.map((e, i) => (
          <motion.div
            key={e.title}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="relative pl-16 mb-10"
          >
            <span className="absolute left-2 top-1.5 w-7 h-7 rounded-full glass-strong grid place-items-center shadow-neon">
              <FiBookOpen className="text-neon-cyan" />
            </span>
            <div className="glass rounded-2xl p-6 neon-border">
              <div className="text-xs uppercase tracking-widest text-neon-cyan">{e.period}</div>
              <h3 className="mt-2 font-display text-lg">{e.title}</h3>
              <p className="text-sm text-white/65 mt-1">{e.school}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
