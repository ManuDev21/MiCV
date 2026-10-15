import { ReactNode, HTMLAttributes, useRef, MouseEvent } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'crystal' | 'neu';
  neonBorder?: boolean;
  hudCorners?: boolean;
  interactiveGlow?: boolean;
}

export default function GlassPanel({
  children,
  variant = 'default',
  neonBorder = false,
  hudCorners = false,
  interactiveGlow = true,
  className = '',
  onMouseMove,
  ...rest
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (interactiveGlow && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panelRef.current.style.setProperty('--px', `${x}px`);
      panelRef.current.style.setProperty('--py', `${y}px`);
    }
    onMouseMove?.(e);
  };

  const variantClass =
    variant === 'strong'
      ? 'glass-strong'
      : variant === 'crystal'
      ? 'glass-crystal'
      : variant === 'neu'
      ? 'neu-surface'
      : 'glass';

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 group ${variantClass} ${
        neonBorder ? 'neon-border' : ''
      } ${hudCorners ? 'hud-corners' : ''} ${className}`}
      {...rest}
    >
      {interactiveGlow && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background:
              'radial-gradient(360px circle at var(--px, 50%) var(--py, 50%), rgba(0, 229, 255, 0.13), rgba(139, 92, 246, 0.08) 45%, transparent 80%)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
