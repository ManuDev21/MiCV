import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiUser,
  FiMessageSquare,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { profile } from '../data/profile';

const channels = [
  { icon: FiMail, label: 'Correo', value: profile.email, href: `mailto:${profile.email}` },
  { icon: FiPhone, label: 'Teléfono', value: profile.phone, href: `tel:${profile.phone}` },
  { icon: FiMapPin, label: 'Ubicación', value: profile.location, href: '#' },
  { icon: FiGithub, label: 'GitHub', value: 'github.com', href: profile.github },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com', href: profile.linkedin },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos.',
        icon: 'warning',
        background: '#0a0a0f',
        color: '#fff',
        confirmButtonColor: '#a855f7',
      });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      Swal.fire({
        title: 'Correo inválido',
        icon: 'error',
        background: '#0a0a0f',
        color: '#fff',
        confirmButtonColor: '#ec4899',
      });
      return;
    }
    try {
      setSending(true);
      const res = await fetch(
        'https://formsubmit.co/ajax/manuelrodriguezcalderon10@gmail.com',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            _subject: `Nuevo contacto desde el portafolio — ${form.name}`,
            _template: 'table',
            _captcha: 'false',
          }),
        }
      );
      if (!res.ok) throw new Error('network');
      Swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarme. Te responderé pronto.',
        icon: 'success',
        background: '#0a0a0f',
        color: '#fff',
        confirmButtonColor: '#22d3ee',
      });
      setForm({ name: '', email: '', message: '' });
    } catch {
      Swal.fire({
        title: 'No se pudo enviar',
        text: 'Revisa tu conexión e inténtalo de nuevo, o escríbeme directo a manuelrodriguezcalderon10@gmail.com.',
        icon: 'error',
        background: '#0a0a0f',
        color: '#fff',
        confirmButtonColor: '#ec4899',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="text-center" data-aos="fade-up">
        <span className="section-eyebrow">// Contacto</span>
        <h2 className="section-title mt-3">
          Hablemos del <span className="text-gradient">próximo proyecto</span>
        </h2>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-7 neon-border"
        >
          <h3 className="font-display text-xl">Canales</h3>
          <p className="text-sm text-white/65 mt-1">Estoy disponible para colaboraciones y proyectos.</p>
          <ul className="mt-6 space-y-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl glass hover:shadow-neon-cyan transition group"
                >
                  <span className="w-10 h-10 grid place-items-center rounded-lg bg-white/5 text-neon-cyan group-hover:text-neon-purple transition">
                    <c.icon />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-widest text-white/55">{c.label}</span>
                    <span className="block text-sm">{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-7 neon-border space-y-4"
        >
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition"
              placeholder="Tu nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
            <input
              type="email"
              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl outline-none focus:border-neon-purple focus:shadow-neon-purple transition"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <FiMessageSquare className="absolute left-4 top-4 text-white/55" />
            <textarea
              rows={5}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl outline-none focus:border-neon-cyan focus:shadow-neon resize-none transition"
              placeholder="Cuéntame sobre tu proyecto…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Enviando…' : <>Enviar mensaje <FiSend /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
