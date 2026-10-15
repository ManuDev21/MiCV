import { AnimatePresence, motion } from 'framer-motion';

export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Iniciando experiencia NEXUS"
          className="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="relative flex flex-col items-center gap-6 px-6 text-center">
            {/* Orbital Ring & Cyber-Dragon Core Emblem */}
            <div className="relative w-28 h-28 grid place-items-center">
              <div className="loader-ring absolute inset-0 w-full h-full" />
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12 text-nexus-cyan drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                fill="none"
              >
                <path
                  d="M32 8L20 22L8 16L16 34L10 44L26 42L32 56L38 42L54 44L48 34L56 16L44 22L32 8Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  fill="rgba(139, 92, 246, 0.2)"
                />
                <circle cx="27" cy="27" r="2" fill="#F5FAFF" />
                <circle cx="37" cy="27" r="2" fill="#F5FAFF" />
              </svg>
            </div>

            <div className="space-y-2">
              <div className="font-display tracking-[0.38em] text-xs sm:text-sm text-gradient font-bold">
                NEXUS // ELECTRIC SOUL
              </div>
              <div className="text-[11px] font-mono tracking-[0.22em] text-nexus-muted uppercase">
                SINCRONIZANDO NÚCLEO 3D • MRC.DEV
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
