import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ElectricDragon from './ElectricDragon';
import DragonParticles from './DragonParticles';
import DragonFallback from './DragonFallback';
import { usePointerPosition } from '../../hooks/usePointerPosition';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';
import type { Theme } from '../../hooks/useTheme';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface DragonSceneProps {
  theme?: Theme;
}

export default function DragonScene({ theme = 'dark' }: DragonSceneProps) {
  usePointerPosition();
  const reducedMotion = useReducedMotionPreference();
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());

    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });

    const onVisibilityChange = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (!webGLSupported) {
    return <DragonFallback />;
  }

  const isLight = theme === 'light';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-colors duration-300"
    >
      {/* Atmospheric Base Layers adapting to Dark and Light Themes */}
      <div className="absolute inset-0 bg-nexus-void transition-colors duration-300" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 80% 60% at 65% 28%, rgba(109, 40, 217, 0.09), rgba(2, 132, 199, 0.08) 45%, transparent 80%)'
            : 'radial-gradient(ellipse 80% 60% at 65% 28%, rgba(139, 92, 246, 0.14), rgba(0, 229, 255, 0.07) 45%, transparent 80%)',
        }}
      />

      <Suspense fallback={<DragonFallback />}>
        <Canvas
          frameloop={tabVisible ? 'always' : 'never'}
          camera={{ position: [0, 0.15, 5.6], fov: 50 }}
          dpr={isMobile ? 1 : [1, 1.25]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={isLight ? 0.9 : 0.6} />
          <directionalLight
            position={[5, 6, 5]}
            intensity={isLight ? 1.5 : 1.35}
            color={isLight ? '#6D28D9' : '#8B5CF6'}
          />
          <directionalLight
            position={[-6, -3, 4]}
            intensity={isLight ? 1.25 : 1.1}
            color={isLight ? '#0284C7' : '#00E5FF'}
          />

          <DragonParticles
            count={isMobile ? 180 : reducedMotion ? 220 : 420}
            reducedMotion={reducedMotion}
            theme={theme}
          />
          <ElectricDragon
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            theme={theme}
          />
        </Canvas>
      </Suspense>

      {/* Subtle Vignette for Editorial Text Readability in both Dark & Light Modes */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: isLight
            ? 'radial-gradient(circle at 30% 50%, rgba(244, 247, 252, 0.25) 0%, rgba(244, 247, 252, 0.65) 100%)'
            : 'radial-gradient(circle at 30% 50%, rgba(3, 4, 7, 0.32) 0%, rgba(3, 4, 7, 0.68) 100%)',
        }}
      />
    </div>
  );
}
