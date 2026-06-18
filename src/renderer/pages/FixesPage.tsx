import { useState } from "react";
import { FIXES, type Fix, type FixCategory } from "../data/fixes";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type FixStatus = "idle" | "running" | "success" | "error";

const CATEGORY_ORDER: FixCategory[] = ["Systeme", "Reseau", "Audio", "Peripheriques"];
const CATEGORY_LABELS: Record<FixCategory, string> = {
  Systeme: "Système",
  Reseau: "Réseau",
  Audio: "Audio",
  Peripheriques: "Périphériques",
};

export default function FixesPage({ isPremium: _p, openLicenseModal: _ol }: Props) {
  const [statuses, setStatuses] = useState<Record<string, FixStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setStatus(id: string, s: FixStatus) {
    setStatuses(prev => ({ ...prev, [id]: s }));
  }
  function setError(id: string, msg: string) {
    setErrors(prev => ({ ...prev, [id]: msg }));
  }

  async function runFix(fix: Fix) {
    setStatus(fix.id, "running");
    setError(fix.id, "");
    try {
      const res = await window.kermouk.applyTweaks(fix.bat, [fix.title]);
      if (res?.ok) {
        setStatus(fix.id, "success");
      } else {
        setStatus(fix.id, "error");
        setError(fix.id, res?.error ?? "Echec de l'execution");
      }
    } catch (e) {
      setStatus(fix.id, "error");
      setError(fix.id, String(e));
    }
  }

  const fixesByCategory = CATEGORY_ORDER.map(cat => ({
    cat,
    fixes: FIXES.filter(f => f.category === cat),
  })).filter(g => g.fixes.length > 0);

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          FIXES & <span className="gradient-text">CORRECTIONS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Corrections automatiques des problèmes courants Windows & Gaming
        </p>
      </div>

      {fixesByCategory.map(({ cat, fixes }) => (
        <div key={cat} style={{ marginBottom: "20px" }}>
          {/* Category header */}
          <div style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#444",
            marginBottom: "8px",
            paddingBottom: "6px",
            borderBottom: "1px solid #111",
          }}>
            {CATEGORY_LABELS[cat]}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {fixes.map(fix => <FixCard key={fix.id} fix={fix} status={statuses[fix.id] ?? "idle"} error={errors[fix.id] ?? ""} onRun={runFix} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function FixCard({ fix, status, error, onRun }: {
  fix: Fix;
  status: FixStatus;
  error: string;
  onRun: (fix: Fix) => void;
}) {
  let borderColor = "transparent";
  if (status === "success") borderColor = "rgba(30,215,96,0.2)";
  if (status === "error") borderColor = "rgba(255,50,50,0.2)";

  return (
    <div
      className="card"
      style={{ border: `1px solid ${borderColor}`, transition: "border-color 0.2s", display: "flex", flexDirection: "column", gap: "6px" }}
    >
      <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ccc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {fix.title}
      </div>
      <div style={{ fontSize: "11px", color: "#444", lineHeight: 1.5, flex: 1 }}>
        {fix.description}
      </div>
      {fix.warning && (
        <div style={{ fontSize: "10px", color: "#ff9500", background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.15)", borderRadius: "4px", padding: "4px 8px", lineHeight: 1.5 }}>
          ⚠ {fix.warning}
        </div>
      )}
      {error && (
        <div style={{ fontSize: "10px", color: "#ff5555", fontFamily: "Rajdhani, sans-serif" }}>{error}</div>
      )}
      {status === "success" ? (
        <div style={{ fontSize: "11px", color: "var(--primary)", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          ✓ Appliqué
        </div>
      ) : (
        <button
          onClick={() => onRun(fix)}
          disabled={status === "running"}
          style={{
            padding: "7px 14px",
            background: status === "running" ? "transparent" : "rgba(30,215,96,0.06)",
            border: "1px solid rgba(30,215,96,0.2)",
            borderRadius: "5px",
            color: status === "running" ? "#444" : "var(--primary)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            cursor: status === "running" ? "wait" : "pointer",
            alignSelf: "flex-start",
            transition: "all 0.15s",
          }}
        >
          {status === "running" ? "En cours..." : "Fix Now"}
        </button>
      )}
    </div>
  );
}
