import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAward,
  FiExternalLink,
  FiShield,
  FiDownload,
  FiX,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { certifications, profile } from '../data/profile';
import HolographicCard from '../components/ui/HolographicCard';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<(typeof certifications)[number] | null>(
    null
  );

  const handleInspect = (cert: (typeof certifications)[number]) => {
    triggerDragonPulse();
    if (cert.url && cert.url !== '#') {
      window.open(cert.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedCert(cert);
  };

  return (
    <section id="certifications" className="section">
      <div className="text-center max-w-3xl mx-auto">
        <span className="section-eyebrow">
          <FiAward /> // 05 • Credenciales Técnicas
        </span>
        <h2 className="section-title mt-3">
          <span className="text-gradient">Certificaciones</span> & Acreditaciones
        </h2>
        <p className="mt-3 text-nexus-muted text-sm sm:text-base font-grotesk">
          Acreditaciones técnicas emitidas por instituciones internacionales en
          fundamentos de ingeniería de software, JavaScript y Python.
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((c, i) => {
          const hasExternalUrl = Boolean(c.url && c.url !== '#');
          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="h-full"
            >
              <HolographicCard
                maxTilt={9}
                glowColor={i === 0 ? 'cyan' : i === 1 ? 'violet' : 'magenta'}
                badge={`CRED // 0${i + 1}`}
                className="p-6 sm:p-7 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl neu-pressed border border-nexus-cyan/30 grid place-items-center text-2xl text-nexus-cyan shadow-neon-cyan">
                    <FiAward />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-nexus-void/70 border border-white/10 text-nexus-cyan">
                    <FiShield className="text-nexus-violet" />
                    {hasExternalUrl ? 'Enlace Verificable' : 'Registrada en CV Oficial'}
                  </div>

                  <h3 className="mt-3 font-display text-lg sm:text-xl font-bold leading-snug text-nexus-white">
                    {c.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-nexus-muted mt-2 leading-relaxed">
                    {c.issuer}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleInspect(c)}
                    className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-nexus-cyan hover:text-nexus-violet transition"
                  >
                    {hasExternalUrl ? (
                      <>
                        Verificar credencial <FiExternalLink />
                      </>
                    ) : (
                      <>
                        Ficha de credencial <FiInfo />
                      </>
                    )}
                  </button>

                  <span className="text-[10px] font-mono text-nexus-muted">
                    CISCO / OPENEDG
                  </span>
                </div>
              </HolographicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Honest Digital Credential Inspection Modal (Replaces misleading placeholder) */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[60] bg-nexus-void/80 backdrop-blur-lg grid place-items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-modal-title"
              className="relative max-w-lg w-full glass-crystal neon-border hud-corners rounded-2xl p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Cerrar ficha de certificación"
                className="absolute top-4 right-4 w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-muted hover:text-nexus-white"
              >
                <FiX size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl neu-pressed border border-nexus-cyan/40 grid place-items-center text-2xl text-nexus-cyan">
                  <FiAward />
                </div>
                <div>
                  <span className="text-[10px] font-display uppercase tracking-[0.25em] text-nexus-cyan">
                    FICHA DE ACREDITACIÓN TÉCNICA
                  </span>
                  <h3
                    id="cert-modal-title"
                    className="font-display text-xl font-bold text-nexus-white mt-0.5"
                  >
                    {selectedCert.name}
                  </h3>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl neu-pressed border border-white/5 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-nexus-muted">Titular:</span>
                  <span className="text-nexus-white font-medium text-right">
                    {profile.name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-nexus-muted">Institución emisora:</span>
                  <span className="text-nexus-cyan font-medium text-right">
                    {selectedCert.issuer}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-nexus-muted">Estado documental:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <FiCheckCircle /> Acreditación completada
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-nexus-muted leading-relaxed">
                Esta certificación forma parte del expediente académico y técnico de{' '}
                <strong className="text-nexus-white">{profile.name}</strong>. El
                documento curricular oficial incluye el registro completo de
                certificaciones; puedes descargarlo en PDF o solicitar el comprobante
                directo por correo electrónico.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent(
                    `Solicitud de comprobante: ${selectedCert.name}`
                  )}`}
                  className="btn-ghost !py-2.5 !px-4 text-xs"
                >
                  Solicitar comprobante
                </a>
                <a
                  href={profile.cv}
                  download
                  className="btn-primary !py-2.5 !px-5 text-xs"
                >
                  <FiDownload /> Descargar CV Oficial
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
