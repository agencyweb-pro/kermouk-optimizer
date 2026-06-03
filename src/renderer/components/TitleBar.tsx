export default function TitleBar() {
  return (
    <div className="titlebar">
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-5 h-5 rounded bg-orange-DEFAULT flex items-center justify-center" style={{ background: "#FF6B00" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "10px", fontWeight: 900, letterSpacing: "0.12em", color: "#fff" }}>
          KERMOUK <span style={{ color: "#FF6B00" }}>OPTIMIZER</span>
        </span>
        <span style={{ fontSize: "9px", color: "#444", marginLeft: "4px" }}>v2.2.0</span>
      </div>

      {/* Window controls */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: "no-drag" } as any}>
        <button
          className="titlebar-btn"
          onClick={() => window.kermouk?.minimize()}
          title="Réduire"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          className="titlebar-btn"
          onClick={() => window.kermouk?.maximize()}
          title="Agrandir"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        </button>
        <button
          className="titlebar-btn close"
          onClick={() => window.kermouk?.close()}
          title="Fermer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
