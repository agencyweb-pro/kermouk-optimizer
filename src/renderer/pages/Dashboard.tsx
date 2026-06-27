import { useState, useEffect, useRef } from "react";
import { FREE_TWEAKS, PREMIUM_TWEAKS, generateBatScript } from "../utils/tweakEngine";
import { getActiveTweaksCount } from "../utils/tweakStore";

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

interface HardwareMonitor {
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: number;
  ramTotalGb: number;
  ramUsedGb: number;
  gpuTemp: number;
  gpuUsage: number;
}

const FORTNITE_EU_SERVER = "13.248.195.0";
const ALL_FREE = FREE_TWEAKS;
const ALL_TWEAKS = [...FREE_TWEAKS, ...PREMIUM_TWEAKS];

type UpdateStatus = "idle" | "checking" | "up-to-date" | "available" | "downloading" | "downloaded" | "error" | "no-server";

export default function Dashboard({ isPremium, openLicenseModal }: DashboardProps) {
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hw, setHw] = useState<HardwareMonitor | null>(null);
  const [ping, setPing] = useState<number>(-1);
  const [pingLoading, setPingLoading] = useState(true);
  const [modeApplying, setModeApplying] = useState<"gaming" | "tournoi" | "streaming" | "pack" | null>(null);
  const [modeDone, setModeDone] = useState<string>("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [reportFolder, setReportFolder] = useState("");
  const [tweaksCount, setTweaksCount] = useState(() => getActiveTweaksCount());

  // Quickstart checklist states (basés sur localStorage)
  const backupsCount = (() => {
    try { return parseInt(localStorage.getItem("kermouk_backups_count") || "0"); } catch { return 0; }
  })();
  const cleanHistory = (() => {
    try { return JSON.parse(localStorage.getItem("kermouk_clean_history") || "[]"); } catch { return []; }
  })();
  const fortniteOptimized = (() => {
    try { return localStorage.getItem("kermouk_fortnite_applied") === "1"; } catch { return false; }
  })();
  const quickstepItems = [
    { label: "Créer un backup système", done: backupsCount > 0 },
    { label: "Activer les tweaks Windows", done: tweaksCount > 0 },
    { label: "Nettoyer les fichiers temporaires", done: cleanHistory.length > 0 },
    { label: "Optimiser les settings Fortnite", done: fortniteOptimized },
  ];
  const quickstepDone = quickstepItems.filter(i => i.done).length;

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const [updateVersion, setUpdateVersion] = useState<string>("");
  const [updatePercent, setUpdatePercent] = useState<number>(0);
  const [updateError, setUpdateError] = useState<string>("");
  const currentVersion = __APP_VERSION__;

  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    window.kermouk?.getSystemInfo().then((info) => {
      setSysInfo(info as SystemInfo);
      setLoading(false);
    });

    // Écoute hw-alert du main process au lieu de spawner un interval dupliqué
    const removeHwListener = window.kermouk?.onHwAlert?.((data) => {
      setHw(data as HardwareMonitor);
    });

    const fetchPing = () => {
      setPingLoading(true);
      window.kermouk?.pingServer(FORTNITE_EU_SERVER).then((res) => {
        setPing(res.ms);
        setPingLoading(false);
      });
    };
    fetchPing();
    pingIntervalRef.current = setInterval(fetchPing, 8000);

    const removeUpdateListener = window.kermouk?.onUpdateStatus?.((payload) => {
      const type = payload.type as UpdateStatus;
      setUpdateStatus(type);
      if (payload.version) setUpdateVersion(payload.version as string);
      if (payload.percent !== undefined) setUpdatePercent(payload.percent as number);
      if (payload.message) setUpdateError(payload.message as string);
    });

    // Vérification auto 12s après le montage
    const updateTimer = setTimeout(() => {
      window.kermouk?.checkForUpdates?.().catch(() => {});
    }, 12000);

    return () => {
      removeHwListener?.();
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      clearTimeout(updateTimer);
      removeUpdateListener?.();
    };
  }, []);

  const specs = sysInfo
    ? [
        { label: "Processeur (CPU)", value: sysInfo.cpu },
        { label: "Mémoire (RAM)", value: sysInfo.ram },
        { label: "Carte graphique (GPU)", value: sysInfo.gpu },
        { label: "Système d'exploitation", value: sysInfo.os },
      ]
    : [];

  const pingClass =
    ping < 0 ? "ping-bad" :
    ping < 40 ? "ping-good" :
    ping < 80 ? "ping-ok" :
    "ping-bad";

  const pingLabel = ping < 0 ? "N/A" : `${ping} ms`;

  const cpuTempColor =
    !hw || hw.cpuTemp < 0 ? "#555" :
    hw.cpuTemp < 60 ? "#22c55e" :
    hw.cpuTemp < 80 ? "var(--primary)" :
    "#ef4444";

  const handleModeGaming = async () => {
    if (modeApplying) return;
    setModeApplying("gaming");
    setModeDone("");
    const rpResult = await window.kermouk.createRestorePoint();
    const bat = generateBatScript(ALL_FREE);
    const result = await window.kermouk.applyTweaks(bat, ALL_FREE.map((t) => t.name));
    if (result.ok) {
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + ALL_FREE.length));
      setTweaksCount(getActiveTweaksCount());
      setModeDone(`✓ Mode Gaming actif — ${ALL_FREE.length} tweaks appliqués !`);
    } else {
      setModeDone("✗ Erreur — vérifiez la fenêtre UAC.");
    }
    setModeApplying(null);
    void rpResult;
  };

  const handleModeTournoi = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    if (modeApplying) return;
    setModeApplying("tournoi");
    setModeDone("");
    await window.kermouk.createRestorePoint();
    const tweaksToApply = ALL_TWEAKS.filter((t) => t.id !== "nvidia-auto-boost");
    const bat = generateBatScript(tweaksToApply);
    const result = await window.kermouk.applyTweaks(bat, tweaksToApply.map((t) => t.name));
    if (result.ok) {
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + tweaksToApply.length));
      setTweaksCount(getActiveTweaksCount());
      await window.kermouk.applyFortniteIni();
      setModeDone(`Mode Tournoi actif — ${tweaksToApply.length} tweaks + INI Fortnite !`);
    } else {
      setModeDone("✗ Erreur — vérifiez la fenêtre UAC.");
    }
    setModeApplying(null);
  };

  const DOWNLOAD_URL = "https://github.com/tranoliviermatteopro-bot/kermouk-optimizer/releases/latest";

  const handleCheckUpdate = async () => {
    if (updateStatus === "no-server") {
      window.kermouk?.openExternal?.(DOWNLOAD_URL);
      return;
    }
    setUpdateStatus("checking");
    setUpdateError("");
    await window.kermouk?.checkForUpdates?.();
  };

  const handleInstallUpdate = () => {
    window.kermouk?.installUpdate?.();
  };

  const handlePackComplet = async () => {
    if (modeApplying) return;
    setModeApplying("pack");
    setModeDone("");
    await window.kermouk.createRestorePoint();
    const result = await window.kermouk.applyPackComplet();
    if (result.ok) {
      setModeDone("✓ Pack Complet Fortnite appliqué — 10 étapes optimisées. Redémarrez Windows !");
    } else {
      setModeDone("✗ Erreur Pack Complet — vérifiez l'élévation UAC.");
    }
    setModeApplying(null);
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportContent(null);
    const result = await window.kermouk.generateSystemReport();
    setReportLoading(false);
    if (result.ok) {
      setReportContent(result.content);
      setReportFolder(result.reportPath);
    } else {
      setReportContent(`Erreur : ${result.error || "Impossible de générer le rapport."}`);
    }
  };

  const handleModeStreaming = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    if (modeApplying) return;
    setModeApplying("streaming" as typeof modeApplying);
    setModeDone("");
    const result = await window.kermouk.applyStreamingMode();
    if (result.ok) {
      setModeDone("Mode Streaming actif — OBS + Fortnite optimisés !");
    } else {
      setModeDone("✗ Erreur streaming — vérifiez UAC.");
    }
    setModeApplying(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          TABLEAU DE <span className="gradient-text">BORD</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Monitoring temps réel et optimisations instantanées
        </p>
      </div>

      {/* Status banner */}
      <div
        className="card"
        style={{
          background: isPremium
            ? "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, #111 100%)"
            : "linear-gradient(135deg, var(--primary-dim) 0%, #111 100%)",
          border: isPremium ? "1px solid rgba(34,197,94,0.2)" : "1px solid var(--primary-border)",
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
                background: isPremium ? "rgba(34,197,94,0.1)" : "var(--primary-dim)",
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "16px", color: isPremium ? "#22c55e" : "var(--primary)" }}>
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

      {/* ── Cartes de statut rapide ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {/* Carte Backup */}
        <div className="card" style={{ textAlign: "center", padding: "14px" }}>
          <div style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Sauvegardes</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "28px", fontWeight: 900, color: backupsCount > 0 ? "#22c55e" : "#333", lineHeight: 1 }}>
            {backupsCount}
          </div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>
            {backupsCount > 0 ? "disponible(s)" : "aucune sauvegarde"}
          </div>
        </div>

        {/* Carte Kermouk Fortnite Mode */}
        <div className="card" style={{ textAlign: "center", padding: "14px", background: tweaksCount > 0 ? "rgba(255,107,0,0.04)" : undefined, border: tweaksCount > 0 ? "1px solid var(--primary-border)" : undefined }}>
          <div style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Kermouk Mode</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tweaksCount > 0 ? "var(--primary)" : "#222", flexShrink: 0 }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 900, fontSize: "14px", color: tweaksCount > 0 ? "var(--primary)" : "#333" }}>
              {tweaksCount > 0 ? "ACTIF" : "INACTIF"}
            </span>
          </div>
          <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>
            {tweaksCount > 0 ? `${tweaksCount} tweaks appliqués` : "Aucun tweak actif"}
          </div>
        </div>

        {/* Carte Quickstart progress */}
        <div className="card" style={{ padding: "14px" }}>
          <div style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
            Quickstart {quickstepDone}/{quickstepItems.length}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {quickstepItems.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "12px", height: "12px", borderRadius: "3px", flexShrink: 0,
                  background: step.done ? "var(--primary)" : "#111",
                  border: step.done ? "none" : "1px solid #2a2a2a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {step.done && (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "9px", color: step.done ? "#ccc" : "#333", lineHeight: 1.2 }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anti-cheat badges */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        {[
          "✓ Easy Anti-Cheat Fortnite",
          "✓ Vanguard Valorant",
          "✓ 100% légal & sécurisé",
        ].map(badge => (
          <div key={badge} style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "10px", color: "#22c55e", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
            {badge}
          </div>
        ))}
      </div>

      {/* Quick mode buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <button
          onClick={handleModeGaming}
          disabled={modeApplying !== null}
          className="btn-primary"
          style={{ padding: "14px", textAlign: "center" }}
        >
          <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.05em" }}>
            {modeApplying === "gaming" ? "Application..." : "MODE GAMING"}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.75, marginTop: "3px" }}>
            {ALL_FREE.length} tweaks FREE en 1 clic
          </div>
        </button>
        <button
          onClick={handleModeTournoi}
          disabled={modeApplying !== null}
          style={{
            padding: "14px", border: "none", borderRadius: "8px",
            cursor: "pointer",
            background: isPremium ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(40,40,40,0.8)",
            color: "white", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            textAlign: "center", transition: "all 0.2s", opacity: modeApplying ? 0.6 : 1,
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.05em" }}>
            {modeApplying === "tournoi" ? "Application..." : "MODE TOURNOI"}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.75, marginTop: "3px" }}>
            {isPremium ? `${ALL_TWEAKS.length} tweaks ALL` : "Premium requis"}
          </div>
        </button>
        <button
          onClick={handleModeStreaming}
          disabled={modeApplying !== null}
          style={{
            padding: "14px", borderRadius: "8px",
            cursor: "pointer",
            background: isPremium ? "linear-gradient(135deg, #0f172a, #1e3a5f)" : "rgba(40,40,40,0.8)",
            color: "white", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            textAlign: "center", transition: "all 0.2s", opacity: modeApplying ? 0.6 : 1,
            border: isPremium ? "1px solid rgba(59,130,246,0.4)" : "1px solid #222",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.05em" }}>
            {modeApplying === "streaming" ? "Application..." : "MODE STREAMING"}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.75, marginTop: "3px" }}>
            {isPremium ? "OBS + Fortnite" : "Premium requis"}
          </div>
        </button>

        <button
          onClick={handlePackComplet}
          disabled={modeApplying !== null}
          style={{
            padding: "14px", borderRadius: "8px",
            cursor: modeApplying ? "default" : "pointer",
            background: "linear-gradient(135deg, #92400e, #b45309)",
            color: "white", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
            textAlign: "center", transition: "all 0.2s", opacity: modeApplying ? 0.6 : 1,
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.05em" }}>
            {modeApplying === "pack" ? "Application..." : "PACK COMPLET"}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.75, marginTop: "3px" }}>
            10 étapes • Services+Réseau+Reg
          </div>
        </button>
      </div>

      {modeDone && (
        <div className="card" style={{
          marginBottom: "12px",
          borderColor: modeDone.startsWith("✗") ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)",
          background: modeDone.startsWith("✗") ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)",
        }}>
          <div style={{ fontSize: "12px", color: modeDone.startsWith("✗") ? "#ef4444" : "#22c55e", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
            {modeDone}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
        <div className="stat-chip">
          <div style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Tweaks appliqués</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "24px", fontWeight: 900, color: "var(--primary)" }}>
            {tweaksCount}
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>actifs</div>
        </div>
        <div className="stat-chip">
          <div style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Ping Fortnite EU</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "24px", fontWeight: 900 }} className={pingClass}>
            {pingLoading ? "..." : pingLabel}
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>serveur EU</div>
        </div>
        <div className="stat-chip">
          <div style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Temp. CPU</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "24px", fontWeight: 900, color: cpuTempColor }}>
            {hw && hw.cpuTemp >= 0 ? `${hw.cpuTemp}°` : "N/A"}
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>celsius</div>
        </div>
        <div className="stat-chip">
          <div style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Tweaks dispo</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "24px", fontWeight: 900, color: "var(--primary)" }}>
            {isPremium ? ALL_TWEAKS.length : ALL_FREE.length}
          </div>
          <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>{isPremium ? "tous débloqués" : `sur ${ALL_TWEAKS.length} total`}</div>
        </div>
      </div>

      {/* RAM + CPU monitoring */}
      {hw && (
        <div className="card" style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
            Monitoring Temps Réel
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* RAM */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#666" }}>RAM utilisée</span>
                <span style={{ fontSize: "11px", color: "#ccc", fontWeight: 700 }}>
                  {hw.ramUsedGb > 0 ? `${hw.ramUsedGb} / ${hw.ramTotalGb} GB` : `${hw.ramUsage}%`}
                </span>
              </div>
              <div className="ram-bar">
                <div
                  className="ram-fill"
                  style={{
                    width: `${hw.ramUsage}%`,
                    background: hw.ramUsage > 85
                      ? "#ef4444"
                      : hw.ramUsage > 65
                      ? "var(--primary)"
                      : "#22c55e",
                  }}
                />
              </div>
            </div>

            {/* CPU */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#666" }}>CPU utilisation</span>
                <span style={{ fontSize: "11px", color: "#ccc", fontWeight: 700 }}>{hw.cpuUsage}%</span>
              </div>
              <div className="ram-bar">
                <div
                  className="ram-fill"
                  style={{
                    width: `${hw.cpuUsage}%`,
                    background: hw.cpuUsage > 85
                      ? "#ef4444"
                      : hw.cpuUsage > 60
                      ? "var(--primary)"
                      : "#22c55e",
                  }}
                />
              </div>
            </div>

            {/* GPU usage */}
            {hw.gpuUsage >= 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#666" }}>GPU utilisation</span>
                  <span style={{ fontSize: "11px", color: "#ccc", fontWeight: 700 }}>{hw.gpuUsage}%</span>
                </div>
                <div className="ram-bar">
                  <div
                    className="ram-fill"
                    style={{ width: `${hw.gpuUsage}%`, background: "var(--primary)" }}
                  />
                </div>
              </div>
            )}

            {/* GPU temp */}
            {hw.gpuTemp >= 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#666" }}>Temp. GPU</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: hw.gpuTemp > 85 ? "#ef4444" : hw.gpuTemp > 70 ? "var(--primary)" : "#22c55e" }}>
                    {hw.gpuTemp}°C
                  </span>
                </div>
                <div className="ram-bar">
                  <div
                    className="ram-fill"
                    style={{
                      width: `${(hw.gpuTemp / 100) * 100}%`,
                      background: hw.gpuTemp > 85 ? "#ef4444" : hw.gpuTemp > 70 ? "var(--primary)" : "#22c55e",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System info */}
      <div className="card">
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Mon PC
        </div>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444", fontSize: "12px" }}>
            <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
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

      {/* Update section */}
      <UpdateCard
        status={updateStatus}
        version={updateVersion}
        percent={updatePercent}
        errorMsg={updateError}
        currentVersion={currentVersion}
        onCheck={handleCheckUpdate}
        onInstall={handleInstallUpdate}
        onDismiss={() => setUpdateStatus("idle")}
      />

      {/* Rapport système */}
      <div className="card" style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: reportContent ? "12px" : 0 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666" }}>
            Rapport Système
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {reportFolder && (
              <button
                onClick={() => window.kermouk.openExternal(reportFolder)}
                style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "10px", background: "transparent", border: "1px solid #1e1e1e", color: "#555", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}
              >
                Ouvrir dossier
              </button>
            )}
            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "10px", background: "transparent", border: "1px solid #1e1e1e", color: reportLoading ? "#333" : "#555", cursor: reportLoading ? "default" : "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}
            >
              {reportLoading ? "Génération..." : "Générer rapport"}
            </button>
          </div>
        </div>
        {reportContent && (
          <pre style={{ fontSize: "9px", color: "#444", lineHeight: 1.6, fontFamily: "monospace", maxHeight: "200px", overflowY: "auto", background: "#080808", border: "1px solid #111", borderRadius: "6px", padding: "10px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {reportContent}
          </pre>
        )}
        {reportFolder && (
          <div style={{ fontSize: "10px", color: "#333", marginTop: "8px" }}>
            RESTAURER_TWEAKS.bat généré dans le même dossier.
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
            "Utilisez Mode Gaming pour appliquer tous les tweaks FREE en un clic.",
            isPremium
              ? "Mode Tournoi applique TOUS les tweaks + GameUserSettings.ini Fortnite optimal."
              : "Passez Premium pour accéder au Mode Tournoi et aux tweaks avancés.",
            "Redémarrez Windows après application pour que tous les changements prennent effet.",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#555" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)" style={{ flexShrink: 0, marginTop: "1px" }}>
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

// ─── Update card sub-component ───────────────────────────────────────────────
interface UpdateCardProps {
  status: UpdateStatus;
  version: string;
  percent: number;
  errorMsg: string;
  currentVersion: string;
  onCheck: () => void;
  onInstall: () => void;
  onDismiss: () => void;
}

function UpdateCard({ status, version, percent, currentVersion, onCheck, onInstall, onDismiss }: UpdateCardProps) {
  const isUpToDate = status === "up-to-date";
  const isAvailable = status === "available";
  const isDownloading = status === "downloading";
  const isDownloaded = status === "downloaded";
  const isNoServer = status === "error" || status === "no-server";
  const isChecking = status === "checking";

  const badgeColor = isUpToDate ? "#22c55e"
    : isAvailable || isDownloading || isDownloaded ? "#f59e0b"
    : "#444";

  const badgeBg = isUpToDate ? "rgba(34,197,94,0.08)"
    : isAvailable || isDownloading || isDownloaded ? "rgba(245,158,11,0.08)"
    : "rgba(40,40,40,0.4)";

  const badgeBorder = isUpToDate ? "rgba(34,197,94,0.2)"
    : isAvailable || isDownloading || isDownloaded ? "rgba(245,158,11,0.2)"
    : "#1a1a1a";

  const badgeLabel = isUpToDate ? `✓ A jour — v${currentVersion}`
    : isAvailable ? `Mise a jour v${version} disponible`
    : isDownloading ? `Telechargement... ${percent}%`
    : isDownloaded ? `Prete a installer — v${version}`
    : isNoServer ? `Impossible de verifier (GitHub injoignable)`
    : isChecking ? "Verification en cours..."
    : `v${currentVersion} — cliquez pour verifier`;

  const btnLabel = isChecking ? "Verification..."
    : isNoServer ? "Telecharger"
    : "Verifier";

  return (
    <div className="card" style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isDownloading || isDownloaded ? "12px" : "0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555" }}>
            Mise a jour
          </div>
          <div style={{
            padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700,
            color: badgeColor, background: badgeBg, border: `1px solid ${badgeBorder}`,
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em",
          }}>
            {badgeLabel}
          </div>
        </div>
        <button
          onClick={onCheck}
          disabled={isChecking || isDownloading}
          style={{
            padding: "4px 12px", borderRadius: "6px", fontSize: "10px",
            background: "transparent", border: "1px solid #1e1e1e",
            color: isNoServer ? "var(--primary)" : "#555",
            cursor: isChecking || isDownloading ? "default" : "pointer",
            fontFamily: "Rajdhani, sans-serif", fontWeight: 700, letterSpacing: "0.06em",
            opacity: isChecking || isDownloading ? 0.4 : 1,
          }}
        >
          {btnLabel}
        </button>
      </div>

      {/* Download progress bar */}
      {isDownloading && (
        <div>
          <div className="ram-bar" style={{ marginBottom: "4px" }}>
            <div className="ram-fill" style={{ width: `${percent}%`, background: "#f59e0b", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: "10px", color: "#555", textAlign: "right" }}>{percent}%</div>
        </div>
      )}

      {/* Ready to install */}
      {isDownloaded && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: "11px", color: "#f59e0b" }}>
            v{version} telechargee — redemarrer pour appliquer
          </div>
          <button onClick={onInstall} className="btn-primary" style={{ padding: "6px 14px", fontSize: "11px", whiteSpace: "nowrap" }}>
            Redemarrer et mettre a jour
          </button>
          <button onClick={onDismiss} style={{ padding: "5px 10px", background: "none", border: "1px solid #1e1e1e", borderRadius: "6px", color: "#555", fontSize: "11px", cursor: "pointer" }}>
            Plus tard
          </button>
        </div>
      )}
    </div>
  );
}
