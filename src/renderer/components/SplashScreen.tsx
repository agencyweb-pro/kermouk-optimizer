interface SplashScreenProps {
  fading: boolean;
}

export default function SplashScreen({ fading }: SplashScreenProps) {
  return (
    <div className={`splash-screen${fading ? " fading" : ""}`}>
      <div className="splash-logo">
        <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--primary)" />
        </svg>
      </div>

      <div className="splash-title" style={{ textAlign: "center", marginTop: "24px" }}>
        <div style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "26px",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "0.2em",
        }}>
          KERMOUK
        </div>
        <div style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "11px",
          color: "var(--primary)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginTop: "4px",
          fontWeight: 700,
        }}>
          OPTIMIZER v{__APP_VERSION__}
        </div>
      </div>

      <div style={{ marginTop: "48px", display: "flex", gap: "8px", alignItems: "center" }}>
        <div className="splash-dot splash-dot-0" />
        <div className="splash-dot splash-dot-1" />
        <div className="splash-dot splash-dot-2" />
      </div>

      <div style={{
        marginTop: "20px",
        fontSize: "10px",
        color: "#333",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: "Rajdhani, sans-serif",
      }}>
        Chargement en cours...
      </div>
    </div>
  );
}
