interface AboutProps {
  isPremium: boolean;
  licenseKey: string | null;
  onLicenseRemoved: () => void;
  openLicenseModal: () => void;
}

export default function About({ isPremium, licenseKey, onLicenseRemoved, openLicenseModal }: AboutProps) {
  const handleRemoveLicense = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre licence ? Tous les tweaks Premium seront verrouillés.");
    if (!confirmed) return;
    await window.kermouk.clearLicense();
    onLicenseRemoved();
  };

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          À <span className="gradient-text">PROPOS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Informations sur KERMOUK OPTIMIZER et votre licence
        </p>
      </div>

      {/* App info */}
      <div className="card" style={{ marginBottom: "12px", textAlign: "center", padding: "32px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            background: "rgba(255,107,0,0.15)",
            border: "1px solid rgba(255,107,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FF6B00" />
          </svg>
        </div>
        <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "0.1em", marginBottom: "4px" }}>
          KERMOUK <span style={{ color: "#FF6B00" }}>OPTIMIZER</span>
        </div>
        <div style={{ fontSize: "12px", color: "#444", marginBottom: "16px" }}>
          Version 2.0.0 — Gaming Optimizer pour Fortnite
        </div>
        <div style={{ fontSize: "11px", color: "#333", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
          KERMOUK OPTIMIZER applique des tweaks Windows testés et validés pour maximiser les FPS,
          réduire la latence réseau et optimiser l&apos;expérience Fortnite.
        </div>
      </div>

      {/* License info */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Licence & Abonnement
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            background: isPremium ? "rgba(34,197,94,0.06)" : "rgba(255,107,0,0.04)",
            border: isPremium ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,107,0,0.2)",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isPremium ? "#22c55e" : "#FF6B00" }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", color: isPremium ? "#22c55e" : "#FF6B00" }}>
              {isPremium ? "LICENCE PREMIUM ACTIVE" : "VERSION GRATUITE"}
            </span>
          </div>

          {isPremium && licenseKey && (
            <div>
              <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Clé de licence (masquée)
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#555", background: "#0a0a0a", padding: "8px", borderRadius: "6px" }}>
                {licenseKey.substring(0, 8)}••••-••••-••••-••••-{licenseKey.slice(-12)}
              </div>
            </div>
          )}

          {!isPremium && (
            <div style={{ fontSize: "11px", color: "#555" }}>
              Passez Premium pour accéder à tous les tweaks avancés.
            </div>
          )}
        </div>

        {isPremium ? (
          <button
            onClick={handleRemoveLicense}
            className="btn-secondary"
            style={{ width: "100%", fontSize: "11px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
          >
            Supprimer la licence
          </button>
        ) : (
          <button onClick={openLicenseModal} className="btn-primary" style={{ width: "100%" }}>
            Entrer ma clé de licence
          </button>
        )}
      </div>

      {/* Links */}
      <div className="card">
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Liens utiles
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Site officiel", url: "https://kermouk-optimizer.com" },
            { label: "Acheter une licence Premium", url: "https://kermouk-optimizer.com/payment" },
          ].map((link) => (
            <button
              key={link.url}
              onClick={() => window.kermouk.openExternal(link.url)}
              style={{
                background: "transparent",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#666",
                fontSize: "12px",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "#2a2a2a" }}>
        © 2024 KERMOUK OPTIMIZER — Non affilié à Epic Games ou Fortnite™
      </div>
    </div>
  );
}
