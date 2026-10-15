import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pointerStore } from '../../hooks/usePointerPosition';

const SEGMENT_COUNT = 18;
const LIGHTNING_POINTS = 16;

interface ElectricDragonProps {
  reducedMotion?: boolean;
  isMobile?: boolean;
  theme?: 'dark' | 'light';
  modelUrl?: string;
}

function createWingMembraneGeometry(side: 1 | -1): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const s = side;
  const pShoulder = [0, 0, 0];
  const pWrist = [s * 1.15, 0.48, -0.08];
  const pTip1 = [s * 2.55, 0.95, -0.25];
  const pTip2 = [s * 2.35, 0.22, -0.32];
  const pTip3 = [s * 1.75, -0.38, -0.28];
  const pTip4 = [s * 0.95, -0.62, -0.22];

  const vertices = new Float32Array([
    ...pWrist, ...pTip1, ...pTip2,
    ...pWrist, ...pTip2, ...pTip3,
    ...pWrist, ...pTip3, ...pTip4,
    ...pShoulder, ...pWrist, ...pTip4,
  ]);

  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  return geo;
}

function createStaticLightningSpiral(radius: number, length: number, seedOffset: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(LIGHTNING_POINTS * 3);
  for (let i = 0; i < LIGHTNING_POINTS; i++) {
    const t = i / (LIGHTNING_POINTS - 1);
    const angle = t * Math.PI * 4 + seedOffset;
    const r = radius * Math.sin(t * Math.PI) * (0.7 + 0.3 * Math.sin(i * 7.3 + seedOffset));
    arr[i * 3] = Math.cos(angle) * r;
    arr[i * 3 + 1] = Math.sin(angle) * r * 0.8;
    arr[i * 3 + 2] = -t * length;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  return geo;
}

export default function ElectricDragon({
  reducedMotion = false,
  isMobile = false,
  theme = 'dark',
}: ElectricDragonProps) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const leftWingOuterRef = useRef<THREE.Group>(null);
  const rightWingOuterRef = useRef<THREE.Group>(null);
  const chestCoreRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const arcGroupRef = useRef<THREE.Group>(null);

  const segmentRefs = useRef<(THREE.Group | null)[]>([]);
  const lastPulseSeen = useRef<number>(0);
  const pulseIntensity = useRef<number>(0.85);

  const materials = useMemo(() => {
    const armor = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0E1422'),
      emissive: new THREE.Color('#1B1035'),
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.24,
    });

    const scaleTrim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B253B'),
      emissive: new THREE.Color('#8B5CF6'),
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.25,
    });

    const cyanCore = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00E5FF'),
    });

    const violetEnergy = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#A78BFA'),
    });

    const wingMembrane = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00E5FF'),
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const wingWireframe = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#8B5CF6'),
      wireframe: true,
      transparent: true,
      opacity: 0.52,
    });

    const lightningMatCyan = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00E5FF'),
      transparent: true,
      opacity: 0.75,
    });

    const lightningMatViolet = new THREE.LineBasicMaterial({
      color: new THREE.Color('#EC4899'),
      transparent: true,
      opacity: 0.65,
    });

    return {
      armor,
      scaleTrim,
      cyanCore,
      violetEnergy,
      wingMembrane,
      wingWireframe,
      lightningMatCyan,
      lightningMatViolet,
    };
  }, []);

  // Adapt Dragon Materials to Light / Dark Theme
  useEffect(() => {
    if (theme === 'light') {
      materials.armor.color.set('#CBD5E1');
      materials.armor.emissive.set('#6D28D9');
      materials.armor.emissiveIntensity = 0.18;
      materials.scaleTrim.color.set('#94A3B8');
      materials.scaleTrim.emissive.set('#0284C7');
      materials.scaleTrim.emissiveIntensity = 0.28;
      materials.cyanCore.color.set('#0284C7');
      materials.violetEnergy.color.set('#6D28D9');
      materials.wingMembrane.color.set('#0284C7');
      materials.wingMembrane.opacity = 0.18;
      materials.wingWireframe.color.set('#6D28D9');
      materials.wingWireframe.opacity = 0.48;
      materials.lightningMatCyan.color.set('#0284C7');
      materials.lightningMatViolet.color.set('#7C3AED');
    } else {
      materials.armor.color.set('#0E1422');
      materials.armor.emissive.set('#1B1035');
      materials.armor.emissiveIntensity = 0.4;
      materials.scaleTrim.color.set('#1B253B');
      materials.scaleTrim.emissive.set('#8B5CF6');
      materials.scaleTrim.emissiveIntensity = 0.5;
      materials.cyanCore.color.set('#00E5FF');
      materials.violetEnergy.color.set('#A78BFA');
      materials.wingMembrane.color.set('#00E5FF');
      materials.wingMembrane.opacity = 0.16;
      materials.wingWireframe.color.set('#8B5CF6');
      materials.wingWireframe.opacity = 0.52;
      materials.lightningMatCyan.color.set('#00E5FF');
      materials.lightningMatViolet.color.set('#EC4899');
    }
  }, [theme, materials]);

  const leftWingGeo = useMemo(() => createWingMembraneGeometry(-1), []);
  const rightWingGeo = useMemo(() => createWingMembraneGeometry(1), []);

  const lightningLine1 = useMemo(() => {
    const geo = createStaticLightningSpiral(0.55, 3.8, 0.0);
    return new THREE.Line(geo, materials.lightningMatCyan);
  }, [materials.lightningMatCyan]);

  const lightningLine2 = useMemo(() => {
    const geo = createStaticLightningSpiral(0.48, 3.8, 2.1);
    return new THREE.Line(geo, materials.lightningMatViolet);
  }, [materials.lightningMatViolet]);

  const chainPositions = useMemo(
    () =>
      Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        return new THREE.Vector3(0, 0.2 - i * 0.09, -i * 0.27);
      }),
    []
  );

  const segmentScales = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => {
      if (i < 3) return 0.72 - i * 0.04;
      if (i < 7) return 0.95 + Math.sin(((i - 3) / 4) * Math.PI) * 0.3;
      const tailT = (i - 7) / (SEGMENT_COUNT - 7);
      return Math.max(0.14, 0.88 * (1 - tailT * 0.85));
    });
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const t = state.clock.elapsedTime;

    if (pointerStore.pulseCount !== lastPulseSeen.current) {
      lastPulseSeen.current = pointerStore.pulseCount;
      pulseIntensity.current = 1.0;
    }
    pulseIntensity.current = THREE.MathUtils.damp(pulseIntensity.current, 0, 2.4, dt);

    const isExcited = pointerStore.excited || pulseIntensity.current > 0.25;
    const speedFactor = Math.min(1.4, pointerStore.speed);

    const idleWaveX = Math.sin(t * 0.85) * 0.4 + Math.cos(t * 0.42) * 0.2;
    const idleWaveY = Math.cos(t * 1.1) * 0.28 + Math.sin(t * 0.55) * 0.14;

    const scrollP = pointerStore.scrollProgress;
    const scrollOffsetX = Math.sin(scrollP * Math.PI * 2) * (isMobile ? 0.3 : 1.0);
    const scrollOffsetY = (scrollP - 0.2) * 0.55;
    const scrollOffsetZ = -Math.sin(scrollP * Math.PI) * 0.9;

    const baseOffsetX = isMobile ? 0.08 : 1.05;
    const baseOffsetY = isMobile ? 0.5 : 0.2;

    const targetX =
      baseOffsetX +
      scrollOffsetX +
      pointerStore.nx * (isMobile ? 0.85 : 2.05) +
      (reducedMotion ? 0 : idleWaveX * 0.38);
    const targetY =
      baseOffsetY +
      scrollOffsetY +
      pointerStore.ny * (isMobile ? 0.65 : 1.38) +
      (reducedMotion ? 0 : idleWaveY * 0.38);
    const targetZ = scrollOffsetZ + (isExcited ? 0.45 : 0);

    // 1. Smooth Head Tracking
    const headPos = chainPositions[0];
    headPos.x = THREE.MathUtils.damp(headPos.x, targetX, 4.8, dt);
    headPos.y = THREE.MathUtils.damp(headPos.y, targetY, 4.8, dt);
    headPos.z = THREE.MathUtils.damp(headPos.z, targetZ, 4.0, dt);

    if (headRef.current) {
      headRef.current.position.copy(headPos);

      const dx = targetX - headPos.x;
      const dy = targetY - headPos.y;
      const targetYaw = THREE.MathUtils.clamp(pointerStore.nx * 0.62 + dx * 0.32, -0.8, 0.8);
      const targetPitch = THREE.MathUtils.clamp(-pointerStore.ny * 0.45 - dy * 0.22, -0.55, 0.55);
      const targetRoll = THREE.MathUtils.clamp(-dx * 0.4 - pointerStore.nx * 0.2, -0.5, 0.5);

      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetYaw, 6.5, dt);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetPitch, 6.5, dt);
      headRef.current.rotation.z = THREE.MathUtils.damp(headRef.current.rotation.z, targetRoll, 5.5, dt);
    }

    if (jawRef.current) {
      const jawOpen =
        0.1 +
        Math.sin(t * 2.2) * 0.05 +
        (isExcited ? 0.24 : 0) +
        pulseIntensity.current * 0.32;
      jawRef.current.rotation.x = THREE.MathUtils.damp(jawRef.current.rotation.x, jawOpen, 8, dt);
    }

    // 2. Hierarchical Spine & Serpentine Tail
    for (let i = 1; i < SEGMENT_COUNT; i++) {
      const prev = chainPositions[i - 1];
      const curr = chainPositions[i];

      const segSpacing = i < 5 ? 0.23 : 0.28;
      const waveAmp = reducedMotion
        ? 0.015
        : (0.035 + (i / SEGMENT_COUNT) * 0.16) * (1 + speedFactor * 0.3);
      const waveFreq = t * (3.0 + (isExcited ? 1.0 : 0)) - i * 0.48;

      const desiredX = prev.x + Math.sin(waveFreq) * waveAmp - pointerStore.nx * 0.035 * i * 0.18;
      const desiredY = prev.y + Math.cos(waveFreq * 0.85) * (waveAmp * 0.6) - 0.04;
      const desiredZ = prev.z - segSpacing;

      const followSpeed = Math.max(4.5, 16 - i * 0.55);
      curr.x = THREE.MathUtils.damp(curr.x, desiredX, followSpeed, dt);
      curr.y = THREE.MathUtils.damp(curr.y, desiredY, followSpeed, dt);
      curr.z = THREE.MathUtils.damp(curr.z, desiredZ, followSpeed, dt);

      const segGroup = segmentRefs.current[i];
      if (segGroup) {
        segGroup.position.copy(curr);
        segGroup.lookAt(prev);
        segGroup.rotateZ(Math.sin(waveFreq) * 0.15);
      }
    }

    if (segmentRefs.current[0]) {
      segmentRefs.current[0].position.copy(headPos);
    }

    // 3. Articulated Wing Flapping
    const flapSpeed = reducedMotion ? 0.5 : isExcited ? 3.8 : 2.1;
    const flapBase = Math.sin(t * flapSpeed);
    const flapSecondary = Math.cos(t * flapSpeed - 0.6);
    const wingSpanBoost = isExcited ? 0.2 : 0;

    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = flapBase * (reducedMotion ? 0.06 : 0.38) + wingSpanBoost;
      const wingSweep = Math.sin(t * flapSpeed * 0.5) * 0.1 + pointerStore.ny * 0.12;

      leftWingRef.current.rotation.z = THREE.MathUtils.damp(
        leftWingRef.current.rotation.z,
        -wingAngle + pointerStore.nx * 0.12,
        7.5,
        dt
      );
      leftWingRef.current.rotation.y = THREE.MathUtils.damp(
        leftWingRef.current.rotation.y,
        0.22 + wingSweep,
        6.5,
        dt
      );

      rightWingRef.current.rotation.z = THREE.MathUtils.damp(
        rightWingRef.current.rotation.z,
        wingAngle + pointerStore.nx * 0.12,
        7.5,
        dt
      );
      rightWingRef.current.rotation.y = THREE.MathUtils.damp(
        rightWingRef.current.rotation.y,
        -0.22 - wingSweep,
        6.5,
        dt
      );
    }

    if (leftWingOuterRef.current && rightWingOuterRef.current) {
      const outerFlex = flapSecondary * (reducedMotion ? 0.04 : 0.24);
      leftWingOuterRef.current.rotation.z = outerFlex;
      rightWingOuterRef.current.rotation.z = -outerFlex;
    }

    // 4. Core & GPU-driven Lightning Helices (zero CPU buffer uploads)
    if (chestCoreRef.current) {
      chestCoreRef.current.rotation.y += dt * 1.6;
      chestCoreRef.current.rotation.z -= dt * 1.1;
      const coreScale = 1 + Math.sin(t * 4.0) * 0.1 + pulseIntensity.current * 0.35;
      chestCoreRef.current.scale.setScalar(coreScale);
    }

    if (arcGroupRef.current && !reducedMotion) {
      arcGroupRef.current.position.copy(headPos);
      arcGroupRef.current.rotation.z = t * 2.8;
      const arcScale = 1 + speedFactor * 0.25 + pulseIntensity.current * 0.45;
      arcGroupRef.current.scale.set(arcScale, arcScale, 1);
    }

    // 5. Shockwave Ring on Pulse
    if (pulseRingRef.current) {
      const chestPos = chainPositions[4] || headPos;
      pulseRingRef.current.position.copy(chestPos);
      const p = 1 - pulseIntensity.current;
      const ringScale = 0.5 + p * 5.0;
      pulseRingRef.current.scale.setScalar(ringScale);
      const ringMat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, pulseIntensity.current * 0.6);
    }
  });

  const dragonScale = isMobile ? 0.68 : 0.92;

  return (
    <group ref={rootRef} scale={dragonScale}>
      {/* ==================== DRAGON HEAD ASSEMBLY ==================== */}
      <group ref={headRef}>
        <mesh material={materials.armor} position={[0, 0.05, 0]} scale={[0.42, 0.32, 0.58]}>
          <octahedronGeometry args={[1, 1]} />
        </mesh>

        <mesh
          material={materials.scaleTrim}
          position={[0, -0.02, 0.48]}
          rotation={[Math.PI * 0.48, 0, 0]}
          scale={[0.28, 0.48, 0.22]}
        >
          <coneGeometry args={[1, 1.5, 6]} />
        </mesh>

        {/* Glowing Eyes */}
        <mesh material={materials.cyanCore} position={[-0.21, 0.1, 0.26]} rotation={[0, -0.35, -0.2]}>
          <octahedronGeometry args={[0.065, 0]} />
        </mesh>
        <mesh material={materials.cyanCore} position={[0.21, 0.1, 0.26]} rotation={[0, 0.35, 0.2]}>
          <octahedronGeometry args={[0.065, 0]} />
        </mesh>

        {/* Brow Armor Ridges */}
        <mesh
          material={materials.scaleTrim}
          position={[-0.22, 0.18, 0.2]}
          rotation={[0.2, -0.3, -0.4]}
        >
          <boxGeometry args={[0.18, 0.04, 0.34]} />
        </mesh>
        <mesh
          material={materials.scaleTrim}
          position={[0.22, 0.18, 0.2]}
          rotation={[0.2, 0.3, 0.4]}
        >
          <boxGeometry args={[0.18, 0.04, 0.34]} />
        </mesh>

        {/* Swept-Back Main Plasma Horns */}
        <group position={[-0.24, 0.24, -0.15]} rotation={[-0.85, -0.38, 0.22]}>
          <mesh material={materials.armor} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.09, 0.85, 5]} />
          </mesh>
          <mesh material={materials.cyanCore} position={[0, 0.72, 0]}>
            <coneGeometry args={[0.045, 0.42, 4]} />
          </mesh>
        </group>
        <group position={[0.24, 0.24, -0.15]} rotation={[-0.85, 0.38, -0.22]}>
          <mesh material={materials.armor} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.09, 0.85, 5]} />
          </mesh>
          <mesh material={materials.cyanCore} position={[0, 0.72, 0]}>
            <coneGeometry args={[0.045, 0.42, 4]} />
          </mesh>
        </group>

        {/* Secondary Cheek Blades */}
        <mesh
          material={materials.violetEnergy}
          position={[-0.34, 0.02, -0.12]}
          rotation={[-0.6, -0.6, 0]}
        >
          <coneGeometry args={[0.055, 0.48, 4]} />
        </mesh>
        <mesh
          material={materials.violetEnergy}
          position={[0.34, 0.02, -0.12]}
          rotation={[-0.6, 0.6, 0]}
        >
          <coneGeometry args={[0.055, 0.48, 4]} />
        </mesh>

        {/* Articulated Lower Jaw */}
        <group ref={jawRef} position={[0, -0.1, 0.08]}>
          <mesh
            material={materials.armor}
            position={[0, -0.04, 0.32]}
            rotation={[Math.PI * 0.52, 0, 0]}
            scale={[0.22, 0.42, 0.14]}
          >
            <coneGeometry args={[1, 1.35, 5]} />
          </mesh>
          <mesh material={materials.cyanCore} position={[0, 0.02, 0.24]}>
            <octahedronGeometry args={[0.08, 0]} />
          </mesh>
        </group>
      </group>

      {/* ==================== HIERARCHICAL SPINE, CHEST, WINGS & TAIL ==================== */}
      {segmentScales.map((s, idx) => {
        const isChestAttachment = idx === 4;
        const isTailTip = idx === SEGMENT_COUNT - 1;

        return (
          <group
            key={idx}
            ref={(el) => {
              segmentRefs.current[idx] = el;
            }}
          >
            <mesh material={materials.armor} scale={[s * 0.34, s * 0.28, s * 0.38]}>
              <octahedronGeometry args={[1, 0]} />
            </mesh>

            {/* Dorsal Spine Blade Fin */}
            <mesh
              material={idx % 2 === 0 ? materials.cyanCore : materials.scaleTrim}
              position={[0, s * 0.35, -0.04]}
              rotation={[-0.55, 0, 0]}
            >
              <coneGeometry args={[s * 0.085, s * 0.48, 4]} />
            </mesh>

            {/* CHEST HEART CORE & ARTICULATED DUAL WINGS */}
            {isChestAttachment && (
              <group>
                <mesh ref={chestCoreRef} material={materials.cyanCore} position={[0, -0.06, 0]}>
                  <octahedronGeometry args={[0.24, 1]} />
                </mesh>

                {/* Left Articulated Wing */}
                <group ref={leftWingRef} position={[-0.28, 0.14, 0]}>
                  <mesh
                    material={materials.armor}
                    position={[-0.58, 0.24, -0.04]}
                    rotation={[0, 0, -1.18]}
                  >
                    <cylinderGeometry args={[0.045, 0.075, 1.28, 5]} />
                  </mesh>
                  <mesh material={materials.cyanCore} position={[-1.15, 0.48, -0.08]}>
                    <octahedronGeometry args={[0.095, 0]} />
                  </mesh>

                  <group ref={leftWingOuterRef}>
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.85, 0.72, -0.16]}
                      rotation={[0.1, 0, 1.25]}
                    >
                      <cylinderGeometry args={[0.015, 0.04, 1.55, 4]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.75, 0.35, -0.2]}
                      rotation={[0.12, 0, 1.78]}
                    >
                      <cylinderGeometry args={[0.012, 0.035, 1.32, 4]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.45, 0.05, -0.18]}
                      rotation={[0.12, 0, 2.25]}
                    >
                      <cylinderGeometry args={[0.012, 0.032, 1.08, 4]} />
                    </mesh>
                    <mesh
                      material={materials.violetEnergy}
                      position={[-1.05, -0.07, -0.15]}
                      rotation={[0.1, 0, 2.85]}
                    >
                      <cylinderGeometry args={[0.01, 0.028, 1.12, 4]} />
                    </mesh>

                    <mesh geometry={leftWingGeo} material={materials.wingMembrane} />
                    <mesh geometry={leftWingGeo} material={materials.wingWireframe} />
                  </group>
                </group>

                {/* Right Articulated Wing */}
                <group ref={rightWingRef} position={[0.28, 0.14, 0]}>
                  <mesh
                    material={materials.armor}
                    position={[0.58, 0.24, -0.04]}
                    rotation={[0, 0, 1.18]}
                  >
                    <cylinderGeometry args={[0.045, 0.075, 1.28, 5]} />
                  </mesh>
                  <mesh material={materials.cyanCore} position={[1.15, 0.48, -0.08]}>
                    <octahedronGeometry args={[0.095, 0]} />
                  </mesh>

                  <group ref={rightWingOuterRef}>
                    <mesh
                      material={materials.scaleTrim}
                      position={[1.85, 0.72, -0.16]}
                      rotation={[0.1, 0, -1.25]}
                    >
                      <cylinderGeometry args={[0.015, 0.04, 1.55, 4]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[1.75, 0.35, -0.2]}
                      rotation={[0.12, 0, -1.78]}
                    >
                      <cylinderGeometry args={[0.012, 0.035, 1.32, 4]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[1.45, 0.05, -0.18]}
                      rotation={[0.12, 0, -2.25]}
                    >
                      <cylinderGeometry args={[0.012, 0.032, 1.08, 4]} />
                    </mesh>
                    <mesh
                      material={materials.violetEnergy}
                      position={[1.05, -0.07, -0.15]}
                      rotation={[0.1, 0, -2.85]}
                    >
                      <cylinderGeometry args={[0.01, 0.028, 1.12, 4]} />
                    </mesh>

                    <mesh geometry={rightWingGeo} material={materials.wingMembrane} />
                    <mesh geometry={rightWingGeo} material={materials.wingWireframe} />
                  </group>
                </group>
              </group>
            )}

            {/* Tri-Blade Plasma Tail Fin */}
            {isTailTip && (
              <group position={[0, 0, -0.12]}>
                <mesh
                  material={materials.cyanCore}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={[0.16, 0.55, 0.05]}
                >
                  <coneGeometry args={[1, 1.4, 4]} />
                </mesh>
                <mesh
                  material={materials.violetEnergy}
                  position={[-0.14, 0, 0.08]}
                  rotation={[-Math.PI / 2, 0, 0.55]}
                  scale={[0.09, 0.38, 0.04]}
                >
                  <coneGeometry args={[1, 1.2, 4]} />
                </mesh>
                <mesh
                  material={materials.violetEnergy}
                  position={[0.14, 0, 0.08]}
                  rotation={[-Math.PI / 2, 0, -0.55]}
                  scale={[0.09, 0.38, 0.04]}
                >
                  <coneGeometry args={[1, 1.2, 4]} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* ==================== GPU-DRIVEN ELECTRIC HELICES ==================== */}
      <group ref={arcGroupRef}>
        <primitive object={lightningLine1} />
        <primitive object={lightningLine2} />
      </group>

      {/* ==================== ENERGY PULSE SHOCKWAVE RING ==================== */}
      <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 36]} />
        <meshBasicMaterial
          color={theme === 'light' ? '#0284C7' : '#00E5FF'}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
