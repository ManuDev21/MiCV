import { useEffect } from 'react';

export interface PointerState {
  /** Normalized X in [-1, 1] */
  nx: number;
  /** Normalized Y in [-1, 1] (up is positive for 3D space) */
  ny: number;
  /** Client pixel X */
  clientX: number;
  /** Client pixel Y */
  clientY: number;
  /** Instantaneous pointer speed */
  speed: number;
  /** Timestamp of last movement */
  lastMoveTime: number;
  /** Normalized scroll progress [0, 1] */
  scrollProgress: number;
  /** Scroll Y in pixels */
  scrollY: number;
  /** Dragon pulse trigger counter (incremented on special interactions/clicks) */
  pulseCount: number;
  /** Whether pointer is hovering interactive dragon zone or CTA */
  excited: boolean;
}

export const pointerStore: PointerState = {
  nx: 0,
  ny: 0,
  clientX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  clientY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  speed: 0,
  lastMoveTime: 0,
  scrollProgress: 0,
  scrollY: 0,
  pulseCount: 0,
  excited: false,
};

export function triggerDragonPulse() {
  pointerStore.pulseCount += 1;
  pointerStore.lastMoveTime = performance.now();
}

export function setDragonExcited(excited: boolean) {
  pointerStore.excited = excited;
}

let listenerCount = 0;
let cleanupFn: (() => void) | null = null;

function initGlobalPointerListeners() {
  if (typeof window === 'undefined' || cleanupFn) return;

  let prevX = window.innerWidth / 2;
  let prevY = window.innerHeight / 2;
  let prevT = performance.now();

  const onPointerMove = (e: PointerEvent) => {
    const now = performance.now();
    const dt = Math.max(1, now - prevT);
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    const dist = Math.hypot(dx, dy);

    pointerStore.clientX = e.clientX;
    pointerStore.clientY = e.clientY;
    pointerStore.nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    pointerStore.ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    pointerStore.speed = Math.min(3, (dist / dt) * 1.5);
    pointerStore.lastMoveTime = now;

    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);

    prevX = e.clientX;
    prevY = e.clientY;
    prevT = now;
  };

  const onScroll = () => {
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    pointerStore.scrollY = window.scrollY;
    pointerStore.scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  cleanupFn = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    cleanupFn = null;
  };
}

export function usePointerPosition() {
  useEffect(() => {
    listenerCount += 1;
    initGlobalPointerListeners();
    return () => {
      listenerCount -= 1;
      if (listenerCount <= 0 && cleanupFn) {
        cleanupFn();
        listenerCount = 0;
      }
    };
  }, []);

  return pointerStore;
}
