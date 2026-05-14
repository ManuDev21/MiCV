import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { certifications } from '../data/profile';

export default function Certifications() {
  const view = (name: string) => {
    Swal.fire({
      title: name,
      text: 'Vista previa del certificado (placeholder).',
      icon: 'info',
      background: '#0a0a0f',
      color: '#fff',
      confirmButtonColor: '#a855f7',
    });
  };

  return (
    <section id="certifications" className="section">
      <div className="text-center" data-aos="fade-up">
        <span className="section-eyebrow">// Logros</span>
        <h2 className="section-title mt-3">
          <span className="text-gradient">Certificaciones</span>
        </h2>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((c, i) => (
          <Tilt
            key={c.name}
            tiltMaxAngleX={14}
            tiltMaxAngleY={14}
            glareEnable
            glareMaxOpacity={0.3}
            glareColor="#ec4899"
            transitionSpeed={1500}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative holo rounded-2xl p-6 overflow-hidden neon-border"
            >
              <FiAward className="text-3xl text-neon-cyan" />
              <h3 className="mt-4 font-display text-lg leading-snug">{c.name}</h3>
              <p className="text-xs text-white/65 mt-1">{c.issuer}</p>
              <button
                onClick={() => view(c.name)}
                className="mt-5 inline-flex items-center gap-2 text-sm text-neon-purple hover:text-neon-cyan transition"
              >
                Ver certificado <FiExternalLink />
              </button>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
