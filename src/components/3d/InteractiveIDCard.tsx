import {
  useEffect,
  useRef,
  useState,
  PointerEvent as ReactPointerEvent,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  FiRefreshCw,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMove,
  FiZap,
  FiShield,
} from 'react-icons/fi';
import { profile, skills } from '../../data/profile';
import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';
import { setDragonExcited, triggerDragonPulse } from '../../hooks/usePointerPosition';

function elasticClamp(val: number, max: number): number {
  const sign = Math.sign(val);
  const abs = Math.abs(val);
  if (abs <= max) return val;
  return sign * (max + (abs - max) * 0.28);
}

export default function InteractiveIDCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number }>({
    startX: 0,
    startY: 0,
  });
  const didDragRef = useRef(false);

  // Target displacement values (0, 0 is the exact initial rest position)
  const rawX = useMotionValue(reducedMotion ? 0 : -28);
  const rawY = useMotionValue(reducedMotion ? 0 : -270);

  // Underdamped spring physics for realistic gravity drop, elastic pull, and rebound
  const springX = useSpring(rawX, {
    stiffness: 215,
    damping: 11.5,
    mass: 1.05,
  });
  const springY = useSpring(rawY, {
    stiffness: 225,
    damping: 11.0,
    mass: 1.1,
  });

  // Trigger initial gravity drop & bounce on mount
  useEffect(() => {
    if (reducedMotion) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const timer = setTimeout(() => {
      rawX.set(0);
      rawY.set(0);
    }, 180);
    return () => clearTimeout(timer);
  }, [reducedMotion, rawX, rawY]);

  // Function to replay the drop & bounce animation on demand
  const triggerDropBounce = () => {
    if (reducedMotion) return;
    springY.jump(-220);
    springX.jump((Math.random() - 0.5) * 45);
    rawX.set(0);
    rawY.set(0);
    triggerDragonPulse();
  };

  // Relative pointer hover coordinates [-0.5, 0.5] for 3D tilt & glare
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothPointerX = useSpring(pointerX, { stiffness: 200, damping: 20 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 200, damping: 20 });

  // 3D rotations combining pointer hover + elastic pull vector
  const rotateX = useTransform(
    [smoothPointerY, springY],
    ([py, sy]: number[]) => {
      if (reducedMotion) return 0;
      return -py * 18 - Math.max(-22, Math.min(22, sy * 0.11));
    }
  );

  const rotateY = useTransform(
    [smoothPointerX, springX],
    ([px, sx]: number[]) => {
      if (reducedMotion) return 0;
      return px * 20 + Math.max(-24, Math.min(24, sx * 0.14));
    }
  );

  // Pendulum swing rotation when pulled left/right
  const rotateZ = useTransform(springX, (sx: number) =>
    reducedMotion ? 0 : Math.max(-16, Math.min(16, -sx * 0.085))
  );

  // Dynamic SVG Lanyard Strap Path connecting fixed top anchor (170, 8) to badge clip (170 + sx, 76 + sy)
  const lanyardPath = useTransform(
    [springX, springY],
    ([sx, sy]: number[]) => {
      const anchorX = 170;
      const anchorY = 8;
      const clipX = 170 + sx;
      const clipY = Math.max(24, 78 + sy);
      const ctrlX = anchorX + sx * 0.38;
      const ctrlY = (anchorY + clipY) * 0.52 + Math.max(0, 14 - sy * 0.08);
      return `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${clipX.toFixed(1)} ${clipY.toFixed(1)}`;
    }
  );

  const glareX = useTransform(smoothPointerX, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(smoothPointerY, [-0.5, 0.5], ['10%', '90%']);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX - rawX.get(),
      startY: e.clientY - rawY.get(),
    };
    didDragRef.current = false;
    setIsDragging(true);
    setDragonExcited(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      if (Math.hypot(dx, dy) > 5) {
        didDragRef.current = true;
      }

      const isSmallScreen = window.innerWidth < 640;
      const maxH = isSmallScreen ? 75 : 145;
      const maxUp = isSmallScreen ? 55 : 75;
      const maxDown = isSmallScreen ? 135 : 185;

      const clampedX = elasticClamp(dx, maxH);
      const clampedY = dy < 0 ? elasticClamp(dy, maxUp) : elasticClamp(dy, maxDown);

      rawX.set(clampedX);
      rawY.set(clampedY);
      return;
    }

    if (!cardRef.current || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(rx);
    pointerY.set(ry);
  };

  const handlePointerRelease = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setDragonExcited(false);

    // Snap back to initial (0, 0) position with elastic spring rebound!
    rawX.set(0);
    rawY.set(0);
    pointerX.set(0);
    pointerY.set(0);
    triggerDragonPulse();

    setTimeout(() => {
      didDragRef.current = false;
    }, 120);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setDragonExcited(true);
  };

  const handleMouseLeave = (_: MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    if (!isDragging) {
      setDragonExcited(false);
      pointerX.set(0);
      pointerY.set(0);
    }
  };

  const toggleFlip = () => {
    if (didDragRef.current) return;
    setIsFlipped((prev) => !prev);
    triggerDragonPulse();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  const topSkills = [
    ...skills.Frontend.slice(0, 3),
    ...skills.Backend.slice(0, 3),
    ...skills['Bases de datos'].slice(0, 2),
  ];

  return (
    <div className="relative w-full max-w-full flex flex-col items-center justify-center pt-14 sm:pt-16 pb-4 select-none overflow-visible">
      {/* Ambient Holographic Rings behind Badge */}
      <div className="pointer-events-none absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-nexus-cyan/15 animate-pulse-slow" />

      {/* Dynamic Elastic Lanyard Strap SVG anchored at top */}
      <svg
        viewBox="0 0 340 260"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] h-[240px] sm:h-[260px] z-20 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nexusLanyardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Top Fixed Ceiling Pin */}
        <circle cx="170" cy="8" r="6" fill="#00E5FF" opacity="0.35" />
        <circle cx="170" cy="8" r="3.5" fill="#F5FAFF" stroke="#00E5FF" strokeWidth="2" />

        {/* Outer Glow Ribbon */}
        <motion.path
          d={lanyardPath}
          fill="none"
          stroke="url(#nexusLanyardGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.28"
        />
        {/* Core Elastic Strap */}
        <motion.path
          d={lanyardPath}
          fill="none"
          stroke="url(#nexusLanyardGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Draggable & Spring-Rebounding 3D ID Card */}
      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerRelease}
        onPointerCancel={handlePointerRelease}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`Gafete holográfico interactivo de ${profile.name}. Jálalo hacia abajo o los lados para estirar la correa y suéltalo para que rebote a su lugar.`}
        data-cursor="drag"
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
          rotateZ,
          transformPerspective: 1200,
          touchAction: 'none',
        }}
        className={`relative z-30 w-full max-w-[295px] sm:max-w-[340px] rounded-[24px] sm:rounded-[26px] p-[1.5px] will-change-transform transition-shadow duration-300 ${
          isDragging
            ? 'cursor-grabbing shadow-[0_0_50px_rgba(0,229,255,0.5),0_28px_65px_rgba(3,4,7,0.75)] scale-[1.02]'
            : 'cursor-grab shadow-[0_22px_55px_-12px_rgba(3,4,7,0.65),0_0_26px_rgba(139,92,246,0.22)]'
        }`}
      >
        {/* Top Metallic Lanyard Clip attached to the card */}
        <div className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 w-14 h-5 rounded-md neu-surface border border-nexus-cyan/45 flex items-center justify-center shadow-neon-cyan">
          <div className="w-6 h-1.5 rounded-full bg-nexus-cyan" />
        </div>

        {/* Outer Animated Electric Gradient Frame */}
        <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-nexus-cyan via-nexus-violet to-nexus-magenta opacity-75 pointer-events-none" />

        {/* Inner Crystal Badge Body */}
        <div className="relative rounded-[25px] glass-crystal overflow-hidden p-5 sm:p-6">
          {/* Dynamic Specular Pointer Glare */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered || isDragging ? 0.75 : 0.2,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(260px circle at ${gx} ${gy}, rgba(0, 229, 255, 0.2), rgba(139, 92, 246, 0.1) 45%, transparent 75%)`
              ),
            }}
          />

          {/* Top Lanyard Slot Cutout & Badge Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 pb-3.5 border-b border-nexus-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan animate-pulse" />
              <span className="font-display text-[10px] tracking-[0.26em] uppercase text-nexus-cyan">
                NEXUS // ID-CARD
              </span>
            </div>

            {/* Lanyard punch hole */}
            <div className="w-10 h-2 rounded-full neu-pressed" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              aria-label={isFlipped ? 'Ver frente del gafete' : 'Ver reverso del gafete'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider neu-button text-nexus-cyan hover:text-nexus-white"
            >
              <FiRefreshCw
                className={`transition-transform duration-500 ${
                  isFlipped ? 'rotate-180' : ''
                }`}
              />
              {isFlipped ? 'Frente' : 'Reverso'}
            </button>
          </div>

          {/* ==================== FRONT / BACK CONTENT ==================== */}
          {!isFlipped ? (
            /* FRONT FACE: Personal Photo, Identity, Core Stack & Quick Links */
            <div className="relative z-10 mt-4">
              {/* Holographic Portrait Frame */}
              <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40 rounded-2xl p-[2px] bg-gradient-to-br from-nexus-cyan via-nexus-violet to-nexus-plasma shadow-neon">
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-nexus-abyss">
                  {!imgError ? (
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      draggable={false}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-center select-none pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-gradient-to-br from-nexus-abyss to-nexus-surface font-display text-3xl text-gradient">
                      MRC
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 229, 255, 0.16) 4px)',
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg glass-strong border border-nexus-cyan/40 flex items-center gap-1 text-[10px] font-display text-nexus-cyan shadow-neon-cyan">
                  <FiShield className="text-xs" /> FULL STACK
                </div>
              </div>

              {/* Identity Details */}
              <div className="mt-4 text-center">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide text-nexus-white leading-tight">
                  {profile.name}
                </h2>
                <p className="mt-1 text-xs font-grotesk text-nexus-cyan tracking-wide font-medium">
                  {profile.role}
                </p>
                <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-[11px] text-nexus-muted">
                  <FiMapPin className="text-nexus-violet shrink-0" />
                  <span className="truncate max-w-[240px]">{profile.location}</span>
                </p>
              </div>

              {/* Core Stack Pills */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {['React', 'TypeScript', 'NestJS', 'FastAPI', 'Python', 'MySQL'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-medium neu-pressed text-nexus-white/90"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-4 pt-3.5 border-t border-nexus-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub de Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-cyan"
                  >
                    <FiGithub size={15} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn de Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-violet"
                  >
                    <FiLinkedin size={15} />
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Enviar correo a Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-magenta"
                  >
                    <FiMail size={15} />
                  </a>
                </div>

                <a
                  href={profile.cv}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-display uppercase tracking-wider bg-gradient-to-r from-nexus-violet to-nexus-cyan text-[#F5FAFF] shadow-neon hover:brightness-110 transition"
                >
                  <FiDownload size={13} /> CV PDF
                </a>
              </div>
            </div>
          ) : (
            /* BACK FACE: Technical Matrix, Real Metrics & Direct GitHub Access */
            <div className="relative z-10 mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-display uppercase tracking-[0.2em] text-nexus-muted">
                  Arquitectura & Stack
                </span>
                <span className="text-[10px] font-mono text-nexus-cyan">
                  DESIGN-ID // MRC-2026
                </span>
              </div>

              {/* Highlighted Skills Grid */}
              <div className="grid grid-cols-2 gap-2">
                {topSkills.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 p-2 rounded-lg neu-pressed"
                  >
                    <s.icon className="text-nexus-cyan text-sm shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-nexus-white truncate">
                        {s.name}
                      </div>
                      <div className="w-full h-1 bg-nexus-border/20 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-nexus-violet to-nexus-cyan rounded-full"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real Profile Stats */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {profile.stats.map((st) => (
                  <div
                    key={st.label}
                    className="p-2 rounded-lg neu-pressed text-center"
                  >
                    <div className="font-display text-xs text-nexus-cyan font-bold">
                      {st.value}+
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-nexus-muted truncate mt-0.5">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified GitHub Destination Card */}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl glass hover:border-nexus-cyan/40 transition group"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-display uppercase tracking-widest text-nexus-cyan">
                    Repositorio Oficial
                  </div>
                  <div className="text-xs text-nexus-white truncate group-hover:underline">
                    github.com/ManuDev21
                  </div>
                </div>
                <svg
                  viewBox="0 0 36 36"
                  className="w-9 h-9 p-1 rounded bg-nexus-white text-nexus-void shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M2 2h10v10H2V2zm2 2v6h6V4H4zm2 2h2v2H6V6zm18-4h10v10H24V2zm2 2v6h6V4h-6zm2 2h2v2h-2V6zM2 24h10v10H2V24zm2 2v6h6v-6H4zm2 2h2v2H6v-2zm10-24h4v4h-4V4zm4 4h4v4h-4V8zm-4 6h6v4h-6v-4zm8 2h6v4h-6v-4zm-8 6h4v6h-4v-6zm6 2h8v8h-8v-8zm2 2v4h4v-4h-4z"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* Interactive Footer Hint */}
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-nexus-border flex items-center justify-between text-[10px] text-nexus-muted">
            <span className="inline-flex items-center gap-1">
              <FiMove className="text-nexus-cyan" /> Jala el gafete y suéltalo
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerDropBounce();
              }}
              className="inline-flex items-center gap-1 text-nexus-violet hover:text-nexus-cyan transition font-medium"
            >
              <FiZap /> Rebotar Gafete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
