import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ElectricDragon from './ElectricDragon';
import DragonParticles from './DragonParticles';
import DragonFallback from './DragonFallback';
import { usePointerPosition } from '../../hooks/usePointerPosition';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';

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

export default function DragonScene() {
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

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Atmospheric Base Layers */}
      <div className="absolute inset-0 bg-nexus-void" />
      <div className="absolute inset-0 grid-bg opacity-35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 65% 28%, rgba(139, 92, 246, 0.14), rgba(0, 229, 255, 0.07) 45%, transparent 80%)',
        }}
      />

      <Suspense fallback={<DragonFallback />}>
        <Canvas
          frameloop={tabVisible ? 'always' : 'never'}
          camera={{ position: [0, 0.15, 5.6], fov: 50 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.6]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 6, 5]} intensity={1.35} color="#8B5CF6" />
          <directionalLight position={[-6, -3, 4]} intensity={1.1} color="#00E5FF" />
          <pointLight position={[0, 3, 2]} intensity={0.9} color="#EC4899" distance={12} />

          <DragonParticles
            count={isMobile ? 380 : reducedMotion ? 450 : 950}
            reducedMotion={reducedMotion}
          />
          <ElectricDragon reducedMotion={reducedMotion} isMobile={isMobile} />
        </Canvas>
      </Suspense>

      {/* Subtle Vignette for Editorial Text Readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 50%, rgba(3, 4, 7, 0.35) 0%, rgba(3, 4, 7, 0.72) 100%)',
        }}
      />
    </div>
  );
}
