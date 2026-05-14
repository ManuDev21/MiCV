import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import type { Theme } from '../hooks/useTheme';

export default function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Cambiar tema"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass-strong neon-border grid place-items-center shadow-neon"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-xl"
      >
        {theme === 'dark' ? <FiSun className="text-neon-cyan" /> : <FiMoon className="text-neon-purple" />}
      </motion.span>
    </motion.button>
  );
}
