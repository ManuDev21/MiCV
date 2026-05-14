import { AnimatePresence, motion } from 'framer-motion';

export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="loader-ring" />
            <div className="font-display tracking-[0.4em] text-sm text-gradient">
              INICIANDO SISTEMA
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
