import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FiCpu, FiLayers, FiServer, FiZap } from 'react-icons/fi';
import { profile } from '../data/profile';

const cards = [
  { icon: FiLayers, title: 'Frontend Moderno', text: 'React, TypeScript, Tailwind, animaciones premium con Framer Motion y GSAP.' },
  { icon: FiServer, title: 'Backend Escalable', text: 'NestJS, Node.js, GraphQL, TypeORM con MySQL/PostgreSQL/MariaDB.' },
  { icon: FiCpu, title: 'Software Engineering', text: 'Arquitectura limpia, patrones, performance y código mantenible.' },
  { icon: FiZap, title: 'UX/UI Premium', text: 'Diseño futurista, glassmorphism, microinteracciones y accesibilidad.' },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div data-aos="fade-right">
          <span className="section-eyebrow">// Perfil</span>
          <h2 className="section-title mt-3">
            Sobre <span className="text-gradient">mí</span>
          </h2>
          <p className="mt-6 text-white/75 leading-relaxed text-base md:text-lg font-grotesk">
            {profile.about}
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="font-display text-2xl md:text-3xl text-gradient">{s.value}+</div>
                <div className="text-[11px] uppercase tracking-widest text-white/60 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5" data-aos="fade-left">
          {cards.map((c, i) => (
            <Tilt key={c.title} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.15} glareColor="#a855f7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative glass rounded-2xl p-6 h-full neon-border group hover:shadow-neon transition-all"
              >
                <c.icon className="text-2xl text-neon-cyan group-hover:text-neon-purple transition" />
                <h3 className="mt-4 font-display text-lg">{c.title}</h3>
                <p className="mt-2 text-sm text-white/70">{c.text}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
