import { useState } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type FixStatus = "idle" | "running" | "success" | "error";

interface Fix {
  id: string;
  title: string;
  desc: string;
  bat: string;
}

const FIXES: Fix[] = [
  {
    id: "windows-update",
    title: "Windows Update",
    desc: "Corrige les erreurs de mise à jour bloquées — reset des services WU et suppression du cache SoftwareDistribution.",
    bat: [
      "@echo off",
      "net stop wuauserv",
      "net stop bits",
      "net stop cryptsvc",
      "net stop msiserver",
      "rd /s /q %systemroot%\\SoftwareDistribution",
      "rd /s /q %systemroot%\\system32\\catroot2",
      "net start cryptsvc",
      "net start bits",
      "net start msiserver",
      "net start wuauserv",
    ].join("\r\n"),
  },
  {
    id: "audio-latency",
    title: "Audio Latence",
    desc: "Corrige le crackling et les latences audio en jeu — redémarrage du service audio Windows.",
    bat: [
      "@echo off",
      "net stop audiosrv",
      "net stop AudioEndpointBuilder",
      "net start AudioEndpointBuilder",
      "net start audiosrv",
    ].join("\r\n"),
  },
  {
    id: "bsod-irql",
    title: "BSOD IRQL",
    desc: "Fix IRQL_NOT_LESS_OR_EQUAL — reset du vérificateur de drivers et du catalogue Winsock.",
    bat: [
      "@echo off",
      "verifier /reset",
      "netsh winsock reset catalog",
      "ipconfig /flushdns",
    ].join("\r\n"),
  },
  {
    id: "network-reset",
    title: "Reset Réseau",
    desc: "Réinitialise la pile TCP/IP, Winsock et vide le cache DNS — utile pour pings élevés ou perte de paquets.",
    bat: [
      "@echo off",
      "netsh int ip reset",
      "netsh int ipv6 reset",
      "ipconfig /release",
      "ipconfig /flushdns",
      "ipconfig /renew",
      "netsh winsock reset",
    ].join("\r\n"),
  },
];

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
        setError(fix.id, res?.error ?? "Echec de l'exécution");
      }
    } catch (e) {
      setStatus(fix.id, "error");
      setError(fix.id, String(e));
    }
  }

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          FIXES & <span className="gradient-text">CORRECTIONS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Corrections automatiques des problèmes courants Windows
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {FIXES.map(fix => {
          const status = statuses[fix.id] ?? "idle";
          const err = errors[fix.id] ?? "";

          let borderColor = "transparent";
          if (status === "success") borderColor = "rgba(30,215,96,0.2)";
          if (status === "error") borderColor = "rgba(255,50,50,0.2)";

          return (
            <div
              key={fix.id}
              className="card"
              style={{ border: `1px solid ${borderColor}`, transition: "border-color 0.2s" }}
            >
              <div style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#ccc",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                {fix.title}
              </div>
              <div style={{ fontSize: "11px", color: "#444", marginBottom: "14px", lineHeight: 1.5 }}>
                {fix.desc}
              </div>

              {err && (
                <div style={{ fontSize: "10px", color: "#ff5555", marginBottom: "8px", fontFamily: "Rajdhani, sans-serif" }}>
                  {err}
                </div>
              )}

              {status === "success" ? (
                <div style={{
                  fontSize: "11px",
                  color: "var(--primary)",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  ✓ Appliqué
                </div>
              ) : (
                <button
                  onClick={() => runFix(fix)}
                  disabled={status === "running"}
                  style={{
                    padding: "7px 14px",
                    background: status === "running" ? "transparent" : "rgba(30,215,96,0.06)",
                    border: "1px solid rgba(30,215,96,0.2)",
                    borderRadius: "5px",
                    color: status === "running" ? "#555" : "var(--primary)",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    cursor: status === "running" ? "wait" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {status === "running" ? "En cours..." : "Exécuter"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
