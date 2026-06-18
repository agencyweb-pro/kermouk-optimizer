import { useState, useEffect } from "react";
import { FREE_TWEAKS, PREMIUM_TWEAKS, generateBatScript } from "../utils/tweakEngine";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type LogEntry = { text: string; type: string };

const ALL_FREE_TWEAKS_IDS = FREE_TWEAKS.map((t) => t.id);
const ALL_TWEAKS = [...FREE_TWEAKS, ...PREMIUM_TWEAKS];

export default function FortniteAdvanced({ isPremium, openLicenseModal }: Props) {
  const [iniStatus, setIniStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [iniError, setIniError] = useState("");

  useEffect(() => {
    window.kermouk?.getTweakStates?.().then(states => {
      if (states?.["fortnite-ini"]) setIniStatus("ok");
    }).catch(() => {});
  }, []);

  const [cacheStatus, setCacheStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [cacheResult, setCacheResult] = useState("");

  const [priorityStatus, setPriorityStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [modeStatus, setModeStatus] = useState<"idle" | "applying">("idle");
  const [modeLogs, setModeLogs] = useState<LogEntry[]>([]);

  const addModeLog = (text: string, type = "ok") =>
    setModeLogs((prev) => [...prev, { text, type }]);

  const handleApplyIni = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    setIniStatus("loading");
    setIniError("");
    const result = await window.kermouk.applyFortniteIni();
    if (result.ok) {
      setIniStatus("ok");
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + 1));
      window.kermouk?.setTweakState?.("fortnite-ini", true);
    } else {
      setIniStatus("error");
      setIniError(result.error || "Erreur inconnue");
    }
  };

  const handleCleanCache = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    setCacheStatus("loading");
    const result = await window.kermouk.cleanFortniteCache();
    if (result.ok) {
      setCacheStatus("ok");
      setCacheResult(`${result.deletedCount || 0} dossier(s) supprimé(s)`);
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + 1));
    } else {
      setCacheStatus("error");
      setCacheResult(result.error || "Erreur");
    }
  };

  const handleFortniteProcessPriority = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    setPriorityStatus("loading");
    const bat = generateBatScript([
      {
        id: "fn-proc-priority",
        name: "Priorité Fortnite HIGH",
        description: "",
        category: "premium",
        commands: [],
        powershellCommands: [
          'Get-Process -Name "EpicGamesLauncher" -ErrorAction SilentlyContinue | ForEach-Object { $_.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High }',
          'Get-Process -Name "FortniteClient-Win64-Shipping" -ErrorAction SilentlyContinue | ForEach-Object { $_.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High }',
        ],
      },
    ]);
    const result = await window.kermouk.applyTweaks(bat, ["Priorité Fortnite HIGH"]);
    setPriorityStatus(result.ok ? "ok" : "error");
    if (result.ok) {
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + 1));
    }
  };

  const handleModeGaming = async () => {
    if (modeStatus === "applying") return;
    setModeStatus("applying");
    setModeLogs([]);
    addModeLog("Mode Gaming — application de tous les tweaks FREE...", "info");

    const rpResult = await window.kermouk.createRestorePoint();
    addModeLog(rpResult.ok ? "✓ Point de restauration créé." : "⚠ Point de restauration ignoré.", rpResult.ok ? "ok" : "warn");

    const bat = generateBatScript(FREE_TWEAKS);
    const result = await window.kermouk.applyTweaks(bat, FREE_TWEAKS.map((t) => t.name));

    if (result.ok) {
      addModeLog(`✓ ${result.message}`, "ok");
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + FREE_TWEAKS.length));
    } else {
      addModeLog(`✗ ${result.message}`, "error");
    }

    addModeLog("⚡ Redémarrez Windows pour finaliser.", "warn");
    setModeStatus("idle");
  };

  const handleModeTournoi = async () => {
    if (!isPremium) { openLicenseModal(); return; }
    if (modeStatus === "applying") return;
    setModeStatus("applying");
    setModeLogs([]);
    addModeLog("Mode Tournoi — application de TOUS les tweaks...", "info");

    const rpResult = await window.kermouk.createRestorePoint();
    addModeLog(rpResult.ok ? "✓ Point de restauration créé." : "⚠ Point de restauration ignoré.", rpResult.ok ? "ok" : "warn");

    const tweaksToApply = ALL_TWEAKS.filter((t) => t.id !== "nvidia-auto-boost");
    const bat = generateBatScript(tweaksToApply);
    const result = await window.kermouk.applyTweaks(bat, tweaksToApply.map((t) => t.name));

    if (result.ok) {
      addModeLog(`✓ ${result.message}`, "ok");
      const prev = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
      localStorage.setItem("kermouk_tweaks_count", String(prev + tweaksToApply.length));
      addModeLog("⚡ Application du GameUserSettings.ini Fortnite...", "info");
      const iniResult = await window.kermouk.applyFortniteIni();
      addModeLog(iniResult.ok ? "✓ GameUserSettings.ini appliqué." : "⚠ INI ignoré (Fortnite non installé ?)", iniResult.ok ? "ok" : "warn");
    } else {
      addModeLog(`✗ ${result.message}`, "error");
    }

    addModeLog("🏆 Mode Tournoi complet. Redémarrez Windows !", "warn");
    setModeStatus("idle");
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "loading") return (
      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
    if (status === "ok") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
    if (status === "error") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
    return null;
  };

  const allFreeIds = ALL_TWEAKS.filter(t => t.category === "free").length;
  const allTweaksCount = ALL_TWEAKS.length;

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          FORTNITE <span className="gradient-text">AVANCÉ</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Configuration INI, nettoyage cache, modes gaming instantanés
        </p>
      </div>

      {/* Mode Gaming / Mode Tournoi */}
      <div className="card" style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.05) 0%, #111 100%)", borderColor: "rgba(255,107,0,0.25)", marginBottom: "16px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "12px" }}>
          Modes rapides
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleModeGaming}
              disabled={modeStatus === "applying"}
              className="btn-primary"
              style={{ width: "100%", padding: "12px 16px" }}
            >
              <div style={{ fontSize: "13px", fontWeight: 900 }}>MODE GAMING</div>
              <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "2px" }}>{allFreeIds} tweaks FREE</div>
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleModeTournoi}
              disabled={modeStatus === "applying" || !isPremium}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: isPremium
                  ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                  : "rgba(60,60,60,0.5)",
                opacity: isPremium ? 1 : 0.6,
              }}
              title={!isPremium ? "Premium requis" : undefined}
            >
              <div style={{ fontSize: "13px", fontWeight: 900 }}>MODE TOURNOI</div>
              <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "2px" }}>
                {isPremium ? `${allTweaksCount} tweaks ALL` : "Premium requis"}
              </div>
            </button>
          </div>
        </div>

        {modeLogs.length > 0 && (
          <div className="log-container">
            {modeLogs.map((log, i) => (
              <div key={i} className={`log-line-${log.type}`} style={{ marginBottom: "2px" }}>
                &gt; {log.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GameUserSettings.ini */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", color: "#e0e0e0" }}>
                GameUserSettings.ini Optimal
              </span>
              <span className="badge badge-premium">PREMIUM</span>
            </div>
            <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6, marginBottom: "8px" }}>
              Applique les paramètres optimaux Fortnite : FPS illimité, fullscreen exclusif, shadows/AA/post-process à 0,
              textures à 2, VSync désactivé.
            </div>
            <div style={{ fontSize: "10px", color: "#333", fontFamily: "monospace" }}>
              %LOCALAPPDATA%\FortniteGame\Saved\Config\WindowsClient\GameUserSettings.ini
            </div>
            {iniStatus === "error" && (
              <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>{iniError}</div>
            )}
            {iniStatus === "ok" && (
              <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>✓ GameUserSettings.ini appliqué avec succès !</div>
            )}
          </div>
          <button
            onClick={handleApplyIni}
            disabled={iniStatus === "loading"}
            className="btn-primary"
            style={{ padding: "10px 16px", fontSize: "12px", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}
          >
            <StatusIcon status={iniStatus} />
            {iniStatus === "loading" ? "Application..." : iniStatus === "ok" ? "Réappliquer" : "Appliquer INI"}
          </button>
        </div>
      </div>

      {/* Cache cleanup */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", color: "#e0e0e0" }}>
                Nettoyage Cache Epic & Fortnite
              </span>
              <span className="badge badge-premium">PREMIUM</span>
            </div>
            <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6, marginBottom: "4px" }}>
              Supprime les dossiers webcache (Epic Games Launcher + Fortnite) et PipelineCaches pour forcer
              une recompilation propre des shaders.
            </div>
            {cacheStatus === "ok" && (
              <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>✓ Cache nettoyé — {cacheResult}</div>
            )}
            {cacheStatus === "error" && (
              <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>✗ {cacheResult}</div>
            )}
          </div>
          <button
            onClick={handleCleanCache}
            disabled={cacheStatus === "loading"}
            className="btn-primary"
            style={{ padding: "10px 16px", fontSize: "12px", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}
          >
            <StatusIcon status={cacheStatus} />
            {cacheStatus === "loading" ? "Nettoyage..." : "Nettoyer Cache"}
          </button>
        </div>
      </div>

      {/* Process priority */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", color: "#e0e0e0" }}>
                Priorité Processus Fortnite HIGH
              </span>
              <span className="badge badge-premium">PREMIUM</span>
            </div>
            <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
              Met EpicGamesLauncher et FortniteClient-Win64-Shipping en priorité Haute immédiatement.
              <strong style={{ color: "#888" }}> Fortnite doit être ouvert.</strong>
            </div>
            {priorityStatus === "ok" && (
              <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>✓ Priorité HIGH appliquée !</div>
            )}
            {priorityStatus === "error" && (
              <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>✗ Échec (Fortnite ouvert ?)</div>
            )}
          </div>
          <button
            onClick={handleFortniteProcessPriority}
            disabled={priorityStatus === "loading"}
            className="btn-primary"
            style={{ padding: "10px 16px", fontSize: "12px", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}
          >
            <StatusIcon status={priorityStatus} />
            {priorityStatus === "loading" ? "Application..." : "Appliquer"}
          </button>
        </div>
      </div>

      {/* INI settings preview */}
      <div className="card" style={{ opacity: 0.8 }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#444", marginBottom: "10px" }}>
          Paramètres INI appliqués
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
          {[
            ["bShowFPS", "True"],
            ["FrameRateLimit", "0 (illimité)"],
            ["FullscreenMode", "1 (exclusif)"],
            ["sg.ShadowQuality", "0"],
            ["sg.AntiAliasingQuality", "0"],
            ["sg.TextureQuality", "2"],
            ["sg.EffectsQuality", "0"],
            ["bUseVSync", "False"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", padding: "3px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#444", fontFamily: "monospace" }}>{k}</span>
              <span style={{ color: "var(--primary)", fontFamily: "monospace", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
