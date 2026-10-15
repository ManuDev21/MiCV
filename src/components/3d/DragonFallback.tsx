export default function DragonFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-nexus-void"
    >
      <div className="absolute inset-0 grid-bg opacity-35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 65% 35%, rgba(0, 229, 255, 0.14), rgba(139, 92, 246, 0.12) 38%, rgba(3, 4, 7, 0.96) 75%)',
        }}
      />
      {/* Stylized Cyber-Dragon Vector Silhouette Fallback when WebGL is disabled */}
      <svg
        viewBox="0 0 800 500"
        className="absolute right-[-5%] top-[12%] w-[85vw] max-w-[760px] opacity-30 animate-float"
        fill="none"
      >
        <defs>
          <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {/* Left & Right Wings */}
        <path
          d="M410 220 L210 95 L260 190 L165 175 L255 245 L195 265 L375 260 Z"
          stroke="url(#dragonGrad)"
          strokeWidth="2"
          fill="rgba(0, 229, 255, 0.05)"
        />
        <path
          d="M450 215 L690 75 L615 185 L725 160 L615 240 L675 265 L475 255 Z"
          stroke="url(#dragonGrad)"
          strokeWidth="2"
          fill="rgba(139, 92, 246, 0.05)"
        />
        {/* Serpentine Spine & Tail */}
        <path
          d="M425 145 Q435 215 415 270 T360 375 T460 445 T560 420"
          stroke="url(#dragonGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Dragon Head & Horns */}
        <path
          d="M395 110 L425 145 L455 110 M410 140 L425 170 L440 140 Z"
          stroke="#00E5FF"
          strokeWidth="3"
        />
        <circle cx="418" cy="148" r="3.5" fill="#00E5FF" />
        <circle cx="432" cy="148" r="3.5" fill="#00E5FF" />
      </svg>
    </div>
  );
}
