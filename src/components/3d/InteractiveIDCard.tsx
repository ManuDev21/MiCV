import { useRef, useState, MouseEvent, KeyboardEvent } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  PanInfo,
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

export default function InteractiveIDCard() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const didDragRef = useRef(false);

  // Drag position motion values with spring return / stabilization
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.75 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.75 });

  // Pointer relative coordinates [-0.5, 0.5] for 3D tilt & glare
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothPointerX = useSpring(pointerX, { stiffness: 220, damping: 22 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 220, damping: 22 });

  // Combine pointer hover tilt + drag inertia tilt
  const rotateX = useTransform(
    [smoothPointerY, springY],
    ([py, sy]: number[]) => {
      if (reducedMotion) return 0;
      return -py * 22 - Math.max(-18, Math.min(18, sy * 0.08));
    }
  );

  const rotateY = useTransform(
    [smoothPointerX, springX],
    ([px, sx]: number[]) => {
      if (reducedMotion) return 0;
      return px * 24 + Math.max(-22, Math.min(22, sx * 0.1));
    }
  );

  const rotateZ = useTransform(springX, (sx: number) =>
    reducedMotion ? 0 : Math.max(-10, Math.min(10, sx * 0.045))
  );

  const glareX = useTransform(smoothPointerX, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(smoothPointerY, [-0.5, 0.5], ['10%', '90%']);

  // Top lanyard tether dynamic angle
  const lanyardAngle = useTransform(springX, (sx: number) =>
    Math.max(-25, Math.min(25, -sx * 0.12))
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width - 0.5;
    const ry = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(rx);
    pointerY.set(ry);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setDragonExcited(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDragonExcited(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleDragStart = () => {
    didDragRef.current = true;
    setIsDragging(true);
    setDragonExcited(true);
  };

  const handleDrag = (
    _: globalThis.MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (reducedMotion) return;
    const vx = Math.max(-0.5, Math.min(0.5, info.velocity.x / 900));
    const vy = Math.max(-0.5, Math.min(0.5, info.velocity.y / 900));
    pointerX.set(vx);
    pointerY.set(vy);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragonExcited(false);
    // Smoothly return to equilibrium anchor with damped spring physics
    x.set(0);
    y.set(0);
    pointerX.set(0);
    pointerY.set(0);
    triggerDragonPulse();
    setTimeout(() => {
      didDragRef.current = false;
    }, 140);
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
    <div
      ref={constraintsRef}
      className="relative w-full flex flex-col items-center justify-center py-4 select-none"
    >
      {/* Ambient Holographic Rings behind Badge */}
      <div className="pointer-events-none absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-nexus-cyan/15 animate-pulse-slow" />
      <div className="pointer-events-none absolute w-88 h-88 sm:w-96 sm:h-96 rounded-full border border-nexus-violet/10" />

      {/* Top Holographic Lanyard / Suspension Tether */}
      <motion.div
        style={{ rotateZ: lanyardAngle }}
        className="pointer-events-none flex flex-col items-center -mb-2 z-20 origin-top"
      >
        <div className="w-3 h-3 rounded-full bg-nexus-cyan shadow-neon-cyan border border-white/80" />
        <div className="w-0.5 h-10 bg-gradient-to-b from-nexus-cyan via-nexus-violet to-nexus-cyan/40" />
        {/* Metallic Lanyard Clip */}
        <div className="w-14 h-4 rounded-md neu-surface border border-nexus-cyan/40 flex items-center justify-center shadow-neon-cyan">
          <div className="w-6 h-1 rounded-full bg-nexus-cyan/80" />
        </div>
      </motion.div>

      {/* Draggable 3D ID Card Container */}
      <motion.div
        ref={cardRef}
        drag
        dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
        dragElastic={0.28}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`Gafete holográfico interactivo de ${profile.name}. Arrastra para mover o presiona Enter para voltear.`}
        data-cursor="drag"
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
          rotateZ,
          transformPerspective: 1200,
        }}
        animate={
          !isDragging && !isHovered && !reducedMotion
            ? { y: [0, -7, 0] }
            : undefined
        }
        transition={
          !isDragging && !isHovered && !reducedMotion
            ? { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
        className={`relative w-[305px] sm:w-[340px] rounded-[26px] p-[1.5px] transition-shadow duration-300 ${
          isDragging
            ? 'cursor-grabbing shadow-[0_0_55px_rgba(0,229,255,0.55),0_30px_70px_rgba(3,4,7,0.95)] scale-[1.03]'
            : 'cursor-grab shadow-[0_25px_65px_-12px_rgba(3,4,7,0.9),0_0_30px_rgba(139,92,246,0.28)]'
        }`}
      >
        {/* Outer Animated Electric Gradient Frame */}
        <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-nexus-cyan via-nexus-violet to-nexus-magenta opacity-75 pointer-events-none" />

        {/* Drag Sparks Burst when actively dragging */}
        {isDragging && (
          <div className="pointer-events-none absolute -inset-3 rounded-[32px] border border-nexus-cyan/50 animate-ping opacity-30" />
        )}

        {/* Inner Crystal Badge Body */}
        <div className="relative rounded-[25px] glass-crystal overflow-hidden p-5 sm:p-6">
          {/* Dynamic Specular Pointer Glare */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered || isDragging ? 0.85 : 0.25,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(280px circle at ${gx} ${gy}, rgba(0, 229, 255, 0.22), rgba(139, 92, 246, 0.12) 45%, transparent 75%)`
              ),
            }}
          />

          {/* Top Lanyard Slot Cutout & Badge Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nexus-cyan shadow-neon-cyan animate-pulse" />
              <span className="font-display text-[10px] tracking-[0.26em] uppercase text-nexus-cyan">
                NEXUS // ID-CARD
              </span>
            </div>

            {/* Lanyard punch hole */}
            <div className="w-10 h-2 rounded-full neu-pressed border border-white/10" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              aria-label={isFlipped ? 'Ver frente del gafete' : 'Ver reverso del gafete'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider neu-button text-nexus-cyan hover:text-white"
            >
              <FiRefreshCw className={`transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
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
                  {/* Subtle Hologram Scanline Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 229, 255, 0.18) 4px)',
                    }}
                  />
                </div>
                {/* Verified Developer Corner Badge */}
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg glass-strong border border-nexus-cyan/40 flex items-center gap-1 text-[10px] font-display text-nexus-cyan shadow-neon-cyan">
                  <FiShield className="text-xs" /> FULL STACK
                </div>
              </div>

              {/* Identity Details */}
              <div className="mt-4 text-center">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide text-nexus-white leading-tight">
                  {profile.name}
                </h2>
                <p className="mt-1 text-xs font-grotesk text-nexus-cyan tracking-wide">
                  {profile.role}
                </p>
                <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-[11px] text-nexus-muted">
                  <FiMapPin className="text-nexus-violet shrink-0" />
                  <span className="truncate max-w-[240px]">{profile.location}</span>
                </p>
              </div>

              {/* Core Stack Pills */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {['React', 'TypeScript', 'NestJS', 'GraphQL', 'Python', 'MySQL'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-nexus-void/75 border border-white/10 text-nexus-white/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Bottom Action Bar + Valid GitHub QR Matrix */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (didDragRef.current) e.preventDefault();
                    }}
                    aria-label="GitHub de Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-cyan"
                  >
                    <FiGithub size={15} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (didDragRef.current) e.preventDefault();
                    }}
                    aria-label="LinkedIn de Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-violet"
                  >
                    <FiLinkedin size={15} />
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={(e) => {
                      if (didDragRef.current) e.preventDefault();
                    }}
                    aria-label="Enviar correo a Manuel Rodríguez Calderón"
                    className="w-8 h-8 rounded-lg neu-button grid place-items-center text-nexus-white hover:text-nexus-magenta"
                  >
                    <FiMail size={15} />
                  </a>
                </div>

                <a
                  href={profile.cv}
                  download
                  onClick={(e) => {
                    if (didDragRef.current) e.preventDefault();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-display uppercase tracking-wider bg-gradient-to-r from-nexus-violet to-nexus-cyan text-nexus-white shadow-neon hover:brightness-110 transition"
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
                    className="flex items-center gap-2 p-2 rounded-lg neu-pressed border border-white/5"
                  >
                    <s.icon className="text-nexus-cyan text-sm shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-nexus-white truncate">
                        {s.name}
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
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
                    className="p-2 rounded-lg bg-nexus-void/70 border border-white/10 text-center"
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
                onClick={(e) => {
                  if (didDragRef.current) e.preventDefault();
                }}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl glass hover:border-nexus-cyan/40 transition group"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-display uppercase tracking-widest text-nexus-cyan">
                    Repositorio Oficial
                  </div>
                  <div className="text-xs text-nexus-white truncate group-hover: underline">
                    github.com/ManuDev21
                  </div>
                </div>
                {/* Stylized SVG Matrix Code linked to real GitHub URL */}
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
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-nexus-muted">
            <span className="inline-flex items-center gap-1">
              <FiMove className="text-nexus-cyan" /> Arrastra el gafete
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerDragonPulse();
              }}
              className="inline-flex items-center gap-1 text-nexus-violet hover:text-nexus-cyan transition"
            >
              <FiZap /> Pulso Dragón
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
