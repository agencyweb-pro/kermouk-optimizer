import { useState, useEffect, useRef } from "react";
import { FREE_TWEAKS, PREMIUM_TWEAKS } from "../utils/tweakEngine";
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
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [reportFolder, setReportFolder] = useState("");
  const [tweaksCount, setTweaksCount] = useState(() => getActiveTweaksCount());

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

  const DOWNLOAD_URL = "https://github.com/agencyweb-pro/kermouk-optimizer/releases/latest";

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

  return (
    <div>
      {/* Stats row — tweaks / ping / temp CPU / tweaks dispo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
        <div className="stat-chip">
          <div style={{ fontSize: "9px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Tweaks appliqués</div>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "24px", fontWeight: 900, color: "var(--primary)" }}>{tweaksCount}</div>
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
