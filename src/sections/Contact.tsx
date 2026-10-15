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
  FiCopy,
  FiCheck,
  FiRadio,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { profile } from '../data/profile';
import GlassPanel from '../components/ui/GlassPanel';
import MagneticButton from '../components/ui/MagneticButton';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const channels = [
    {
      icon: FiMail,
      label: 'Correo Electrónico',
      value: profile.email,
      href: `mailto:${profile.email}`,
      copyable: true,
    },
    {
      icon: FiPhone,
      label: 'Teléfono Directo',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s+/g, '')}`,
      copyable: true,
    },
    {
      icon: FiMapPin,
      label: 'Ubicación',
      value: profile.location,
      href: undefined,
      copyable: false,
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: 'github.com/ManuDev21',
      href: profile.github,
      copyable: false,
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: 'Perfil Profesional',
      href: profile.linkedin,
      copyable: false,
    },
  ];

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      triggerDragonPulse();
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback if clipboard permission denied
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    const isLight =
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('light');
    const swalBg = isLight ? '#FFFFFF' : '#080B13';
    const swalColor = isLight ? '#0B1120' : '#F5FAFF';

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatusBanner({
        type: 'error',
        text: 'Por favor completa tu nombre, correo electrónico y mensaje antes de transmitir.',
      });
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos.',
        icon: 'warning',
        background: swalBg,
        color: swalColor,
        confirmButtonColor: '#8B5CF6',
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setStatusBanner({
        type: 'error',
        text: 'Ingresa una dirección de correo electrónico válida.',
      });
      Swal.fire({
        title: 'Correo inválido',
        text: 'Verifica el formato de tu correo electrónico.',
        icon: 'error',
        background: swalBg,
        color: swalColor,
        confirmButtonColor: '#EC4899',
      });
      return;
    }

    try {
      setSending(true);
      const res = await fetch(
        'https://formsubmit.co/ajax/manuelrodriguezcalderon10@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            _subject: `Nuevo contacto desde el portafolio NEXUS — ${trimmedName}`,
            _template: 'table',
            _captcha: 'false',
          }),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === 'false')) {
        throw new Error('Service returned non-success status');
      }

      triggerDragonPulse();
      setStatusBanner({
        type: 'success',
        text: '¡Mensaje transmitido correctamente! Te responderé a la brevedad.',
      });
      Swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarme. Te responderé pronto.',
        icon: 'success',
        background: swalBg,
        color: swalColor,
        confirmButtonColor: '#00E5FF',
      });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatusBanner({
        type: 'error',
        text: `No fue posible enviar el formulario automáticamente. Puedes escribir directamente a ${profile.email}.`,
      });
      Swal.fire({
        title: 'No se pudo enviar',
        text: `Revisa tu conexión e inténtalo de nuevo, o escríbeme directo a ${profile.email}.`,
        icon: 'error',
        background: swalBg,
        color: swalColor,
        confirmButtonColor: '#EC4899',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="text-center max-w-3xl mx-auto">
        <span className="section-eyebrow">
          <FiRadio /> // 06 • Centro de Comunicaciones
        </span>
        <h2 className="section-title mt-3">
          Hablemos del <span className="text-gradient">próximo proyecto</span>
        </h2>
        <p className="mt-3 text-nexus-muted text-sm sm:text-base font-grotesk">
          Disponible para oportunidades laborales Full-Stack, desarrollo de sistemas
          a medida y colaboraciones tecnológicas.
        </p>
      </div>

      <div className="mt-14 grid lg:grid-cols-12 gap-8 items-start">
        {/* Direct Channels Panel */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <GlassPanel variant="crystal" neonBorder hudCorners className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-nexus-white">
                Canales Directos
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-nexus-cyan">
                <span className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-nexus-muted mt-1.5">
              Contacto directo verificado sin intermediarios.
            </p>

            <ul className="mt-6 space-y-3">
              {channels.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center justify-between gap-2 p-3.5 rounded-xl neu-surface border border-white/5 hover:border-nexus-cyan/40 transition group"
                >
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="flex items-center gap-3.5 min-w-0 flex-1"
                    >
                      <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl neu-pressed text-nexus-cyan group-hover:text-nexus-violet transition">
                        <c.icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-nexus-muted">
                          {c.label}
                        </span>
                        <span className="block text-xs sm:text-sm text-nexus-white truncate group-hover:text-nexus-cyan transition">
                          {c.value}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl neu-pressed text-nexus-cyan">
                        <c.icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-nexus-muted">
                          {c.label}
                        </span>
                        <span className="block text-xs sm:text-sm text-nexus-white">
                          {c.value}
                        </span>
                      </span>
                    </div>
                  )}

                  {c.copyable && (
                    <button
                      type="button"
                      onClick={() => handleCopy(c.label, c.value)}
                      aria-label={`Copiar ${c.label}`}
                      className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-muted hover:text-nexus-cyan shrink-0"
                    >
                      {copiedField === c.label ? (
                        <FiCheck className="text-emerald-400" size={14} />
                      ) : (
                        <FiCopy size={14} />
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </motion.div>

        {/* Transmission Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <GlassPanel variant="crystal" neonBorder hudCorners className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-nexus-cyan">
                  TRANSMISIÓN DIRECTA // TLS
                </span>
                <h3 className="font-display text-xl font-bold text-nexus-white mt-0.5">
                  Enviar Mensaje
                </h3>
              </div>
              <span className="chip font-mono text-[10px]">RESPUESTA RÁPIDA</span>
            </div>

            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono uppercase tracking-wider text-nexus-muted mb-1.5"
                  >
                    Nombre
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-cyan/70" />
                    <input
                      id="contact-name"
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3 neu-pressed rounded-xl text-sm text-nexus-white placeholder:text-nexus-muted/50 outline-none focus:border-nexus-cyan focus:shadow-neon-cyan transition"
                      placeholder="Tu nombre completo"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono uppercase tracking-wider text-nexus-muted mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-nexus-violet/80" />
                    <input
                      id="contact-email"
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3 neu-pressed rounded-xl text-sm text-nexus-white placeholder:text-nexus-muted/50 outline-none focus:border-nexus-violet focus:shadow-neon-purple transition"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-wider text-nexus-muted mb-1.5"
                >
                  Mensaje o Propuesta
                </label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-4 text-nexus-cyan/70" />
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    className="w-full pl-11 pr-4 py-3 neu-pressed rounded-xl text-sm text-nexus-white placeholder:text-nexus-muted/50 outline-none focus:border-nexus-cyan focus:shadow-neon resize-none transition"
                    placeholder="Cuéntame sobre tu proyecto, vacante o colaboración…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
              </div>

              {statusBanner && (
                <div
                  role="status"
                  className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 border ${
                    statusBanner.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-400/35 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-400/35 text-rose-300'
                  }`}
                >
                  {statusBanner.type === 'success' ? (
                    <FiCheckCircle className="text-base mt-0.5 shrink-0" />
                  ) : (
                    <FiAlertCircle className="text-base mt-0.5 shrink-0" />
                  )}
                  <span>{statusBanner.text}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-nexus-muted">
                  O escribe directamente a{' '}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-nexus-cyan hover:underline"
                  >
                    {profile.email}
                  </a>
                </span>

                <MagneticButton
                  type="submit"
                  disabled={sending}
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                >
                  {sending ? (
                    'Transmitiendo mensaje…'
                  ) : (
                    <>
                      Enviar mensaje <FiSend />
                    </>
                  )}
                </MagneticButton>
              </div>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
