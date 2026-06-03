import { useState } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

const POLLING_OPTIONS = [
  { hz: 125, ms: 8 },
  { hz: 500, ms: 2 },
  { hz: 1000, ms: 1 },
  { hz: 4000, ms: 0.25 },
  { hz: 8000, ms: 0.125 },
];

const MONITOR_HZ = [60, 144, 165, 240, 360];

export default function InputLagCalculator({ isPremium, openLicenseModal }: Props) {
  const [pollingHz, setPollingHz] = useState(1000);
  const [monitorHz, setMonitorHz] = useState(144);
  const [responseTime, setResponseTime] = useState(1);
  const [ping, setPing] = useState(30);
  const [cpuScore, setCpuScore] = useState(60);
  const [calculated, setCalculated] = useState(false);

  const pollingMs = POLLING_OPTIONS.find(p => p.hz === pollingHz)?.ms ?? 1;
  const frameMs = (1000 / monitorHz) / 2;
  const renderLag = Math.max(0, (100 - cpuScore) * 0.08);
  const total = pollingMs + frameMs + responseTime + ping / 2 + renderLag;

  const category =
    total < 10 ? "Pro" :
    total < 15 ? "Compétitif" :
    total < 25 ? "Casual+" : "Casual";

  const categoryColor =
    total < 10 ? "#22c55e" :
    total < 15 ? "#FF6B00" :
    total < 25 ? "#f59e0b" : "#ef4444";

  const allRecs = [
    pollingHz < 1000 && "Passe ton polling souris à 1000 Hz minimum pour réduire de " + (pollingMs - 1).toFixed(2) + "ms",
    monitorHz < 144 && "Un moniteur 144 Hz réduira ton frame time de " + (frameMs - 1000/144/2).toFixed(1) + "ms",
    responseTime > 2 && "Cherche un écran 1ms GtG (gaming) — ton écran actuel ajoute " + (responseTime - 1) + "ms",
    ping > 50 && "Applique les tweaks réseau TCP/IP pour réduire ton ping",
    cpuScore < 60 && "Les tweaks CPU de Kermouk peuvent améliorer ton score de rendu",
  ].filter(Boolean) as string[];

  const visibleRecs = isPremium ? allRecs : allRecs.slice(0, 2);

  const decomp = [
    { label: "Polling souris", value: pollingMs, max: 8 },
    { label: "Frame time (½)", value: frameMs, max: 8 },
    { label: "Réponse écran", value: responseTime, max: 10 },
    { label: "Latence réseau (½)", value: ping / 2, max: 100 },
    { label: "Lag CPU/rendu", value: renderLag, max: 10 },
  ];

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          CALCULATEUR D'<span className="gradient-text">INPUT LAG</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Calcule ton input lag total et identifie les points d'amélioration
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* Formulaire */}
        <div>
          <div className="card" style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "12px" }}>
              Souris — Taux de polling
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {POLLING_OPTIONS.map(p => (
                <button
                  key={p.hz}
                  onClick={() => setPollingHz(p.hz)}
                  style={{
                    padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                    border: pollingHz === p.hz ? "1px solid var(--primary)" : "1px solid #1e1e1e",
                    background: pollingHz === p.hz ? "var(--primary-dim)" : "#0d0d0d",
                    color: pollingHz === p.hz ? "var(--primary)" : "#555",
                    fontSize: "11px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  }}
                >
                  {p.hz} Hz
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "12px" }}>
              Écran
            </div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "6px" }}>Fréquence (Hz)</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              {MONITOR_HZ.map(hz => (
                <button
                  key={hz}
                  onClick={() => setMonitorHz(hz)}
                  style={{
                    padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                    border: monitorHz === hz ? "1px solid var(--primary)" : "1px solid #1e1e1e",
                    background: monitorHz === hz ? "var(--primary-dim)" : "#0d0d0d",
                    color: monitorHz === hz ? "var(--primary)" : "#555",
                    fontSize: "11px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  }}
                >
                  {hz}
                </button>
              ))}
            </div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "6px" }}>Temps de réponse (ms)</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[0.5, 1, 2, 4, 8].map(ms => (
                <button
                  key={ms}
                  onClick={() => setResponseTime(ms)}
                  style={{
                    padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                    border: responseTime === ms ? "1px solid var(--primary)" : "1px solid #1e1e1e",
                    background: responseTime === ms ? "var(--primary-dim)" : "#0d0d0d",
                    color: responseTime === ms ? "var(--primary)" : "#555",
                    fontSize: "11px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                  }}
                >
                  {ms}ms
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "14px" }}>
              Connexion & CPU
            </div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Ping actuel</div>
            <input type="range" min={5} max={200} value={ping} onChange={e => setPing(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)", marginBottom: "4px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444", marginBottom: "12px" }}>
              <span>5ms</span>
              <span style={{ color: "var(--primary)", fontFamily: "Orbitron, sans-serif" }}>{ping}ms</span>
              <span>200ms</span>
            </div>
            <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px" }}>Score CPU estimé</div>
            <input type="range" min={0} max={100} value={cpuScore} onChange={e => setCpuScore(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)", marginBottom: "4px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
              <span>Faible</span>
              <span style={{ color: "var(--primary)", fontFamily: "Orbitron, sans-serif" }}>{cpuScore}/100</span>
              <span>Excellent</span>
            </div>
          </div>

          <button onClick={() => setCalculated(true)} className="btn-primary" style={{ width: "100%", padding: "12px" }}>
            Calculer mon input lag
          </button>
        </div>

        {/* Résultats */}
        <div>
          <div className="card" style={{ textAlign: "center", marginBottom: "10px", padding: "24px 16px" }}>
            <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
              Input Lag Total
            </div>
            <div style={{
              fontFamily: "Orbitron, sans-serif", fontSize: "56px", fontWeight: 900,
              color: calculated ? categoryColor : "#222", lineHeight: 1, transition: "color 0.3s",
            }}>
              {total.toFixed(1)}
            </div>
            <div style={{ fontSize: "14px", color: "#444", marginBottom: "12px" }}>ms</div>
            {calculated && (
              <div style={{
                display: "inline-block", padding: "5px 16px", borderRadius: "20px",
                background: `${categoryColor}22`, border: `1px solid ${categoryColor}44`,
                color: categoryColor, fontSize: "12px", fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                letterSpacing: "0.08em",
              }}>
                {category}
              </div>
            )}
          </div>

          {calculated && (
            <>
              <div className="card" style={{ marginBottom: "10px" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "12px" }}>
                  Décomposition
                </div>
                {decomp.map(d => (
                  <div key={d.label} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "10px", color: "#555" }}>{d.label}</span>
                      <span style={{ fontSize: "10px", color: "#ccc", fontFamily: "Orbitron, sans-serif" }}>{d.value.toFixed(2)}ms</span>
                    </div>
                    <div className="ram-bar">
                      <div className="ram-fill" style={{ width: `${Math.min(100, (d.value / d.max) * 100)}%`, background: "var(--primary)" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginBottom: "10px" }}>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "12px" }}>
                  Niveau de jeu
                </div>
                {[
                  { label: "Casual", max: 25, color: "#ef4444" },
                  { label: "Casual+", max: 20, color: "#f59e0b" },
                  { label: "Compétitif", max: 15, color: "#FF6B00" },
                  { label: "Pro (< 10ms)", max: 10, color: "#22c55e" },
                ].map(cat => {
                  const reached = total <= cat.max;
                  return (
                    <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: reached ? cat.color : "#1e1e1e", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: reached ? cat.color : "#333", flex: 1 }}>{cat.label}</span>
                      <span style={{ fontSize: "10px", color: "#333" }}>{"<"} {cat.max}ms</span>
                    </div>
                  );
                })}
              </div>

              {allRecs.length > 0 && (
                <div className="card">
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "12px" }}>
                    Recommandations
                  </div>
                  {visibleRecs.map((rec, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "11px", color: "#666" }}>
                      <span style={{ color: "var(--primary)", flexShrink: 0 }}>›</span>
                      {rec}
                    </div>
                  ))}
                  {!isPremium && allRecs.length > 2 && (
                    <button onClick={openLicenseModal} style={{ marginTop: "8px", fontSize: "10px", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
                      +{allRecs.length - 2} recommandations Premium →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
