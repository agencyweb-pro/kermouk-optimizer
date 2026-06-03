import { useState, useEffect } from "react";
import type { Theme } from "../App";

interface AboutProps {
  isPremium: boolean;
  licenseKey: string | null;
  onLicenseRemoved: () => void;
  openLicenseModal: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "orange", label: "Orange", color: "#FF6B00" },
  { id: "blue",   label: "Bleu",   color: "#3B82F6" },
  { id: "red",    label: "Rouge",  color: "#EF4444" },
  { id: "green",  label: "Vert",   color: "#22c55e" },
];

interface DriverInfo {
  gpu: string;
  gpuVersion: string;
  isNvidia: boolean;
  isAmd: boolean;
}

export default function About({ isPremium, licenseKey, onLicenseRemoved, openLicenseModal, theme, onThemeChange }: AboutProps) {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem("kermouk_notif") !== "0");

  useEffect(() => {
    window.kermouk?.getDriverInfo?.().then(d => setDriverInfo(d as DriverInfo)).catch(() => {});
  }, []);

  const toggleNotif = async () => {
    const val = !notifEnabled;
    setNotifEnabled(val);
    localStorage.setItem("kermouk_notif", val ? "1" : "0");
    await window.kermouk?.setNotificationsEnabled?.(val);
  };

  const handleRemoveLicense = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre licence ? Tous les tweaks Premium seront verrouillés.");
    if (!confirmed) return;
    await window.kermouk.clearLicense();
    onLicenseRemoved();
  };

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "18px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          À <span className="gradient-text">PROPOS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Informations sur KERMOUK OPTIMIZER et votre licence
        </p>
      </div>

      {/* App info */}
      <div className="card" style={{ marginBottom: "12px", textAlign: "center", padding: "28px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            background: "var(--primary-dim)",
            border: "1px solid var(--primary-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--primary)" />
          </svg>
        </div>
        <div style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "0.1em", marginBottom: "4px" }}>
          KERMOUK <span style={{ color: "var(--primary)" }}>OPTIMIZER</span>
        </div>
        <div style={{ fontSize: "12px", color: "#444", marginBottom: "16px" }}>
          Version 2.3.0 — Gaming Optimizer pour Fortnite
        </div>
        <div style={{ fontSize: "11px", color: "#333", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
          KERMOUK OPTIMIZER applique des tweaks Windows testés et validés pour maximiser les FPS,
          réduire la latence réseau et optimiser l&apos;expérience Fortnite.
        </div>
      </div>

      {/* Theme selector */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Thème couleur
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              style={{
                padding: "10px 8px",
                borderRadius: "8px",
                border: theme === t.id ? `2px solid ${t.color}` : "1px solid #1a1a1a",
                background: theme === t.id ? `rgba(${hexToRgb(t.color)}, 0.12)` : "#0d0d0d",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: t.color }} />
              <span style={{ fontSize: "10px", color: theme === t.id ? t.color : "#666", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* License info */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Licence & Abonnement
        </div>

        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            background: isPremium ? "rgba(34,197,94,0.06)" : "var(--primary-dim)",
            border: isPremium ? "1px solid rgba(34,197,94,0.2)" : "1px solid var(--primary-border)",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isPremium ? "#22c55e" : "var(--primary)" }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", color: isPremium ? "#22c55e" : "var(--primary)" }}>
              {isPremium ? "LICENCE PREMIUM ACTIVE" : "VERSION GRATUITE"}
            </span>
          </div>

          {isPremium && licenseKey && (
            <div>
              <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Clé de licence (masquée)
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#555", background: "#0a0a0a", padding: "8px", borderRadius: "6px" }}>
                {licenseKey.substring(0, 8)}••••-••••-••••-••••-{licenseKey.slice(-12)}
              </div>
            </div>
          )}

          {!isPremium && (
            <div style={{ fontSize: "11px", color: "#555" }}>
              Passez Premium pour accéder à tous les tweaks avancés.
            </div>
          )}
        </div>

        {isPremium ? (
          <button
            onClick={handleRemoveLicense}
            className="btn-secondary"
            style={{ width: "100%", fontSize: "11px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
          >
            Supprimer la licence
          </button>
        ) : (
          <button onClick={openLicenseModal} className="btn-primary" style={{ width: "100%" }}>
            Entrer ma clé de licence
          </button>
        )}
      </div>

      {/* Drivers section */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Drivers
        </div>
        {driverInfo ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>{driverInfo.gpu}</div>
                <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>Driver v{driverInfo.gpuVersion}</div>
              </div>
              <div style={{ fontSize: "10px", color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", padding: "3px 8px", borderRadius: "4px" }}>
                À jour ✓
              </div>
            </div>
            {driverInfo.isNvidia && (
              <button onClick={() => window.kermouk.openExternal("https://www.nvidia.com/fr-fr/drivers/")} style={{ padding: "8px 12px", background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", color: "#555", fontSize: "11px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                Télécharger drivers NVIDIA
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </button>
            )}
            {driverInfo.isAmd && (
              <button onClick={() => window.kermouk.openExternal("https://www.amd.com/fr/support")} style={{ padding: "8px 12px", background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", color: "#555", fontSize: "11px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                Télécharger drivers AMD
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </button>
            )}
          </div>
        ) : (
          <div style={{ fontSize: "11px", color: "#333" }}>Détection en cours...</div>
        )}
      </div>

      {/* Notifications settings */}
      <div className="card" style={{ marginBottom: "12px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Notifications
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#ccc", marginBottom: "2px" }}>Alertes système intelligentes</div>
            <div style={{ fontSize: "10px", color: "#444" }}>RAM, CPU temp, ping, disque — toutes les 30s</div>
          </div>
          <div onClick={toggleNotif} style={{ width: "40px", height: "22px", borderRadius: "11px", background: notifEnabled ? "var(--primary)" : "#1e1e1e", border: "1px solid " + (notifEnabled ? "var(--primary)" : "#333"), cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: notifEnabled ? "20px" : "2px", transition: "left 0.2s" }} />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="card">
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", marginBottom: "14px" }}>
          Liens utiles
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Site officiel", url: "https://kermouk-optimizer.com" },
            { label: "Acheter une licence Premium", url: "https://kermouk-optimizer.com/payment" },
          ].map((link) => (
            <button
              key={link.url}
              onClick={() => window.kermouk.openExternal(link.url)}
              style={{
                background: "transparent",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#666",
                fontSize: "12px",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "#2a2a2a" }}>
        © 2024 KERMOUK OPTIMIZER — Non affilié à Epic Games ou Fortnite™
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255, 107, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
