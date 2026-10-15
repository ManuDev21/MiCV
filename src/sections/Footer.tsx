import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiZap } from 'react-icons/fi';
import { SiVercel, SiNetlify } from 'react-icons/si';
import { profile } from '../data/profile';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-nexus-void/80 backdrop-blur-xl">
      {/* Top Luminous Horizon Line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-nexus-cyan/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan animate-pulse" />
            <span className="font-display text-xs tracking-[0.28em] uppercase text-gradient font-bold">
              MRC.NEXUS // ELECTRIC SOUL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-nexus-muted">
            © {new Date().getFullYear()}{' '}
            <span className="text-nexus-white font-medium">{profile.name}</span>.
            Diseñado y desarrollado con React, Three.js, React Three Fiber & Framer Motion.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-xs text-nexus-muted">
            <span className="uppercase tracking-[0.22em] text-[10px]">Deploy ready</span>
            <span className="chip !py-1">
              <SiVercel /> Vercel
            </span>
            <span className="chip !py-1">
              <SiNetlify className="text-nexus-cyan" /> Netlify
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-cyan"
            >
              <FiGithub />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-violet"
            >
              <FiLinkedin />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Enviar correo"
              className="w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-magenta"
            >
              <FiMail />
            </a>
            <button
              type="button"
              onClick={() => {
                triggerDragonPulse();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Volver al inicio"
              className="w-9 h-9 rounded-lg neu-button grid place-items-center text-nexus-cyan hover:text-nexus-white"
            >
              <FiArrowUp />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Dragon Core Status Bar */}
      <div className="border-t border-white/5 py-3 px-6 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-nexus-muted/70 flex items-center justify-center gap-2">
        <FiZap className="text-nexus-cyan" />
        <span>MOTOR 3D NEXUS ACTIVO • SEGUIMIENTO DE PUNTERO & FÍSICA HOLOGRÁFICA</span>
      </div>
    </footer>
  );
}
