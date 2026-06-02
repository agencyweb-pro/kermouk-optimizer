import { useState } from "react";

interface LicenseModalProps {
  onClose: () => void;
  onSuccess: (key: string) => void;
}

export default function LicenseModal({ onClose, onSuccess }: LicenseModalProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setError("Veuillez saisir votre clé de licence.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await window.kermouk.saveLicense(trimmedKey);
    setLoading(false);
    if (result.ok) {
      onSuccess(trimmedKey);
    } else {
      setError(result.message || "Clé invalide. Vérifiez votre clé de licence.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: "440px",
          padding: "32px",
          border: "1px solid rgba(255,107,0,0.3)",
          background: "#111",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "16px", color: "#FF6B00", letterSpacing: "0.08em" }}>
              ACTIVER PREMIUM
            </div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
              Entrez votre clé de licence UUID
            </div>
          </div>
          <button onClick={onClose} className="titlebar-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontWeight: 700 }}>
            Clé de licence
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx"
            autoFocus
            style={{
              width: "100%",
              background: "#0a0a0a",
              border: `1px solid ${error ? "#ef4444" : "rgba(255,107,0,0.3)"}`,
              borderRadius: "8px",
              padding: "12px 14px",
              color: "#fff",
              fontSize: "13px",
              fontFamily: "monospace",
              outline: "none",
              letterSpacing: "0.03em",
              WebkitUserSelect: "text",
              userSelect: "text",
            }}
          />
          {error && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: "8px", padding: "12px", marginBottom: "20px", fontSize: "11px", color: "#666", lineHeight: 1.6 }}>
          La clé de licence est l&apos;UUID reçu après votre achat sur{" "}
          <span style={{ color: "#FF6B00" }}>kermouk-optimizer.com</span>.
          Elle a le format <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: "3px", color: "#ccc" }}>xxxxxxxx-xxxx-4xxx-...</code>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ flex: 2 }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Vérification...
              </span>
            ) : (
              "Activer la licence"
            )}
          </button>
        </div>

        {/* Buy link */}
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "11px", color: "#444" }}>
          Pas encore Premium ?{" "}
          <span
            onClick={() => window.kermouk.openExternal("https://kermouk-optimizer.com/payment")}
            style={{ color: "#FF6B00", cursor: "pointer", textDecoration: "underline" }}
          >
            Acheter une licence (4,99€/mois)
          </span>
        </div>
      </div>
    </div>
  );
}
