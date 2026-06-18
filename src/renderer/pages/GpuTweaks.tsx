import { useState } from "react";
import TweakSection from "../components/TweakSection";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

const GPU_TWEAKS = [
  PREMIUM_TWEAKS.find((t) => t.id === "disable-mpo")!,
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-tdr")!,
  PREMIUM_TWEAKS.find((t) => t.id === "gpu-hwsched")!,
  PREMIUM_TWEAKS.find((t) => t.id === "disable-hpet")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-ull")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-shader-cache")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-auto-boost")!,
  PREMIUM_TWEAKS.find((t) => t.id === "nvidia-power-management")!,
].filter(Boolean);

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type ApplyState = "idle" | "detecting" | "applying-opt" | "applying-fn" | "ok-opt" | "ok-fn" | "error";

export default function GpuTweaks({ isPremium, openLicenseModal }: Props) {
  const [inspectorPath, setInspectorPath] = useState<string | null>(null);
  const [detected, setDetected] = useState<boolean | null>(null);
  const [applyState, setApplyState] = useState<ApplyState>("idle");
  const [applyError, setApplyError] = useState("");

  const handleDetect = async () => {
    setApplyState("detecting");
    setApplyError("");
    const result = await window.kermouk.detectNvidiaInspector();
    setDetected(result.found);
    setInspectorPath(result.path);
    if (!result.found) setApplyState("idle");
    else setApplyState("idle");
  };

  const handleApplyProfile = async (filename: string, key: "opt" | "fn") => {
    if (!isPremium) { openLicenseModal(); return; }
    if (!inspectorPath) { await handleDetect(); return; }
    setApplyState(key === "opt" ? "applying-opt" : "applying-fn");
    setApplyError("");
    const result = await window.kermouk.applyNvidiaProfile(filename, inspectorPath);
    if (result.ok) {
      setApplyState(key === "opt" ? "ok-opt" : "ok-fn");
      setTimeout(() => setApplyState("idle"), 4000);
    } else {
      setApplyError(result.error || "Erreur inconnue");
      setApplyState("error");
    }
  };

  const isApplying = applyState === "applying-opt" || applyState === "applying-fn" || applyState === "detecting";

  return (
    <div>
      <TweakSection
        title="TWEAKS GPU"
        subtitle="TDR, Hardware Scheduling, Ultra Low Latency NVIDIA et Power Management Maximum"
        tweaks={GPU_TWEAKS}
        isPremium={isPremium}
        openLicenseModal={openLicenseModal}
      />

      {/* ── Nvidia Inspector section ─────────────────────────────────────── */}
      <div style={{ marginTop: "24px" }}>
        <div className="section-header">
          <h2 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "16px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
            NVIDIA <span className="gradient-text">PROFILE INSPECTOR</span>
          </h2>
          <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
            Profils optimisés pour Fortnite — Power Max, Low Latency Ultra, FRL, Aniso et LOD Bias cachés dans le driver
          </p>
        </div>

        <div className="card">
          {/* Badge Premium */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ccc" }}>
              NVIDIA Profile Inspector
            </span>
            <span className="badge badge-premium">PREMIUM</span>
            {detected === true && (
              <span style={{ fontSize: "10px", color: "#22c55e", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px", padding: "2px 8px" }}>
                ✓ Détecté
              </span>
            )}
            {detected === false && (
              <span style={{ fontSize: "10px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "4px", padding: "2px 8px" }}>
                ✗ Non trouvé
              </span>
            )}
          </div>

          {/* Path detected */}
          {inspectorPath && (
            <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "6px 10px", marginBottom: "12px", wordBreak: "break-all" }}>
              {inspectorPath}
            </div>
          )}

          {/* Detect + Download */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
            <button
              onClick={handleDetect}
              disabled={isApplying}
              className="btn-secondary"
              style={{ padding: "7px 14px", fontSize: "11px" }}
            >
              {applyState === "detecting" ? "Détection..." : "Détecter automatiquement"}
            </button>
            <button
              onClick={() => window.kermouk.openExternal("https://github.com/Orbmu2k/nvidiaProfileInspector/releases/latest")}
              style={{
                padding: "7px 14px", fontSize: "11px", borderRadius: "6px",
                background: "transparent", border: "1px solid #1e1e1e", color: "#666",
                cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Télécharger NVPI (GitHub)
            </button>
          </div>

          {/* Profils */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {/* Profil 1 */}
            <div style={{ padding: "14px", background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ccc", marginBottom: "4px" }}>
                Optimized Settings
              </div>
              <div style={{ fontSize: "10px", color: "#444", lineHeight: 1.6, marginBottom: "10px" }}>
                Profil global — Power Max, Low Latency Ultra Boost, VSync Off, 1 pre-rendered frame, Shader Cache 10 GB, Aniso 1x, Negative LOD Bias Allow.
              </div>
              <button
                onClick={() => handleApplyProfile("0_-_Optimized_Settings.nip", "opt")}
                disabled={isApplying || (!isPremium)}
                className="btn-primary"
                style={{ width: "100%", padding: "7px", fontSize: "11px" }}
              >
                {applyState === "applying-opt" ? "Application..." :
                 applyState === "ok-opt" ? "✓ Appliqué !" : "Appliquer profil"}
              </button>
            </div>

            {/* Profil 2 */}
            <div style={{ padding: "14px", background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", color: "#ccc", marginBottom: "4px" }}>
                Fortnite Perf Max
              </div>
              <div style={{ fontSize: "10px", color: "#444", lineHeight: 1.6, marginBottom: "10px" }}>
                Profil Fortnite — Low Latency Ultra Boost, LOD Bias négatif (+FPS), AA Off, Aniso 1x, VSync Off, Thread Opt On, Shader Cache 10 GB.
              </div>
              <button
                onClick={() => handleApplyProfile("FORTNITE_PERF_MAX.nip", "fn")}
                disabled={isApplying || (!isPremium)}
                style={{
                  width: "100%", padding: "7px", fontSize: "11px", borderRadius: "6px",
                  background: isPremium ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(60,60,60,0.5)",
                  color: "white", border: "none", cursor: isPremium ? "pointer" : "default",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  opacity: (isApplying && applyState !== "applying-fn") ? 0.5 : 1,
                }}
              >
                {applyState === "applying-fn" ? "Application..." :
                 applyState === "ok-fn" ? "✓ Appliqué !" : "Appliquer profil"}
              </button>
            </div>
          </div>

          {applyState === "error" && (
            <div style={{ marginTop: "10px", fontSize: "11px", color: "#ef4444", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "8px 10px" }}>
              ✗ {applyError || "Erreur — vérifiez que Nvidia Inspector est détecté et qu'une carte NVIDIA est installée."}
            </div>
          )}

          {detected === false && (
            <div style={{ marginTop: "10px", fontSize: "11px", color: "#f59e0b", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", padding: "8px 10px" }}>
              NVIDIA Profile Inspector non trouvé. Téléchargez-le depuis GitHub et placez-le sur le Bureau ou dans Downloads, puis relancez la détection.
            </div>
          )}

          <div style={{ marginTop: "12px", fontSize: "10px", color: "#2a2a2a", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            Les profils .nip sont inclus dans l'app. NVIDIA Profile Inspector doit être installé séparément (gratuit, open-source).
          </div>
        </div>
      </div>
    </div>
  );
}
