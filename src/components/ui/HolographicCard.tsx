import { ReactNode, useRef, useState, MouseEvent } from 'react';
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
  maxTilt = 8,
  glowColor = 'cyan',
  badge,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    setGlarePos({
      x: relX * 100,
      y: relY * 100,
      opacity: 1,
    });

    if (!reducedMotion) {
      const rotY = (relX - 0.5) * maxTilt * 2;
      const rotX = (0.5 - relY) * maxTilt * 2;
      setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`);
    }
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const accentGradient =
    glowColor === 'magenta'
      ? 'rgba(236, 72, 153, 0.22)'
      : glowColor === 'violet'
      ? 'rgba(139, 92, 246, 0.24)'
      : 'rgba(0, 229, 255, 0.22)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: glarePos.opacity ? 'transform 0.12s ease-out' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`relative rounded-2xl glass-crystal neon-border hud-corners overflow-hidden group ${className}`}
    >
      {/* Dynamic Holographic Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(380px circle at ${glarePos.x}% ${glarePos.y}%, ${accentGradient}, rgba(139, 92, 246, 0.08) 45%, transparent 75%)`,
        }}
      />

      {/* Top Specular Edge Line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      {badge && (
        <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-display uppercase tracking-[0.2em] bg-nexus-void/70 border border-nexus-cyan/30 text-nexus-cyan">
          {badge}
        </div>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
