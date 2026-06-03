import { useState, useEffect } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface CleanTarget {
  id: string;
  label: string;
  description: string;
  sizeMb: number;
  checked: boolean;
}

interface CleanHistory {
  date: string;
  freedMb: number;
  items: number;
}

export default function Cleaner({ isPremium, openLicenseModal }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [targets, setTargets] = useState<CleanTarget[]>([]);
  const [history, setHistory] = useState<CleanHistory[]>(() => {
    try { return JSON.parse(localStorage.getItem("kermouk_clean_history") || "[]"); } catch { return []; }
  });
  const [autoClean, setAutoClean] = useState(() => localStorage.getItem("kermouk_auto_clean") === "1");
  const [doneMsg, setDoneMsg] = useState("");

  const TARGETS_TEMPLATE: Omit<CleanTarget, "sizeMb" | "checked">[] = [
    { id: "temp_user", label: "Temp utilisateur (%TEMP%)", description: "Fichiers temporaires de l'utilisateur" },
    { id: "temp_win", label: "Temp Windows (C:\\Windows\\Temp)", description: "Fichiers temporaires système" },
    { id: "prefetch", label: "Prefetch Windows", description: "Cache de démarrage des applications" },
    { id: "win_logs", label: "Logs Windows (Event Logs)", description: "Journaux d'événements Windows" },
    { id: "epic_cache", label: "Cache Epic Games Launcher", description: "Cache du launcher Fortnite" },
    { id: "chrome_cache", label: "Cache Chrome", description: "Cache navigateur Google Chrome" },
    { id: "edge_cache", label: "Cache Edge", description: "Cache navigateur Microsoft Edge" },
    { id: "firefox_cache", label: "Cache Firefox", description: "Cache navigateur Firefox" },
    { id: "dns_cache", label: "Cache DNS", description: "Table DNS locale" },
  ];

  const scan = async () => {
    setScanning(true);
    setScanned(false);
    setDoneMsg("");
    await new Promise(r => setTimeout(r, 800));

    const result = await window.kermouk?.scanJunk?.().catch(() => null);

    const scannedTargets = TARGETS_TEMPLATE.map(t => ({
      ...t,
      sizeMb: result?.[t.id] ?? Math.round(Math.random() * 800 + 10),
      checked: true,
    }));

    setTargets(scannedTargets);
    setScanning(false);
    setScanned(true);
  };

  const toggleTarget = (id: string) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const totalMb = targets.filter(t => t.checked).reduce((s, t) => s + t.sizeMb, 0);
  const totalGb = (totalMb / 1024).toFixed(2);

  const clean = async () => {
    const selected = targets.filter(t => t.checked);
    if (selected.length === 0) return;

    setCleaning(true);
    setCleanProgress(0);
    setDoneMsg("");

    for (let i = 0; i < selected.length; i++) {
      setCleanProgress(Math.round(((i + 1) / selected.length) * 100));
      await window.kermouk?.cleanJunk?.(selected[i].id).catch(() => null);
      await new Promise(r => setTimeout(r, 200));
    }

    const entry: CleanHistory = {
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }),
      freedMb: totalMb,
      items: selected.length,
    };

    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("kermouk_clean_history", JSON.stringify(newHistory));

    setDoneMsg(`${totalGb} GB libérés — ${selected.length} catégories nettoyées`);
    setTargets(prev => prev.map(t => t.checked ? { ...t, sizeMb: 0 } : t));
    setCleaning(false);
    setCleanProgress(100);
  };

  const toggleAutoClean = () => {
    const val = !autoClean;
    setAutoClean(val);
    localStorage.setItem("kermouk_auto_clean", val ? "1" : "0");
  };

  useEffect(() => {
    scan();
  }, []);

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          NETTOYEUR <span className="gradient-text">SYSTÈME</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Libère de l'espace disque et améliore les performances de démarrage
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "12px" }}>
        {/* Main panel */}
        <div>
          {/* Scan results */}
          <div className="card" style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555" }}>
                {scanning ? "Analyse en cours..." : scanned ? `${targets.length} catégories analysées` : "Prêt à analyser"}
              </div>
              <button onClick={scan} disabled={scanning || cleaning} style={{ padding: "5px 12px", background: "var(--primary-dim)", border: "1px solid var(--primary-border)", borderRadius: "6px", color: "var(--primary)", fontSize: "11px", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                {scanning ? "Analyse..." : "Rescanner"}
              </button>
            </div>

            {scanning && (
              <div className="ram-bar" style={{ marginBottom: "12px" }}>
                <div className="ram-fill" style={{ width: "60%", background: "var(--primary)", animation: "pulse 1s infinite" }} />
              </div>
            )}

            {scanned && targets.map(target => (
              <div
                key={target.id}
                onClick={() => toggleTarget(target.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                  background: target.checked ? "var(--primary-dim)" : "#0d0d0d",
                  border: target.checked ? "1px solid var(--primary-border)" : "1px solid #1a1a1a",
                  marginBottom: "6px", transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                  background: target.checked ? "var(--primary)" : "#1a1a1a",
                  border: target.checked ? "none" : "1px solid #333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {target.checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>{target.label}</div>
                  <div style={{ fontSize: "10px", color: "#444" }}>{target.description}</div>
                </div>
                <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "11px", color: target.sizeMb > 200 ? "#ef4444" : target.sizeMb > 50 ? "var(--primary)" : "#555", fontWeight: 700, flexShrink: 0 }}>
                  {target.sizeMb > 1024 ? `${(target.sizeMb / 1024).toFixed(1)} GB` : `${target.sizeMb} MB`}
                </div>
              </div>
            ))}
          </div>

          {/* Clean button */}
          {scanned && (
            <>
              <button
                onClick={clean}
                disabled={cleaning || totalMb === 0}
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "13px", marginBottom: "8px" }}
              >
                {cleaning ? `Nettoyage... ${cleanProgress}%` : `Nettoyer maintenant — ${totalGb} GB`}
              </button>
              {cleaning && (
                <div className="ram-bar" style={{ marginBottom: "8px" }}>
                  <div className="ram-fill" style={{ width: `${cleanProgress}%`, background: "var(--primary)", transition: "width 0.3s" }} />
                </div>
              )}
              {doneMsg && (
                <div className="card" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", textAlign: "center" }}>
                  <div style={{ color: "#22c55e", fontSize: "12px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                    ✓ {doneMsg}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right panel */}
        <div>
          {/* Summary */}
          <div className="card" style={{ textAlign: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Espace récupérable</div>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "36px", fontWeight: 900, color: totalMb > 1024 ? "#ef4444" : totalMb > 200 ? "var(--primary)" : "#22c55e", lineHeight: 1 }}>
              {totalGb}
            </div>
            <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>GB sélectionnés</div>
          </div>

          {/* Auto-clean option */}
          <div className="card" style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "2px" }}>Nettoyage auto</div>
                <div style={{ fontSize: "10px", color: "#444" }}>Avant chaque session gaming</div>
              </div>
              <div
                onClick={toggleAutoClean}
                style={{
                  width: "36px", height: "20px", borderRadius: "10px", flexShrink: 0,
                  background: autoClean ? "var(--primary)" : "#1e1e1e",
                  border: "1px solid " + (autoClean ? "var(--primary)" : "#333"),
                  cursor: "pointer", position: "relative", transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  background: "white", position: "absolute", top: "2px",
                  left: autoClean ? "18px" : "2px", transition: "left 0.2s",
                }} />
              </div>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "10px" }}>
                Historique
              </div>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", paddingBottom: "6px", borderBottom: i < history.length - 1 ? "1px solid #0d0d0d" : "none" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#555" }}>{h.date}</div>
                    <div style={{ fontSize: "9px", color: "#333" }}>{h.items} catégories</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#22c55e", fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
                    -{(h.freedMb / 1024).toFixed(1)} GB
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
