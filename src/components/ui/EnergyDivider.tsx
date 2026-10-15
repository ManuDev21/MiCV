interface EnergyDividerProps {
  label?: string;
}

export default function EnergyDivider({ label }: EnergyDividerProps) {
  return (
    <div className="relative max-w-6xl mx-auto px-6 py-2 flex items-center justify-center pointer-events-none select-none">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-nexus-violet/45 to-transparent" />
      <div className="absolute inset-x-1/4 h-px bg-gradient-to-r from-transparent via-nexus-cyan/65 to-transparent blur-[1px]" />
      {label ? (
        <span className="relative px-4 py-1 rounded-full bg-nexus-void/90 border border-nexus-cyan/25 text-[10px] font-display uppercase tracking-[0.35em] text-nexus-muted">
          {label}
        </span>
      ) : (
        <span className="relative w-2.5 h-2.5 rotate-45 bg-nexus-cyan/80 shadow-neon-cyan border border-white/60" />
      )}
    </div>
  );
}
