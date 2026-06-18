import { useState } from "react";
import TweakSection from "../components/TweakSection";
import FortniteTweaks from "./FortniteTweaks";
import { FREE_TWEAKS, PREMIUM_TWEAKS } from "../utils/tweakEngine";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type Tab = "core" | "privacy" | "qol" | "apps" | "powerplan";

const TABS: { id: Tab; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "privacy", label: "Privacy" },
  { id: "qol", label: "QOL" },
  { id: "apps", label: "Apps" },
  { id: "powerplan", label: "Powerplan" },
];

// ── Core: optimisations Windows fondamentales ─────────────────────────────────
const CORE_TWEAKS = [
  FREE_TWEAKS.find(t => t.id === "disable-gamebar")!,
  FREE_TWEAKS.find(t => t.id === "disable-gamedvr")!,
  FREE_TWEAKS.find(t => t.id === "timer-resolution")!,
  FREE_TWEAKS.find(t => t.id === "disable-hyperv")!,
  FREE_TWEAKS.find(t => t.id === "mmcss-audio")!,
  PREMIUM_TWEAKS.find(t => t.id === "mmcss-latency-sensitive")!,
].filter(Boolean);

// ── Privacy: confidentialité et télémétrie ────────────────────────────────────
const PRIVACY_TWEAKS = [
  FREE_TWEAKS.find(t => t.id === "disable-notifications")!,
].filter(Boolean);

// ── QOL: qualité de vie et confort ───────────────────────────────────────────
const QOL_TWEAKS = [
  FREE_TWEAKS.find(t => t.id === "clean-temp")!,
  FREE_TWEAKS.find(t => t.id === "disable-defender-rt")!,
  PREMIUM_TWEAKS.find(t => t.id === "energy-estimation-disable")!,
].filter(Boolean);

// ── Powerplan: plan d'alimentation ────────────────────────────────────────────
const POWERPLAN_TWEAKS = [
  FREE_TWEAKS.find(t => t.id === "high-performance")!,
  PREMIUM_TWEAKS.find(t => t.id === "disable-power-throttling")!,
].filter(Boolean);

export default function GeneralPage({ isPremium, openLicenseModal }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("core");

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          GÉNÉRAL <span className="gradient-text">WINDOWS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Optimisations système Windows — Core, Privacy, QOL, Apps & Powerplan
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "16px", borderBottom: "1px solid #1a1a1a" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--primary)" : "#555",
              fontSize: "11px",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              marginBottom: "-1px",
              transition: "color 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "core" && (
        <TweakSection
          title="CORE"
          subtitle="Désactivation Game Bar, DVR, Hyper-V, Timer Resolution et MMCSS"
          tweaks={CORE_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "privacy" && (
        <TweakSection
          title="PRIVACY"
          subtitle="Confidentialité et réduction de la télémétrie Windows"
          tweaks={PRIVACY_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "qol" && (
        <TweakSection
          title="QUALITÉ DE VIE"
          subtitle="Nettoyage, Defender et gestion énergie pour le quotidien gaming"
          tweaks={QOL_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "apps" && (
        <FortniteTweaks isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}

      {activeTab === "powerplan" && (
        <TweakSection
          title="POWERPLAN"
          subtitle="Plan d'alimentation et gestion du throttling CPU"
          tweaks={POWERPLAN_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}
    </div>
  );
}
