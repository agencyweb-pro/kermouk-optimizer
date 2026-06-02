import { useState, useEffect } from "react";

interface DashboardProps {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface SystemInfo {
  cpu: string;
  ram: string;
  gpu: string;
  os: string;
}

export default function Dashboard({ isPremium, openLicenseModal }: DashboardProps) {
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.kermouk?.getSystemInfo().then((info) => {
      setSysInfo(info as SystemInfo);
      setLoading(false);
    });
  }, []);

  const specs = sysInfo
    ? [
        { label: "Processeur (CPU)", value: sysInfo.cpu, icon: "🖥️" },
        { label: "Mémoire (RAM)", value: sysInfo.ram, icon: "💾" },
        { label: "Carte graphique (GPU)", value: sysInfo.gpu, icon: "🎮" },
        { label: "Système d'exploitation", value: sysInfo.os, icon: "🪟" },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          TABLEAU DE <span className="gradient-text">BORD</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Vue d&apos;ensemble de votre système et statut d&apos;optimisation
        </p>
      </div>

      {/* Status banner */}
      <div
        className="card"
        style={{
          background: isPremium
            ? "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, #111 100%)"
            : "linear-gradient(135deg, rgba(255,107,0,0.06) 0%, #111 100%)",
          border: isPremium ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,107,0,0.2)",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: isPremium ? "rgba(34,197,94,0.1)" : "rgba(255,107,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isPremium ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "16px", color: isPremium ? "#22c55e" : "#FF6B00" }}>
                {isPremium ? "LICENCE PREMIUM ACTIVE" : "VERSION GRATUITE"}
              </div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                {isPremium
                  ? "Tous les tweaks avancés sont débloqués"
                  : "5 tweaks de base disponibles — Passez Premium pour tout débloquer"}
              </div>
            </div>
          </div>
          {!isPremium && (
            <button onClick={openLicenseModal} className="btn-primary" style={{ padding: "8px 16px", fontSize: "12px" }}>
              Activer Premium
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
        <div className="stat-chip">
          <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Tweaks disponibles</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "28px", fontWeight: 900, color: "#FF6B00" }}>
            {isPremium ? "20" : "5"}
          </div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>{isPremium ? "tous débloqués" : "sur 20 total"}</div>
        </div>
        <div className="stat-chip">
          <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>FPS gain estimé</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "28px", fontWeight: 900, color: "#FF6B00" }}>
            {isPremium ? "+40%" : "+10%"}
          </div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>après optimisation complète</div>
        </div>
        <div className="stat-chip">
          <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Réduction ping</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "28px", fontWeight: 900, color: "#FF6B00" }}>
            {isPremium ? "-30ms" : "---"}
          </div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>{isPremium ? "via tweaks réseau" : "Premium requis"}</div>
        </div>
      </div>

      {/* System info */}
      <div className="card">
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Mon PC
        </div>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444", fontSize: "12px" }}>
            <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Détection du matériel en cours...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {specs.map((spec) => (
              <div key={spec.label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                  {spec.label}
                </div>
                <div style={{ fontSize: "12px", color: "#ccc", fontWeight: 600, wordBreak: "break-word" }}>
                  {spec.value || "Inconnu"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="card" style={{ marginTop: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "12px" }}>
          Conseils rapides
        </div>
        <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            "Créez toujours un point de restauration avant d'appliquer des tweaks.",
            isPremium
              ? "Commencez par les tweaks Réseau pour réduire votre ping Fortnite."
              : "Passez Premium pour accéder aux tweaks Réseau, GPU et Fortnite.",
            "Redémarrez Windows après application pour que tous les changements prennent effet.",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#555" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B00" style={{ flexShrink: 0, marginTop: "1px" }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
