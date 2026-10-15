import { ReactNode, useRef, useState, MouseEvent } from 'react';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';
import { setDragonExcited, triggerDragonPulse } from '../../hooks/usePointerPosition';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'neu';
  className?: string;
  ariaLabel?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  href,
  download,
  target,
  rel,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  ariaLabel,
  strength = 0.28,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseEnter = () => {
    setDragonExcited(true);
  };

  const handleMouseLeave = () => {
    setDragonExcited(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = () => {
    triggerDragonPulse();
    onClick?.();
  };

  const baseClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'neu'
      ? 'btn-magnetic neu-button text-nexus-white'
      : 'btn-ghost';

  const style = {
    transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease'
        : 'transform 0.1s ease-out, box-shadow 0.3s ease',
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        download={download}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={style}
        data-cursor="magnetic"
        className={`${baseClass} ${className}`}
      >
        <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={style}
      data-cursor="magnetic"
      className={`${baseClass} disabled:opacity-55 disabled:cursor-not-allowed ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </button>
  );
}
