interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function BackupsPage({ isPremium: _isPremium, openLicenseModal: _openLicenseModal }: Props) {
  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          SAUVEGARDES <span className="gradient-text">SYSTÈME</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Points de restauration et sauvegardes de configuration — Phase 2
        </p>
      </div>

      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "0 0 10px", borderBottom: "1px solid #111", marginBottom: "12px" }}>
          {["Nom", "Date", "Type", "Actions"].map(col => (
            <span key={col} style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#444" }}>
              {col}
            </span>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div style={{ fontSize: "12px", color: "#333" }}>Aucune sauvegarde disponible</div>
          <div style={{ fontSize: "10px", color: "#222", marginTop: "4px" }}>Fonctionnalité disponible en Phase 2</div>
        </div>
      </div>
    </div>
  );
}
