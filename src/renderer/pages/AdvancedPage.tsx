import { useState } from "react";
import FortniteAdvanced from "./FortniteAdvanced";
import BiosTweaks from "./BiosTweaks";
import OverclockTweaks from "./OverclockTweaks";
import GpoTweaks from "./GpoTweaks";
import InputLagCalculator from "./InputLagCalculator";
import Benchmark from "./Benchmark";
import GameProfiles from "./GameProfiles";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type Tab = "fortnite-advanced" | "bios" | "overclock" | "gpo" | "inputlag" | "benchmark" | "gameprofiles";

const TABS: { id: Tab; label: string; premiumRequired?: boolean }[] = [
  { id: "fortnite-advanced", label: "Fortnite Avancé", premiumRequired: true },
  { id: "bios", label: "Guide BIOS", premiumRequired: true },
  { id: "overclock", label: "Overclocking", premiumRequired: true },
  { id: "gpo", label: "GPO & Système", premiumRequired: true },
  { id: "inputlag", label: "Input Lag Calc" },
  { id: "benchmark", label: "Benchmark", premiumRequired: true },
  { id: "gameprofiles", label: "Profils Jeux", premiumRequired: true },
];

export default function AdvancedPage({ isPremium, openLicenseModal }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("fortnite-advanced");

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          OUTILS <span className="gradient-text">AVANCÉS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Fortnite avancé, BIOS, Overclocking, GPO, Benchmark et profils
        </p>
      </div>

      {/* Tabs — scrollable horizontalement si besoin */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "16px", borderBottom: "1px solid #1a1a1a", overflowX: "auto" }}>
        {TABS.map(tab => {
          const locked = tab.premiumRequired && !isPremium;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--primary)" : locked ? "#333" : "#555",
                fontSize: "11px",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {tab.label}
              {locked && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "5px", verticalAlign: "middle", color: "#333" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "fortnite-advanced" && (
        <FortniteAdvanced isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "bios" && (
        <BiosTweaks isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "overclock" && (
        <OverclockTweaks isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "gpo" && (
        <GpoTweaks isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "inputlag" && (
        <InputLagCalculator isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "benchmark" && (
        <Benchmark isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
      {activeTab === "gameprofiles" && (
        <GameProfiles isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}
    </div>
  );
}
