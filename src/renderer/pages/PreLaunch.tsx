import { useState, useEffect, useRef } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface ProgressEntry {
  step: string;
  message: string;
  done: boolean;
  ts: number;
}

export default function PreLaunch({ isPremium, openLicenseModal }: Props) {
  const [killDiscord, setKillDiscord] = useState(false);
  const [autoRestore, setAutoRestore] = useState(true);
  const [extraApps, setExtraApps] = useState<Record<string, boolean>>({
    chrome: false,
    firefox: false,
    edge: false,
    steam: false,
    ubisoft: false,
  });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState<ProgressEntry[]>([]);
  const [freedMb, setFreedMb] = useState<number | null>(null);
  const [ramBefore, setRamBefore] = useState<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (step: string, message: string, isDone = false) => {
    setLogs((prev) => [...prev, { step, message, done: isDone, ts: Date.now() }]);
    if (isDone) setDone(true);
  };

  const EXTRA_APPS_DEF: { id: string; label: string; process: string }[] = [
    { id: "chrome", label: "Google Chrome", process: "chrome.exe" },
    { id: "firefox", label: "Firefox", process: "firefox.exe" },
    { id: "edge", label: "Microsoft Edge", process: "msedge.exe" },
    { id: "steam", label: "Steam", process: "steam.exe" },
    { id: "ubisoft", label: "Ubisoft Connect", process: "UbisoftConnect.exe" },
  ];

  const selectedExtraApps = EXTRA_APPS_DEF.filter(a => extraApps[a.id]);

  const handleLaunch = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    if (running) return;

    // Confirmation si des apps supplémentaires sont sélectionnées
    if (selectedExtraApps.length > 0) {
      const names = selectedExtraApps.map(a => `• ${a.label}`).join("\n");
      const ok = window.confirm(
        `Les applications suivantes vont être fermées avant le lancement :\n\n${names}\n\nContinuer ?`
      );
      if (!ok) return;
    }

    setRunning(true);
    setDone(false);
    setFreedMb(null);
    setLogs([]);

    // S'abonner aux events de progression
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = window.kermouk.onPreLaunchProgress((data) => {
      addLog(data.step, data.message, data.done);
      if (data.step === "ram_freed") {
        const match = data.message.match(/\+(\d+)/);
        if (match) setFreedMb(parseInt(match[1]));
      }
      if (data.done) setRunning(false);
    });

    const result = await window.kermouk.preLaunchFortnite({
      killDiscord,
      autoRestore,
      extraApps: selectedExtraApps.map(a => a.process),
    });
    if (!result.ok) {
      addLog("error", result.error || "Erreur inconnue", true);
      setRunning(false);
    } else if (result.freedMb !== undefined) {
      setFreedMb(result.freedMb);
    }
  };

  const stepIcon = (step: string): string => {
    if (step === "error") return "X";
    if (step === "done" || step === "restored") return "OK";
    if (step === "launch") return ">>>";
    if (step === "killed") return "KILL";
    if (step === "ram_freed" || step === "ram_before") return "RAM";
    if (step === "affinity") return "CPU";
    if (step === "dns") return "DNS";
    return "...";
  };

  const stepColor = (step: string): string => {
    if (step === "error") return "#ef4444";
    if (step === "done" || step === "restored" || step === "affinity") return "#22c55e";
    if (step === "launch") return "var(--primary)";
    return "#888";
  };

  return (
    <div style={{ padding: "24px", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="section-header">
        <h2 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          PRE-LAUNCH <span className="gradient-text">FORTNITE</span>
        </h2>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Prepare le PC et lance Fortnite avec les parametres optimaux
        </p>
      </div>

      {/* RAM indicator */}
      {freedMb !== null && (
        <div style={{ padding: "12px 16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <path d="M6 7V5M10 7V5M14 7V5M18 7V5" />
          </svg>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", letterSpacing: "0.06em" }}>RAM LIBEREE</div>
            <div style={{ fontSize: "20px", fontFamily: "Orbitron, sans-serif", color: "#22c55e", fontWeight: 900 }}>+{freedMb} MB</div>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontSize: "11px", color: "#444", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
          Options de lancement
        </div>

        {/* Toggle Discord */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#ccc", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>Killer Discord</div>
            <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Ferme Discord avant de lancer Fortnite</div>
          </div>
          <button
            onClick={() => setKillDiscord((v) => !v)}
            disabled={running}
            style={{
              width: "42px", height: "22px", borderRadius: "11px",
              background: killDiscord ? "var(--primary)" : "#1a1a1a",
              border: `1px solid ${killDiscord ? "var(--primary)" : "#333"}`,
              cursor: running ? "default" : "pointer",
              position: "relative", transition: "all 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: killDiscord ? "22px" : "3px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </button>
        </div>

        {/* Toggle Auto-Restore */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#ccc", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>Auto-restore processus</div>
            <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Restaure les processus apres fermeture de Fortnite</div>
          </div>
          <button
            onClick={() => setAutoRestore((v) => !v)}
            disabled={running}
            style={{
              width: "42px", height: "22px", borderRadius: "11px",
              background: autoRestore ? "var(--primary)" : "#1a1a1a",
              border: `1px solid ${autoRestore ? "var(--primary)" : "#333"}`,
              cursor: running ? "default" : "pointer",
              position: "relative", transition: "all 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: autoRestore ? "22px" : "3px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </button>
        </div>
      </div>

      {/* Applications supplémentaires à fermer */}
      <div className="card">
        <div style={{ fontSize: "11px", color: "#444", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Fermer avant lancement <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(confirmation demandée)</span>
        </div>
        {EXTRA_APPS_DEF.map(app => (
          <div key={app.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", color: "#666", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>{app.label}</div>
            <button
              onClick={() => setExtraApps(prev => ({ ...prev, [app.id]: !prev[app.id] }))}
              disabled={running}
              style={{
                width: "36px", height: "20px", borderRadius: "10px",
                background: extraApps[app.id] ? "var(--primary)" : "#1a1a1a",
                border: `1px solid ${extraApps[app.id] ? "var(--primary)" : "#333"}`,
                cursor: running ? "default" : "pointer",
                position: "relative", transition: "all 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: "2px",
                left: extraApps[app.id] ? "17px" : "2px",
                width: "14px", height: "14px", borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </button>
          </div>
        ))}
      </div>

      {/* Ce qui sera fait */}
      <div className="card" style={{ background: "#0a0a0a" }}>
        <div style={{ fontSize: "11px", color: "#333", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
          Sequence de lancement
        </div>
        {[
          "Vide la RAM (EmptyWorkingSet)",
          "Kill OneDrive, SearchIndexer, RuntimeBroker, SearchHost, StartMenuExperienceHost",
          killDiscord ? "Kill Discord.exe" : "Discord conserve (toggle desactive)",
          "Stoppe WdNisSvc (Defender scan)",
          "Flush DNS",
          "Lance Fortnite via Epic Games Launcher",
          "Applique affinite CPU (cores 0-5) apres 35s",
          autoRestore ? "Restaure les processus apres fermeture de Fortnite" : "Restauration desactivee",
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "var(--primary)", fontFamily: "monospace", marginTop: "1px", minWidth: "16px" }}>{i + 1}.</span>
            <span style={{ fontSize: "11px", color: "#555", lineHeight: 1.5 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Bouton principal */}
      <button
        onClick={handleLaunch}
        disabled={running}
        style={{
          width: "100%", padding: "18px",
          background: running
            ? "rgba(60,60,60,0.5)"
            : "linear-gradient(135deg, var(--primary), #ff9500)",
          border: "none", borderRadius: "10px",
          color: "white", cursor: running ? "default" : "pointer",
          fontFamily: "Orbitron, sans-serif", fontSize: "16px", fontWeight: 900,
          letterSpacing: "0.1em", textTransform: "uppercase",
          transition: "all 0.2s",
          boxShadow: running ? "none" : "0 4px 20px rgba(255,107,0,0.3)",
        }}
      >
        {running ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} />
            Lancement en cours...
          </span>
        ) : (
          "LANCER FORTNITE OPTIMISE"
        )}
      </button>

      {!isPremium && (
        <div
          onClick={openLicenseModal}
          style={{ textAlign: "center", fontSize: "11px", color: "#555", cursor: "pointer", marginTop: "-8px" }}
        >
          Fonctionnalite Premium — <span style={{ color: "var(--primary)" }}>Entrer ma cle</span>
        </div>
      )}

      {/* Logs temps reel */}
      {logs.length > 0 && (
        <div style={{ background: "#060606", border: "1px solid #111", borderRadius: "8px", padding: "12px", maxHeight: "200px", overflowY: "auto" }}>
          <div style={{ fontSize: "10px", color: "#333", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            Statut en temps reel
          </div>
          {logs.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
              <span style={{
                fontSize: "9px", fontFamily: "monospace", fontWeight: 700,
                color: stepColor(log.step),
                minWidth: "40px",
              }}>
                {stepIcon(log.step)}
              </span>
              <span style={{ fontSize: "11px", color: stepColor(log.step) }}>{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}

      {done && (
        <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", fontSize: "12px", color: "#22c55e", textAlign: "center", fontWeight: 700 }}>
          Sequence terminee — Bonne partie !
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
