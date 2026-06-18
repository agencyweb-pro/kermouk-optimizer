import { useState, useEffect } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  type: "restore-point" | "export-config";
}

const LS_KEY = "kermouk_backups";
const LS_COUNT = "kermouk_backups_count";

function loadBackups(): Backup[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

type BtnStatus = "idle" | "creating" | "exporting";

export default function BackupsPage({ isPremium: _p, openLicenseModal: _ol }: Props) {
  const [backups, setBackups] = useState<Backup[]>(loadBackups);
  const [btnStatus, setBtnStatus] = useState<BtnStatus>("idle");
  const [alertOk, setAlertOk] = useState<boolean | null>(null);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(backups));
    localStorage.setItem(LS_COUNT, String(backups.length));
  }, [backups]);

  function pushEntry(entry: Backup) {
    setBackups(prev => [entry, ...prev]);
  }

  async function handleCreateRestorePoint() {
    setBtnStatus("creating");
    setAlertOk(null);
    setAlertMsg("");
    const res = await window.kermouk.createRestorePoint();
    setBtnStatus("idle");
    if (res?.ok) {
      pushEntry({
        id: Date.now().toString(),
        name: "KERMOUK Backup",
        date: new Date().toLocaleString("fr-FR"),
        type: "restore-point",
      });
      setAlertOk(true);
      setAlertMsg("Point de restauration cree avec succes.");
    } else {
      setAlertOk(false);
      setAlertMsg("Echec : " + (res?.error ?? "droits insuffisants ou fonctionnalite desactivee"));
    }
  }

  async function handleExportConfig() {
    setBtnStatus("exporting");
    setAlertOk(null);
    setAlertMsg("");
    const res = await window.kermouk.exportPcOptimizations();
    setBtnStatus("idle");
    if (res?.ok) {
      pushEntry({
        id: Date.now().toString(),
        name: "Export Config",
        date: new Date().toLocaleString("fr-FR"),
        type: "export-config",
      });
      setAlertOk(true);
      setAlertMsg("Export sauvegarde sur le Bureau : " + res.folder);
    } else {
      setAlertOk(false);
      setAlertMsg("Echec export : " + (res?.error ?? "erreur inconnue"));
    }
  }

  function handleDelete(id: string) {
    setBackups(prev => prev.filter(b => b.id !== id));
  }

  const busy = btnStatus !== "idle";

  const primaryBtnStyle: React.CSSProperties = {
    padding: "9px 18px",
    background: "var(--primary)",
    border: "none",
    borderRadius: "6px",
    color: "#000",
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: busy ? "wait" : "pointer",
    opacity: busy ? 0.6 : 1,
    transition: "opacity 0.15s",
  };

  const secondaryBtnStyle: React.CSSProperties = {
    padding: "9px 18px",
    background: "transparent",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "#888",
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: busy ? "wait" : "pointer",
    opacity: busy ? 0.6 : 1,
    transition: "opacity 0.15s",
  };

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          SAUVEGARDES <span className="gradient-text">SYSTÈME</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Points de restauration et exports de configuration PC
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <button onClick={handleCreateRestorePoint} disabled={busy} style={primaryBtnStyle}>
          {btnStatus === "creating" ? "Création..." : "Point de restauration"}
        </button>
        <button onClick={handleExportConfig} disabled={busy} style={secondaryBtnStyle}>
          {btnStatus === "exporting" ? "Export..." : "Exporter Config"}
        </button>
      </div>

      {/* Alert */}
      {alertOk !== null && alertMsg && (
        <div style={{
          padding: "8px 12px",
          borderRadius: "6px",
          marginBottom: "12px",
          fontSize: "11px",
          fontFamily: "Rajdhani, sans-serif",
          background: alertOk ? "rgba(30,215,96,0.08)" : "rgba(255,50,50,0.08)",
          color: alertOk ? "var(--primary)" : "#ff5555",
          border: `1px solid ${alertOk ? "rgba(30,215,96,0.15)" : "rgba(255,50,50,0.15)"}`,
        }}>
          {alertMsg}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 60px", padding: "0 0 10px", borderBottom: "1px solid #111", marginBottom: "12px", gap: "8px" }}>
          {["Nom", "Date", "Type", ""].map((col, i) => (
            <span key={i} style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#444" }}>
              {col}
            </span>
          ))}
        </div>

        {backups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div style={{ fontSize: "12px", color: "#333" }}>Aucune sauvegarde</div>
            <div style={{ fontSize: "10px", color: "#222", marginTop: "4px" }}>
              Crée un point de restauration avant d'appliquer des tweaks
            </div>
          </div>
        ) : (
          backups.map(b => (
            <div
              key={b.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 60px",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #0d0d0d",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#ccc", fontFamily: "Rajdhani, sans-serif" }}>{b.name}</span>
              <span style={{ fontSize: "11px", color: "#555" }}>{b.date}</span>
              <span style={{
                fontSize: "10px",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: b.type === "restore-point" ? "var(--primary)" : "#666",
              }}>
                {b.type === "restore-point" ? "Restore" : "Export"}
              </span>
              <button
                onClick={() => handleDelete(b.id)}
                style={{
                  background: "none",
                  border: "1px solid #2a2a2a",
                  borderRadius: "4px",
                  color: "#444",
                  cursor: "pointer",
                  padding: "3px 8px",
                  fontSize: "10px",
                  fontFamily: "Rajdhani, sans-serif",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                Suppr
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
