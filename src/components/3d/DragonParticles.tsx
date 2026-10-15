import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pointerStore } from '../../hooks/usePointerPosition';

interface DragonParticlesProps {
  count?: number;
  reducedMotion?: boolean;
}

export default function DragonParticles({
  count = 900,
  reducedMotion = false,
}: DragonParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const sparksRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cCyan = new THREE.Color('#00E5FF');
    const cViolet = new THREE.Color('#8B5CF6');
    const cPlasma = new THREE.Color('#3B82F6');
    const cMagenta = new THREE.Color('#EC4899');

    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      pos[i * 3 + 2] = r * Math.cos(phi) - 2;

      const pick = Math.random();
      const chosen =
        pick < 0.45 ? cCyan : pick < 0.8 ? cViolet : pick < 0.94 ? cPlasma : cMagenta;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  const sparkCount = Math.min(180, Math.floor(count * 0.22));
  const sparkData = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const col = new Float32Array(sparkCount * 3);
    const cCyan = new THREE.Color('#00E5FF');
    const cWhite = new THREE.Color('#F5FAFF');

    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 2.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const c = i % 3 === 0 ? cWhite : cCyan;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { pos, col };
  }, [sparkCount]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (0.03 + pointerStore.speed * 0.02);
      pointsRef.current.rotation.x = THREE.MathUtils.damp(
        pointsRef.current.rotation.x,
        pointerStore.ny * 0.12 + pointerStore.scrollProgress * 0.35,
        3,
        delta
      );
    }

    if (sparksRef.current) {
      sparksRef.current.rotation.z = -t * 0.25;
      sparksRef.current.rotation.y = t * 0.18;
      const targetX = pointerStore.nx * 1.6;
      const targetY = pointerStore.ny * 1.1;
      sparksRef.current.position.x = THREE.MathUtils.damp(
        sparksRef.current.position.x,
        targetX,
        4,
        delta
      );
      sparksRef.current.position.y = THREE.MathUtils.damp(
        sparksRef.current.position.y,
        targetY,
        4,
        delta
      );
    }
  });

  return (
    <group>
      <points ref={pointsRef} frustumCulled>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          vertexColors
          transparent
          opacity={0.72}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={sparksRef} frustumCulled>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sparkData.pos.length / 3}
            array={sparkData.pos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={sparkData.col.length / 3}
            array={sparkData.col}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
