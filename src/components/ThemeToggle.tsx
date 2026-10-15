import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import type { Theme } from '../hooks/useTheme';
import { triggerDragonPulse } from '../hooks/usePointerPosition';

export default function ThemeToggle({
  theme,
  toggle,
}: {
  theme: Theme;
  toggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        triggerDragonPulse();
        toggle();
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="fixed bottom-6 right-6 z-50 w-13 h-13 p-3.5 rounded-2xl glass-crystal neon-border grid place-items-center shadow-neon"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="text-lg"
      >
        {theme === 'dark' ? (
          <FiSun className="text-nexus-cyan" />
        ) : (
          <FiMoon className="text-nexus-violet" />
        )}
      </motion.span>
    </motion.button>
  );
}
