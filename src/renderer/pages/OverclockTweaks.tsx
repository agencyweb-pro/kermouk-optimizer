import { useState, useEffect, useRef } from "react";

interface MonitorData {
  cpuUsage: number;
  cpuTemp: number;
  cpuFreq: number;
  gpuTemp: number;
  gpuUsage: number;
  ramUsage: number;
  gpuName: string;
  gpuIsNvidia: boolean;
  cpuName: string;
  cpuIsIntel: boolean;
}

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  warn: number;
  danger: number;
  decimals?: number;
}

function Gauge({ label, value, unit, warn, danger, max, decimals = 0 }: GaugeProps) {
  const isNA = value < 0;
  const pct = isNA ? 0 : Math.min(100, Math.round((value / max) * 100));
  const color = isNA ? "#333" : value >= danger ? "#ef4444" : value >= warn ? "#f59e0b" : "#22c55e";
  const displayVal = isNA ? "N/A" : decimals > 0 ? value.toFixed(decimals) : String(value);

  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <span style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "16px", fontWeight: 900, color }}>
          {displayVal}{!isNA ? unit : ""}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

export default function OverclockTweaks({ isPremium, openLicenseModal }: Props) {
  const [monitor, setMonitor] = useState<MonitorData | null>(null);
  const [cpuApplied, setCpuApplied] = useState(false);
  const [cpuLoading, setCpuLoading] = useState(false);
  const [gpuProfile, setGpuProfile] = useState<"safe" | "balanced" | "aggressive" | null>(null);
  const [gpuLoading, setGpuLoading] = useState(false);
  const [gpuResetLoading, setGpuResetLoading] = useState(false);
  const [gpuOverTemp, setGpuOverTemp] = useState(false);
  const [logs, setLogs] = useState<{ text: string; type: "ok" | "error" | "info" | "warn" }[]>([]);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!isPremium) return;
    stoppedRef.current = false;

    const poll = async () => {
      if (stoppedRef.current) return;
      try {
        const data = await window.kermouk?.getHardwareMonitor();
        if (!stoppedRef.current && data) {
          const m = data as MonitorData;
          setMonitor(m);
          setGpuOverTemp(m.gpuTemp > 0 && m.gpuTemp >= 85);
        }
      } catch {}
      if (!stoppedRef.current) setTimeout(poll, 2000);
    };

    poll();
    return () => { stoppedRef.current = true; };
  }, [isPremium]);

  const addLog = (text: string, type: "ok" | "error" | "info" | "warn" = "info") => {
    setLogs((l) => [{ text: `[${new Date().toLocaleTimeString()}] ${text}`, type }, ...l.slice(0, 29)]);
  };

  const applyCpuTweaks = async () => {
    setCpuLoading(true);
    addLog("Application des tweaks CPU en cours (UAC requis)...", "info");
    const result = await window.kermouk?.applyCpuTweaks();
    if (result?.ok) {
      setCpuApplied(true);
      addLog("✓ Tweaks CPU appliqués — redémarrez pour l'effet complet", "ok");
    } else {
      addLog(`✗ Erreur : ${result?.error || "inconnue"} — vérifiez l'UAC`, "error");
    }
    setCpuLoading(false);
  };

  const applyGpuOC = async (profile: "safe" | "balanced" | "aggressive") => {
    if (gpuLoading) return;
    setGpuLoading(true);
    setGpuProfile(profile);
    const pctLabels = { safe: "+5%", balanced: "+10%", aggressive: "+20%" };
    addLog(`Application profil GPU ${profile} (power limit ${pctLabels[profile]})...`, "info");
    const result = await window.kermouk?.applyGpuOverclock(profile);
    if (result?.ok) {
      addLog(`✓ Profil ${profile} appliqué via nvidia-smi`, "ok");
    } else {
      setGpuProfile(null);
      addLog(`✗ ${result?.error || "nvidia-smi introuvable ou erreur GPU"}`, "error");
    }
    setGpuLoading(false);
  };

  const resetGpuOC = async () => {
    setGpuResetLoading(true);
    addLog("Reset GPU aux valeurs d'usine...", "info");
    const result = await window.kermouk?.resetGpuOverclock();
    if (result?.ok) {
      setGpuProfile(null);
      addLog("✓ GPU reseté aux valeurs d'usine", "ok");
    } else {
      addLog(`✗ ${result?.error || "Erreur reset GPU"}`, "error");
    }
    setGpuResetLoading(false);
  };

  if (!isPremium) {
    return (
      <div>
        <div className="section-header">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
            <span className="gradient-text">OVERCLOCKING</span>
          </h1>
          <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            Monitoring temps réel et optimisation CPU/GPU
          </p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" style={{ margin: "0 auto 16px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "16px", fontWeight: 900, color: "#555", marginBottom: "8px" }}>
            FONCTIONNALITÉ PREMIUM
          </div>
          <p style={{ fontSize: "12px", color: "#444", marginBottom: "20px", lineHeight: 1.6 }}>
            Le monitoring temps réel et l'overclocking sont réservés aux membres Premium.
          </p>
          <button onClick={openLicenseModal} className="btn-primary">
            Activer Premium
          </button>
        </div>
      </div>
    );
  }

  const isNvidia = monitor?.gpuIsNvidia ?? false;
  const isIntel = monitor?.cpuIsIntel ?? true;
  const cpuFreqGhz = monitor ? (monitor.cpuFreq / 1000) : 0;

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          <span className="gradient-text">OVERCLOCKING</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Monitoring temps réel · Optimisation CPU · Overclocking GPU
        </p>
      </div>

      {/* Avertissement */}
      <div className="card" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ fontSize: "11px", color: "#ef4444", lineHeight: 1.6 }}>
            <strong>AVERTISSEMENT :</strong> L'overclocking peut endommager le matériel si mal configuré.
            Créez un point de restauration avant d'appliquer. Surveillez les températures et procédez progressivement.
          </div>
        </div>
      </div>

      {/* Alerte surchauffe GPU */}
      {gpuOverTemp && (
        <div className="card" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.5)", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>
              ALERTE — GPU &gt; 85°C ! Réduisez l'OC ou resetez aux valeurs d'usine immédiatement.
            </span>
          </div>
        </div>
      )}

      {/* Monitoring temps réel */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666" }}>
            Monitoring Temps Réel
          </div>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: monitor ? "#22c55e" : "#555" }} />
          <span style={{ fontSize: "9px", color: "#333" }}>LIVE · 2s</span>
        </div>

        {!monitor ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444", fontSize: "12px" }}>
            <svg className="spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Chargement des données système...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            <Gauge label="CPU Usage" value={monitor.cpuUsage} max={100} unit="%" warn={70} danger={90} />
            <Gauge label="CPU Temp" value={monitor.cpuTemp} max={105} unit="°C" warn={75} danger={90} />
            <Gauge label="CPU Fréq." value={cpuFreqGhz} max={6} unit=" GHz" warn={4.5} danger={5.5} decimals={1} />
            <Gauge label="GPU Usage" value={monitor.gpuUsage} max={100} unit="%" warn={90} danger={99} />
            <Gauge label="GPU Temp" value={monitor.gpuTemp} max={100} unit="°C" warn={75} danger={85} />
            <Gauge label="RAM Usage" value={monitor.ramUsage} max={100} unit="%" warn={80} danger={95} />
          </div>
        )}
      </div>

      {/* Section CPU */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#FF6B00" }}>
            Optimisation CPU
          </div>
          {monitor && (
            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "3px", background: "rgba(255,107,0,0.1)", color: "#FF6B00", border: "1px solid rgba(255,107,0,0.2)" }}>
              {isIntel ? "Intel" : "AMD"}
            </span>
          )}
        </div>
        <div style={{ fontSize: "11px", color: "#444", marginBottom: "12px" }}>
          {monitor?.cpuName || "Détection CPU..."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          {[
            { label: "Plan Ultimate Performance", desc: "Active le profil caché Windows — latence minimale, aucun throttling" },
            { label: "Désactivation Core Parking", desc: "Tous les cœurs restent actifs en permanence — fin des stutters" },
            { label: isIntel ? "SpeedStep désactivé (registry)" : "Cool'n'Quiet désactivé (registry)", desc: "Fréquence CPU maintenue au maximum constant" },
            { label: "CPU Priority Foreground Boost", desc: "Win32PrioritySeparation = 38 — boost le processus actif (jeu)" },
            { label: "HPET désactivé (bcdedit)", desc: "Latence timer réduite sur CPUs modernes" },
            { label: "SystemResponsiveness = 0", desc: "100% des ressources CPU allouées aux applications foreground" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "8px 10px", background: "#0d0d0d", borderRadius: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" style={{ marginTop: "2px", flexShrink: 0 }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <div>
                <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: "10px", color: "#444", marginTop: "1px" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", fontSize: "12px" }}
          onClick={applyCpuTweaks}
          disabled={cpuLoading || cpuApplied}
        >
          {cpuLoading
            ? "Application en cours (acceptez l'UAC)..."
            : cpuApplied
            ? "✓ Profil Performance Maximum Appliqué"
            : "Appliquer Profil Performance Maximum CPU"}
        </button>
      </div>

      {/* Section GPU */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#a78bfa" }}>
            Overclocking GPU
          </div>
          {monitor && (
            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "3px", background: isNvidia ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: isNvidia ? "#22c55e" : "#ef4444", border: `1px solid ${isNvidia ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
              {isNvidia ? "NVIDIA" : "AMD"}
            </span>
          )}
        </div>
        <div style={{ fontSize: "11px", color: "#444", marginBottom: "12px" }}>
          {monitor?.gpuName || "Détection GPU..."}
        </div>

        {!isNvidia && monitor ? (
          <div style={{ padding: "12px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", fontSize: "11px", color: "#888", lineHeight: 1.6 }}>
            <strong style={{ color: "#f59e0b" }}>GPU AMD détecté.</strong> L'OC automatique via CLI nécessite NVIDIA.
            Pour AMD, utilisez <strong>AMD Software → Performance → Tuning</strong> pour activer Radeon Boost et les profils d'OC.
          </div>
        ) : (
          <>
            <div style={{ fontSize: "10px", color: "#555", marginBottom: "8px" }}>
              Boost via power limit nvidia-smi — sélectionnez un profil :
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
              {(["safe", "balanced", "aggressive"] as const).map((profile) => {
                const config = {
                  safe: { label: "Safe", pct: "+5%", clocks: "Power limit +5%", color: "#22c55e" },
                  balanced: { label: "Balanced", pct: "+10%", clocks: "Power limit +10%", color: "#f59e0b" },
                  aggressive: { label: "Aggressive", pct: "+20%", clocks: "Power limit +20%", color: "#ef4444" },
                };
                const cfg = config[profile];
                const isActive = gpuProfile === profile;
                return (
                  <div
                    key={profile}
                    onClick={() => !gpuLoading && applyGpuOC(profile)}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "8px",
                      border: `1px solid ${isActive ? cfg.color : "#1a1a1a"}`,
                      background: isActive ? `${cfg.color}11` : "#0d0d0d",
                      cursor: gpuLoading ? "wait" : "pointer",
                      transition: "all 0.2s",
                      textAlign: "center",
                      opacity: gpuLoading && !isActive ? 0.5 : 1,
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: isActive ? cfg.color : "#ccc", marginBottom: "3px" }}>
                      {cfg.label}
                    </div>
                    <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "14px", fontWeight: 900, color: isActive ? cfg.color : "#555" }}>
                      {cfg.pct}
                    </div>
                    <div style={{ fontSize: "10px", color: "#444", marginTop: "3px" }}>{cfg.clocks}</div>
                  </div>
                );
              })}
            </div>
            <button
              className="btn-secondary"
              style={{ width: "100%", fontSize: "12px" }}
              onClick={resetGpuOC}
              disabled={gpuResetLoading || gpuLoading}
            >
              {gpuResetLoading ? "Reset en cours..." : "Reset aux valeurs d'usine"}
            </button>
          </>
        )}
      </div>

      {/* Journal */}
      {logs.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#333" }}>
              Journal
            </div>
            <button
              onClick={() => setLogs([])}
              style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "11px" }}
            >
              Effacer
            </button>
          </div>
          <div className="log-container">
            {logs.map((log, i) => (
              <div
                key={i}
                className={log.type === "ok" ? "log-line-ok" : log.type === "error" ? "log-line-error" : log.type === "warn" ? "log-line-warn" : "log-line-info"}
                style={{ marginBottom: "2px" }}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
