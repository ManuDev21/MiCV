import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FiDownload, FiArrowRight, FiMail, FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi';
import { profile } from '../data/profile';

function useTyping(words: string[], speed = 70, pause = 1400) {
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
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      <div className="absolute inset-0 spotlight pointer-events-none" />
      <div className="section !py-0 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-eyebrow"
          >
            ◇ Portafolio • 2026
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mt-4"
          >
            Hola, soy <span className="text-gradient">Manuel</span>
            <br />
            Rodríguez Calderón
          </motion.h1>
          <p className="mt-6 text-lg text-white/70 font-grotesk min-h-[2.2em]">
            <span className="text-gradient">{typed}</span>
            <span className="inline-block w-[2px] h-5 bg-neon-cyan ml-1 align-middle animate-pulse" />
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="chip"><FiMapPin /> {profile.location}</span>
            <span className="chip"><FiMail /> {profile.email}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href={profile.cv} download className="btn-primary">
              <FiDownload /> Descargar CV
            </a>
            <a href="#experience" className="btn-ghost">
              Ver Proyectos <FiArrowRight />
            </a>
            <a href="#contact" className="btn-ghost">
              Contactar <FiMail />
            </a>
          </motion.div>

          <div className="mt-8 flex items-center gap-4 text-xl text-white/70">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-neon-cyan transition"><FiGithub /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-neon-purple transition"><FiLinkedin /></a>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <Tilt
            glareEnable
            glareMaxOpacity={0.25}
            glareColor="#22d3ee"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            transitionSpeed={1200}
            className="rounded-full"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, type: 'spring' }}
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full p-[3px] bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-pink animate-glow"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-deep">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -inset-6 rounded-full border border-white/10 animate-float" />
              <div className="absolute -inset-12 rounded-full border border-white/5" />
            </motion.div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
