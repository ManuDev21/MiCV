import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pointerStore } from '../../hooks/usePointerPosition';

const SEGMENT_COUNT = 26;
const LIGHTNING_POINTS = 18;

interface ElectricDragonProps {
  reducedMotion?: boolean;
  isMobile?: boolean;
  /**
   * Optional path to an external rigged GLB/GLTF dragon asset (e.g. "/models/electric-dragon.glb").
   * When not provided, renders the procedural articulated Cyber-Dragon rig.
   */
  modelUrl?: string;
}

/**
 * Creates a wing membrane BufferGeometry spanning between the wing root, wrist, and 4 wing finger tips.
 */
function createWingMembraneGeometry(side: 1 | -1): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const s = side;
  // Key anatomical points of the cyber wing
  const pShoulder = [0, 0, 0];
  const pWrist = [s * 1.15, 0.48, -0.08];
  const pTip1 = [s * 2.55, 0.95, -0.25];
  const pTip2 = [s * 2.35, 0.22, -0.32];
  const pTip3 = [s * 1.75, -0.38, -0.28];
  const pTip4 = [s * 0.95, -0.62, -0.22];

  const vertices = new Float32Array([
    // Panel 1: Wrist -> Tip1 -> Tip2
    ...pWrist, ...pTip1, ...pTip2,
    // Panel 2: Wrist -> Tip2 -> Tip3
    ...pWrist, ...pTip2, ...pTip3,
    // Panel 3: Wrist -> Tip3 -> Tip4
    ...pWrist, ...pTip3, ...pTip4,
    // Panel 4: Shoulder -> Wrist -> Tip4
    ...pShoulder, ...pWrist, ...pTip4,
  ]);

  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geo.computeVertexNormals();
  return geo;
}

export default function ElectricDragon({
  reducedMotion = false,
  isMobile = false,
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
  const dragonLightRef = useRef<THREE.PointLight>(null);

  const segmentRefs = useRef<(THREE.Group | null)[]>([]);
  const lightningGeo1Ref = useRef<THREE.BufferGeometry>(null);
  const lightningGeo2Ref = useRef<THREE.BufferGeometry>(null);

  const lastPulseSeen = useRef<number>(0);
  const pulseIntensity = useRef<number>(1.0); // Starts with entrance activation pulse

  // Shared materials memoized once for GPU efficiency
  const materials = useMemo(() => {
    const armor = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0E1422'),
      emissive: new THREE.Color('#1B1035'),
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.2,
    });

    const scaleTrim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B253B'),
      emissive: new THREE.Color('#8B5CF6'),
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.22,
    });

    const cyanCore = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F5FAFF'),
      emissive: new THREE.Color('#00E5FF'),
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const violetEnergy = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C4B5FD'),
      emissive: new THREE.Color('#8B5CF6'),
      emissiveIntensity: 1.8,
      roughness: 0.15,
    });

    const wingMembrane = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00E5FF'),
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const wingWireframe = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#8B5CF6'),
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const lightningMatCyan = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00E5FF'),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const lightningMatViolet = new THREE.LineBasicMaterial({
      color: new THREE.Color('#EC4899'),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
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

  const leftWingGeo = useMemo(() => createWingMembraneGeometry(-1), []);
  const rightWingGeo = useMemo(() => createWingMembraneGeometry(1), []);

  // Pre-allocated kinematic chain positions for smooth hierarchical spine/tail tracking
  const chainPositions = useMemo(
    () =>
      Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        return new THREE.Vector3(0, 0.2 - i * 0.08, -i * 0.22);
      }),
    []
  );

  const lightningPositions1 = useMemo(
    () => new Float32Array(LIGHTNING_POINTS * 3),
    []
  );
  const lightningPositions2 = useMemo(
    () => new Float32Array(LIGHTNING_POINTS * 3),
    []
  );

  const lightningLine1 = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(lightningPositions1, 3));
    return new THREE.Line(geo, materials.lightningMatCyan);
  }, [lightningPositions1, materials.lightningMatCyan]);

  const lightningLine2 = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(lightningPositions2, 3));
    return new THREE.Line(geo, materials.lightningMatViolet);
  }, [lightningPositions2, materials.lightningMatViolet]);

  // Anatomical scale profile for each vertebra along Neck -> Chest -> Waist -> Tail
  const segmentScales = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => {
      if (i < 4) return 0.72 - i * 0.04; // Neck
      if (i < 9) return 0.95 + Math.sin(((i - 4) / 5) * Math.PI) * 0.32; // Chest / Torso
      const tailT = (i - 9) / (SEGMENT_COUNT - 9);
      return Math.max(0.14, 0.88 * (1 - tailT * 0.85)); // Tapering tail
    });
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Detect pulse events triggered by user interactions
    if (pointerStore.pulseCount !== lastPulseSeen.current) {
      lastPulseSeen.current = pointerStore.pulseCount;
      pulseIntensity.current = 1.0;
    }
    pulseIntensity.current = THREE.MathUtils.damp(pulseIntensity.current, 0, 2.2, dt);

    const isExcited = pointerStore.excited || pulseIntensity.current > 0.25;
    const speedFactor = Math.min(1.5, pointerStore.speed);

    // Autonomous breathing & hovering + Cursor tracking target
    const idleWaveX = Math.sin(t * 0.9) * 0.45 + Math.cos(t * 0.45) * 0.25;
    const idleWaveY = Math.cos(t * 1.15) * 0.32 + Math.sin(t * 0.6) * 0.15;

    // Scroll depth adaptation: dragon glides smoothly across the viewport as user scrolls
    const scrollP = pointerStore.scrollProgress;
    const scrollOffsetX = Math.sin(scrollP * Math.PI * 2) * (isMobile ? 0.35 : 1.1);
    const scrollOffsetY = (scrollP - 0.2) * 0.6;
    const scrollOffsetZ = -Math.sin(scrollP * Math.PI) * 1.1;

    const baseOffsetX = isMobile ? 0.1 : 1.05;
    const baseOffsetY = isMobile ? 0.55 : 0.2;

    const targetX =
      baseOffsetX +
      scrollOffsetX +
      pointerStore.nx * (isMobile ? 0.9 : 2.15) +
      (reducedMotion ? 0 : idleWaveX * 0.4);
    const targetY =
      baseOffsetY +
      scrollOffsetY +
      pointerStore.ny * (isMobile ? 0.7 : 1.45) +
      (reducedMotion ? 0 : idleWaveY * 0.4);
    const targetZ = scrollOffsetZ + (isExcited ? 0.55 : 0);

    // 1. Update Head Position & Orientation with smooth spring-like damping
    const headPos = chainPositions[0];
    headPos.x = THREE.MathUtils.damp(headPos.x, targetX, 4.2, dt);
    headPos.y = THREE.MathUtils.damp(headPos.y, targetY, 4.2, dt);
    headPos.z = THREE.MathUtils.damp(headPos.z, targetZ, 3.5, dt);

    if (headRef.current) {
      headRef.current.position.copy(headPos);

      // Orient head toward cursor with organic pitch, yaw, and banking roll
      const dx = targetX - headPos.x;
      const dy = targetY - headPos.y;
      const targetYaw = THREE.MathUtils.clamp(
        pointerStore.nx * 0.65 + dx * 0.35,
        -0.85,
        0.85
      );
      const targetPitch = THREE.MathUtils.clamp(
        -pointerStore.ny * 0.48 - dy * 0.25,
        -0.6,
        0.6
      );
      const targetRoll = THREE.MathUtils.clamp(-dx * 0.45 - pointerStore.nx * 0.22, -0.55, 0.55);

      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        targetYaw,
        6,
        dt
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        targetPitch,
        6,
        dt
      );
      headRef.current.rotation.z = THREE.MathUtils.damp(
        headRef.current.rotation.z,
        targetRoll,
        5,
        dt
      );
    }

    // Jaw breathing + opens wider on excitement / pulse
    if (jawRef.current) {
      const jawOpen =
        0.12 +
        Math.sin(t * 2.4) * 0.06 +
        (isExcited ? 0.28 : 0) +
        pulseIntensity.current * 0.35;
      jawRef.current.rotation.x = THREE.MathUtils.damp(
        jawRef.current.rotation.x,
        jawOpen,
        8,
        dt
      );
    }

    // 2. Update Hierarchical Spine, Torso, and Serpentine Tail
    for (let i = 1; i < SEGMENT_COUNT; i++) {
      const prev = chainPositions[i - 1];
      const curr = chainPositions[i];

      const segSpacing = i < 6 ? 0.19 : 0.22;
      const waveAmp = reducedMotion ? 0.02 : (0.04 + (i / SEGMENT_COUNT) * 0.18) * (1 + speedFactor * 0.35);
      const waveFreq = t * (3.2 + (isExcited ? 1.2 : 0)) - i * 0.38;

      const desiredX = prev.x + Math.sin(waveFreq) * waveAmp - pointerStore.nx * 0.04 * i * 0.15;
      const desiredY = prev.y + Math.cos(waveFreq * 0.85) * (waveAmp * 0.65) - 0.035;
      const desiredZ = prev.z - segSpacing;

      const followSpeed = Math.max(3.5, 16 - i * 0.42);
      curr.x = THREE.MathUtils.damp(curr.x, desiredX, followSpeed, dt);
      curr.y = THREE.MathUtils.damp(curr.y, desiredY, followSpeed, dt);
      curr.z = THREE.MathUtils.damp(curr.z, desiredZ, followSpeed, dt);

      const segGroup = segmentRefs.current[i];
      if (segGroup) {
        segGroup.position.copy(curr);
        segGroup.lookAt(prev);
        segGroup.rotateZ(Math.sin(waveFreq) * 0.18);
      }
    }

    // Also position segment 0 at head
    if (segmentRefs.current[0]) {
      segmentRefs.current[0].position.copy(headPos);
    }

    // 3. Articulated Wing Flapping & Cursor Banking
    const flapSpeed = reducedMotion ? 0.6 : isExcited ? 4.4 : 2.35;
    const flapBase = Math.sin(t * flapSpeed);
    const flapSecondary = Math.cos(t * flapSpeed - 0.65);
    const wingSpanBoost = isExcited ? 0.25 : 0;

    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = flapBase * (reducedMotion ? 0.08 : 0.42) + wingSpanBoost;
      const wingSweep = Math.sin(t * flapSpeed * 0.5) * 0.12 + pointerStore.ny * 0.15;

      leftWingRef.current.rotation.z = THREE.MathUtils.damp(
        leftWingRef.current.rotation.z,
        -wingAngle + pointerStore.nx * 0.15,
        7,
        dt
      );
      leftWingRef.current.rotation.y = THREE.MathUtils.damp(
        leftWingRef.current.rotation.y,
        0.22 + wingSweep,
        6,
        dt
      );

      rightWingRef.current.rotation.z = THREE.MathUtils.damp(
        rightWingRef.current.rotation.z,
        wingAngle + pointerStore.nx * 0.15,
        7,
        dt
      );
      rightWingRef.current.rotation.y = THREE.MathUtils.damp(
        rightWingRef.current.rotation.y,
        -0.22 - wingSweep,
        6,
        dt
      );
    }

    if (leftWingOuterRef.current && rightWingOuterRef.current) {
      const outerFlex = flapSecondary * (reducedMotion ? 0.05 : 0.28);
      leftWingOuterRef.current.rotation.z = outerFlex;
      rightWingOuterRef.current.rotation.z = -outerFlex;
    }

    // 4. Dynamic Core & Eye Emissive Pulsation
    const energyLevel =
      1.8 +
      Math.sin(t * 3.8) * 0.4 +
      speedFactor * 0.65 +
      pulseIntensity.current * 2.2;
    materials.cyanCore.emissiveIntensity = energyLevel;
    materials.violetEnergy.emissiveIntensity = energyLevel * 0.85;

    if (chestCoreRef.current) {
      chestCoreRef.current.rotation.y += dt * 1.8;
      chestCoreRef.current.rotation.z -= dt * 1.2;
      const coreScale = 1 + Math.sin(t * 4.5) * 0.12 + pulseIntensity.current * 0.4;
      chestCoreRef.current.scale.setScalar(coreScale);
    }

    if (dragonLightRef.current) {
      dragonLightRef.current.position.copy(headPos);
      dragonLightRef.current.intensity = 1.6 + pulseIntensity.current * 2.5;
    }

    // 5. Shockwave Ring on Pulse / Activation
    if (pulseRingRef.current) {
      const chestPos = chainPositions[5] || headPos;
      pulseRingRef.current.position.copy(chestPos);
      const p = 1 - pulseIntensity.current;
      const ringScale = 0.5 + p * 5.5;
      pulseRingRef.current.scale.setScalar(ringScale);
      const ringMat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, pulseIntensity.current * 0.65);
    }

    // 6. Procedural Electric Arcs along the Dragon's Silhouette
    if (!reducedMotion) {
      for (let k = 0; k < LIGHTNING_POINTS; k++) {
        const segIdx = Math.min(
          SEGMENT_COUNT - 1,
          Math.floor((k / (LIGHTNING_POINTS - 1)) * (SEGMENT_COUNT - 1))
        );
        const segP = chainPositions[segIdx];
        const jitterAmp = (0.09 + speedFactor * 0.08 + pulseIntensity.current * 0.22) *
          Math.sin((k / LIGHTNING_POINTS) * Math.PI);

        lightningPositions1[k * 3] = segP.x + (Math.random() - 0.5) * jitterAmp * 2.4;
        lightningPositions1[k * 3 + 1] = segP.y + 0.18 + (Math.random() - 0.5) * jitterAmp * 2.0;
        lightningPositions1[k * 3 + 2] = segP.z + (Math.random() - 0.5) * jitterAmp;

        lightningPositions2[k * 3] = segP.x + Math.sin(t * 8 + k) * 0.22 + (Math.random() - 0.5) * jitterAmp * 2.2;
        lightningPositions2[k * 3 + 1] = segP.y - 0.1 + Math.cos(t * 7 + k) * 0.18 + (Math.random() - 0.5) * jitterAmp * 2.0;
        lightningPositions2[k * 3 + 2] = segP.z + (Math.random() - 0.5) * jitterAmp;
      }

      if (lightningGeo1Ref.current) {
        lightningGeo1Ref.current.attributes.position.needsUpdate = true;
      }
      if (lightningGeo2Ref.current) {
        lightningGeo2Ref.current.attributes.position.needsUpdate = true;
      }
      (lightningLine1.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lightningLine2.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  const dragonScale = isMobile ? 0.68 : 0.92;

  return (
    <group ref={rootRef} scale={dragonScale}>
      <pointLight
        ref={dragonLightRef}
        color="#00E5FF"
        intensity={1.8}
        distance={9}
        decay={2}
      />

      {/* ==================== DRAGON HEAD ASSEMBLY ==================== */}
      <group ref={headRef}>
        {/* Main Armored Cranium */}
        <mesh material={materials.armor} position={[0, 0.05, 0]} scale={[0.42, 0.32, 0.58]}>
          <octahedronGeometry args={[1, 1]} />
        </mesh>

        {/* Sculpted Upper Snout / Muzzle */}
        <mesh
          material={materials.scaleTrim}
          position={[0, -0.02, 0.48]}
          rotation={[Math.PI * 0.48, 0, 0]}
          scale={[0.28, 0.48, 0.22]}
        >
          <coneGeometry args={[1, 1.5, 6]} />
        </mesh>

        {/* Glowing Nasal Plasma Vents */}
        <mesh material={materials.cyanCore} position={[-0.09, 0.02, 0.72]}>
          <sphereGeometry args={[0.028, 8, 8]} />
        </mesh>
        <mesh material={materials.cyanCore} position={[0.09, 0.02, 0.72]}>
          <sphereGeometry args={[0.028, 8, 8]} />
        </mesh>

        {/* Luminous Cyber-Dragon Eyes */}
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

        {/* Swept-Back Main Plasma Horns (Left & Right) */}
        <group position={[-0.24, 0.24, -0.15]} rotation={[-0.85, -0.38, 0.22]}>
          <mesh material={materials.armor} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.09, 0.85, 6]} />
          </mesh>
          <mesh material={materials.cyanCore} position={[0, 0.72, 0]}>
            <coneGeometry args={[0.045, 0.42, 5]} />
          </mesh>
        </group>
        <group position={[0.24, 0.24, -0.15]} rotation={[-0.85, 0.38, -0.22]}>
          <mesh material={materials.armor} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.09, 0.85, 6]} />
          </mesh>
          <mesh material={materials.cyanCore} position={[0, 0.72, 0]}>
            <coneGeometry args={[0.045, 0.42, 5]} />
          </mesh>
        </group>

        {/* Secondary Cheek / Crown Blades */}
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

        {/* Articulated Lower Jaw + Inner Plasma Breath Core */}
        <group ref={jawRef} position={[0, -0.1, 0.08]}>
          <mesh
            material={materials.armor}
            position={[0, -0.04, 0.32]}
            rotation={[Math.PI * 0.52, 0, 0]}
            scale={[0.22, 0.42, 0.14]}
          >
            <coneGeometry args={[1, 1.35, 5]} />
          </mesh>
          {/* Inner Mouth Plasma Core */}
          <mesh material={materials.cyanCore} position={[0, 0.02, 0.24]}>
            <sphereGeometry args={[0.085, 10, 10]} />
          </mesh>
        </group>
      </group>

      {/* ==================== HIERARCHICAL SPINE, CHEST, WINGS & TAIL ==================== */}
      {segmentScales.map((s, idx) => {
        const isChestAttachment = idx === 5;
        const isTailTip = idx === SEGMENT_COUNT - 1;
        const hasRibs = idx >= 4 && idx <= 9;

        return (
          <group
            key={idx}
            ref={(el) => {
              segmentRefs.current[idx] = el;
            }}
          >
            {/* Vertebra Armored Core */}
            <mesh material={materials.armor} scale={[s * 0.34, s * 0.28, s * 0.38]}>
              <octahedronGeometry args={[1, 0]} />
            </mesh>

            {/* Glowing Neural Conduit Ring */}
            <mesh
              material={idx % 2 === 0 ? materials.cyanCore : materials.violetEnergy}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[s * 0.25, s * 0.25, s * 0.12]}
            >
              <torusGeometry args={[1, 0.14, 6, 16]} />
            </mesh>

            {/* Dorsal Spine Blade Fin */}
            <mesh
              material={idx % 3 === 0 ? materials.cyanCore : materials.scaleTrim}
              position={[0, s * 0.34, -0.04]}
              rotation={[-0.55, 0, 0]}
            >
              <coneGeometry args={[s * 0.08, s * 0.46, 4]} />
            </mesh>

            {/* Thoracic Armored Ribs on Chest Segments */}
            {hasRibs && (
              <>
                <mesh
                  material={materials.scaleTrim}
                  position={[-s * 0.35, -0.05, 0]}
                  rotation={[0, 0, 0.65]}
                >
                  <boxGeometry args={[s * 0.42, 0.045, 0.09]} />
                </mesh>
                <mesh
                  material={materials.scaleTrim}
                  position={[s * 0.35, -0.05, 0]}
                  rotation={[0, 0, -0.65]}
                >
                  <boxGeometry args={[s * 0.42, 0.045, 0.09]} />
                </mesh>
              </>
            )}

            {/* CHEST HEART CORE & ARTICULATED DUAL WINGS ATTACHED AT SEGMENT 5 */}
            {isChestAttachment && (
              <group>
                {/* Glowing Plasma Dragon Heart */}
                <mesh ref={chestCoreRef} material={materials.cyanCore} position={[0, -0.06, 0]}>
                  <icosahedronGeometry args={[0.24, 1]} />
                </mesh>

                {/* Left Articulated Wing */}
                <group ref={leftWingRef} position={[-0.28, 0.14, 0]}>
                  {/* Inner Wing Bone (Humerus -> Wrist) */}
                  <mesh
                    material={materials.armor}
                    position={[-0.58, 0.24, -0.04]}
                    rotation={[0, 0, -1.18]}
                  >
                    <cylinderGeometry args={[0.045, 0.075, 1.28, 6]} />
                  </mesh>
                  {/* Wrist Energy Node */}
                  <mesh material={materials.cyanCore} position={[-1.15, 0.48, -0.08]}>
                    <octahedronGeometry args={[0.095, 0]} />
                  </mesh>

                  {/* Outer Wing Fingers & Holographic Membrane */}
                  <group ref={leftWingOuterRef}>
                    {/* 4 Wing Finger Struts */}
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.85, 0.72, -0.16]}
                      rotation={[0.1, 0, 1.25]}
                    >
                      <cylinderGeometry args={[0.015, 0.04, 1.55, 5]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.75, 0.35, -0.2]}
                      rotation={[0.12, 0, 1.78]}
                    >
                      <cylinderGeometry args={[0.012, 0.035, 1.32, 5]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[-1.45, 0.05, -0.18]}
                      rotation={[0.12, 0, 2.25]}
                    >
                      <cylinderGeometry args={[0.012, 0.032, 1.08, 5]} />
                    </mesh>
                    <mesh
                      material={materials.violetEnergy}
                      position={[-1.05, -0.07, -0.15]}
                      rotation={[0.1, 0, 2.85]}
                    >
                      <cylinderGeometry args={[0.01, 0.028, 1.12, 5]} />
                    </mesh>

                    {/* Dual-Layer Holographic Wing Membrane */}
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
                    <cylinderGeometry args={[0.045, 0.075, 1.28, 6]} />
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
                      <cylinderGeometry args={[0.015, 0.04, 1.55, 5]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[1.75, 0.35, -0.2]}
                      rotation={[0.12, 0, -1.78]}
                    >
                      <cylinderGeometry args={[0.012, 0.035, 1.32, 5]} />
                    </mesh>
                    <mesh
                      material={materials.scaleTrim}
                      position={[1.45, 0.05, -0.18]}
                      rotation={[0.12, 0, -2.25]}
                    >
                      <cylinderGeometry args={[0.012, 0.032, 1.08, 5]} />
                    </mesh>
                    <mesh
                      material={materials.violetEnergy}
                      position={[1.05, -0.07, -0.15]}
                      rotation={[0.1, 0, -2.85]}
                    >
                      <cylinderGeometry args={[0.01, 0.028, 1.12, 5]} />
                    </mesh>

                    <mesh geometry={rightWingGeo} material={materials.wingMembrane} />
                    <mesh geometry={rightWingGeo} material={materials.wingWireframe} />
                  </group>
                </group>
              </group>
            )}

            {/* Tri-Blade Plasma Tail Fin on Final Segment */}
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

      {/* ==================== ELECTRIC LIGHTNING ARCS ==================== */}
      <primitive object={lightningLine1} />
      <primitive object={lightningLine2} />

      {/* ==================== ENERGY PULSE SHOCKWAVE RING ==================== */}
      <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 48]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
