import { useState } from "react";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

interface BenchResult {
  cpuScore: number;
  ramScore: number;
  pingEU: number;
  cpuUsage: number;
  ramUsage: number;
  ts: number;
}

const METRICS = [
  { key: "cpuScore" as keyof BenchResult, label: "Score CPU", unit: "pts", better: "higher" },
  { key: "ramScore" as keyof BenchResult, label: "Score RAM", unit: "pts", better: "higher" },
  { key: "pingEU" as keyof BenchResult, label: "Ping EU", unit: "ms", better: "lower" },
  { key: "cpuUsage" as keyof BenchResult, label: "CPU au repos", unit: "%", better: "lower" },
  { key: "ramUsage" as keyof BenchResult, label: "RAM au repos", unit: "%", better: "lower" },
];

export default function Benchmark({ isPremium, openLicenseModal }: Props) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const [before, setBefore] = useState<BenchResult | null>(() => {
    try { return JSON.parse(localStorage.getItem("kermouk_bench_before") || "null"); } catch { return null; }
  });
  const [after, setAfter] = useState<BenchResult | null>(() => {
    try { return JSON.parse(localStorage.getItem("kermouk_bench_after") || "null"); } catch { return null; }
  });

  if (!isPremium) {
    return (
      <div>
        <div className="section-header">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
            BENCHMARK <span className="gradient-text">AVANT/APRÈS</span>
          </h1>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin: "0 auto 16px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "16px", color: "#444", marginBottom: "8px" }}>Fonctionnalité Premium</div>
          <div style={{ fontSize: "12px", color: "#333", marginBottom: "20px" }}>Mesure le gain réel de tes tweaks avec un benchmark avant/après.</div>
          <button onClick={openLicenseModal} className="btn-primary" style={{ padding: "10px 24px" }}>Activer Premium</button>
        </div>
      </div>
    );
  }

  const run = async () => {
    setRunning(true);
    setProgress(0);

    setLabel("Test CPU...");
    setProgress(5);
    const t0 = performance.now();
    let acc = 0;
    for (let i = 1; i <= 8_000_000; i++) acc += Math.sqrt(i);
    void acc;
    const cpuMs = performance.now() - t0;
    const cpuScore = Math.round(Math.min(100, (2000 / cpuMs) * 100));
    setProgress(35);

    setLabel("Test RAM...");
    await new Promise(r => setTimeout(r, 200));
    const buf = new Array(2_000_000).fill(0);
    const r0 = performance.now();
    for (let i = 0; i < buf.length; i++) buf[i] = i ^ 0xAB;
    const ramMs = performance.now() - r0;
    const ramScore = Math.round(Math.min(100, (800 / ramMs) * 100));
    setProgress(60);

    setLabel("Ping Fortnite EU...");
    const pingRes = await window.kermouk?.pingServer("13.248.195.0").catch(() => ({ ok: false, ms: -1 }));
    const pingEU = pingRes?.ms ?? -1;
    setProgress(80);

    setLabel("Utilisation système...");
    const hw = await window.kermouk?.getHardwareMonitor().catch(() => null);
    setProgress(95);

    await new Promise(r => setTimeout(r, 300));
    setLabel("Terminé !");
    setProgress(100);

    const result: BenchResult = {
      cpuScore,
      ramScore,
      pingEU,
      cpuUsage: hw?.cpuUsage ?? 0,
      ramUsage: hw?.ramUsage ?? 0,
      ts: Date.now(),
    };

    if (!before) {
      setBefore(result);
      localStorage.setItem("kermouk_bench_before", JSON.stringify(result));
    } else {
      setAfter(result);
      localStorage.setItem("kermouk_bench_after", JSON.stringify(result));
    }
    setRunning(false);
  };

  const reset = () => {
    setBefore(null);
    setAfter(null);
    localStorage.removeItem("kermouk_bench_before");
    localStorage.removeItem("kermouk_bench_after");
  };

  const gains = before && after
    ? METRICS.map(m => {
        const b = before[m.key] as number;
        const a = after[m.key] as number;
        if (b <= 0 || a < 0) return null;
        return m.better === "higher" ? ((a - b) / b) * 100 : ((b - a) / b) * 100;
      })
    : null;

  const avgGain = gains
    ? gains.filter(g => g !== null).reduce((s, g) => s + (g as number), 0) / gains.filter(g => g !== null).length
    : null;

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          BENCHMARK <span className="gradient-text">AVANT/APRÈS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>Mesure l'impact réel de tes optimisations</p>
      </div>

      {/* Steps */}
      <div className="card" style={{ marginBottom: "16px", background: "linear-gradient(135deg, var(--primary-dim) 0%, #111 100%)", border: "1px solid var(--primary-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            {[
              { n: "1", text: "Lance le benchmark AVANT les tweaks", done: !!before },
              { n: "2", text: "Applique tes tweaks dans les autres onglets", done: false },
              { n: "3", text: "Relance le benchmark APRÈS les tweaks", done: !!after },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700,
                  background: step.done ? "rgba(34,197,94,0.15)" : "#0d0d0d",
                  border: step.done ? "1px solid #22c55e" : "1px solid #222",
                  color: step.done ? "#22c55e" : "#444",
                }}>
                  {step.done ? "✓" : step.n}
                </div>
                <span style={{ fontSize: "12px", color: step.done ? "#22c55e" : "#555" }}>{step.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
            <button onClick={run} disabled={running} className="btn-primary" style={{ padding: "10px 18px", whiteSpace: "nowrap" }}>
              {running ? label : !before ? "Benchmark AVANT" : !after ? "Benchmark APRÈS" : "Relancer"}
            </button>
            {(before || after) && !running && (
              <button onClick={reset} style={{ padding: "6px 12px", background: "none", border: "1px solid #1e1e1e", borderRadius: "6px", color: "#444", fontSize: "11px", cursor: "pointer" }}>
                Réinitialiser
              </button>
            )}
          </div>
        </div>
        {running && (
          <div style={{ marginTop: "12px" }}>
            <div className="ram-bar">
              <div className="ram-fill" style={{ width: `${progress}%`, background: "var(--primary)", transition: "width 0.4s" }} />
            </div>
            <div style={{ textAlign: "center", fontSize: "10px", color: "#555", marginTop: "4px" }}>{progress}% — {label}</div>
          </div>
        )}
      </div>

      {/* Results */}
      {before && (
        <div className="card" style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", marginBottom: "14px" }}>
            Résultats
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "8px", paddingBottom: "8px", borderBottom: "1px solid #1a1a1a", marginBottom: "10px" }}>
            {["Métrique", "Avant", "Après", "Gain"].map(h => (
              <div key={h} style={{ fontSize: "9px", color: h === "Avant" ? "#ef4444" : h === "Après" ? (after ? "#22c55e" : "#333") : "#444", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: h !== "Métrique" ? "center" : "left" }}>{h}</div>
            ))}
          </div>
          {METRICS.map((m, i) => {
            const bVal = before[m.key] as number;
            const aVal = after ? after[m.key] as number : null;
            const gain = gains ? gains[i] : null;
            return (
              <div key={m.key} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    <div style={{ height: "3px", flex: 1, background: "#0d0d0d", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, bVal)}%`, background: "#ef4444" }} />
                    </div>
                    <div style={{ height: "3px", flex: 1, background: "#0d0d0d", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, aVal ?? 0)}%`, background: aVal !== null ? "#22c55e" : "#1a1a1a" }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontFamily: "Orbitron, sans-serif", fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>
                  {bVal >= 0 ? `${bVal}${m.unit}` : "N/A"}
                </div>
                <div style={{ textAlign: "center", fontFamily: "Orbitron, sans-serif", fontSize: "12px", color: aVal !== null ? "#22c55e" : "#222", fontWeight: 700 }}>
                  {aVal !== null && aVal >= 0 ? `${aVal}${m.unit}` : "—"}
                </div>
                <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: gain !== null ? (gain > 0 ? "#22c55e" : gain < 0 ? "#ef4444" : "#555") : "#333" }}>
                  {gain !== null ? `${gain > 0 ? "+" : ""}${gain.toFixed(1)}%` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {avgGain !== null && (
        <div className="card" style={{
          background: avgGain > 0 ? "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, #111 100%)" : "linear-gradient(135deg, rgba(239,68,68,0.04) 0%, #111 100%)",
          border: avgGain > 0 ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
          textAlign: "center", padding: "24px",
        }}>
          <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "40px", fontWeight: 900, color: avgGain > 0 ? "#22c55e" : "#ef4444" }}>
            {avgGain > 0 ? "+" : ""}{avgGain.toFixed(1)}%
          </div>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "6px" }}>Gain total estimé de performances</div>
        </div>
      )}
    </div>
  );
}
