import { useEffect, useRef, useState } from 'react';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'drag'>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      setEnabled(false);
      return;
    }

    const mediaFine = window.matchMedia('(pointer: fine) and (hover: hover)');
    setEnabled(mediaFine.matches);

    if (!mediaFine.matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !ring.current) return;

      if (t.closest('[data-cursor="drag"]')) {
        setCursorMode('drag');
        ring.current.style.width = '64px';
        ring.current.style.height = '64px';
        ring.current.style.borderColor = 'rgba(0, 229, 255, 0.95)';
        ring.current.style.backgroundColor = 'rgba(0, 229, 255, 0.08)';
      } else if (
        t.closest('a,button,input,textarea,[role="tab"],[data-cursor="magnetic"],[data-cursor="hover"]')
      ) {
        setCursorMode('hover');
        ring.current.style.width = '52px';
        ring.current.style.height = '52px';
        ring.current.style.borderColor = 'rgba(0, 229, 255, 0.9)';
        ring.current.style.backgroundColor = 'rgba(139, 92, 246, 0.08)';
      } else {
        setCursorMode('default');
        ring.current.style.width = '36px';
        ring.current.style.height = '36px';
        ring.current.style.borderColor = 'rgba(139, 92, 246, 0.75)';
        ring.current.style.backgroundColor = 'transparent';
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="cursor-ring flex items-center justify-center"
      >
        {cursorMode === 'drag' && (
          <span className="font-display text-[8px] uppercase tracking-widest text-nexus-cyan select-none">
            DRAG
          </span>
        )}
      </div>
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
