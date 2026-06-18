interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

const FIXES_PREVIEW = [
  { icon: "🔧", title: "Réparation Windows Update", desc: "Corrige les erreurs de mise à jour bloquées" },
  { icon: "🔇", title: "Fix Audio Latence", desc: "Répare les problèmes d'audio crackling en jeu" },
  { icon: "🖥️", title: "Fix BSOD Communs", desc: "Corrige les BSOD IRQL_NOT_LESS_OR_EQUAL" },
  { icon: "🌐", title: "Reset Pile Réseau", desc: "Réinitialise TCP/IP et Winsock" },
];

export default function FixesPage({ isPremium: _isPremium, openLicenseModal: _openLicenseModal }: Props) {
  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          FIXES & <span className="gradient-text">CORRECTIONS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Corrections automatiques des problèmes courants Windows — Phase 3
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {FIXES_PREVIEW.map(fix => (
          <div key={fix.title} className="card" style={{ opacity: 0.4, pointerEvents: "none" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{fix.icon}</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ccc", marginBottom: "4px" }}>{fix.title}</div>
            <div style={{ fontSize: "11px", color: "#444" }}>{fix.desc}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "12px", textAlign: "center", padding: "20px" }}>
        <div style={{ fontSize: "11px", color: "#333" }}>Fonctionnalité disponible en Phase 3 — restez à l'écoute</div>
      </div>
    </div>
  );
}
