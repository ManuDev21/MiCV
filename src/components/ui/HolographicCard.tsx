import { ReactNode, useRef, MouseEvent } from 'react';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: 'cyan' | 'violet' | 'magenta';
  badge?: string;
}

export default function HolographicCard({
  children,
  className = '',
  maxTilt = 6,
  glowColor = 'cyan',
  badge,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  const accentGradient =
    glowColor === 'magenta'
      ? 'rgba(236, 72, 153, 0.18)'
      : glowColor === 'violet'
      ? 'rgba(139, 92, 246, 0.2)'
      : 'rgba(0, 229, 255, 0.18)';

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(340px circle at ${(
        relX * 100
      ).toFixed(1)}% ${(relY * 100).toFixed(
        1
      )}%, ${accentGradient}, transparent 72%)`;
    }

    if (!reducedMotion) {
      const rotY = (relX - 0.5) * maxTilt * 2;
      const rotX = (0.5 - relY) * maxTilt * 2;
      el.style.transition = 'transform 0.08s ease-out';
      el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(
        2
      )}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(2px)`;
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl glass-crystal neon-border hud-corners overflow-hidden group will-change-transform ${className}`}
    >
      {/* Dynamic Holographic Specular Glare (updated via ref without React re-renders) */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-0"
      />

      {/* Top Specular Edge Line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      {badge && (
        <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-display uppercase tracking-[0.2em] bg-nexus-void/80 border border-nexus-cyan/30 text-nexus-cyan">
          {badge}
        </div>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
