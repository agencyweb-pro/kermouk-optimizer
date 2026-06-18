import { useState } from "react";
import TweakSection from "../components/TweakSection";
import Cleaner from "./Cleaner";
import { PREMIUM_TWEAKS } from "../utils/tweakEngine";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type Tab = "cleaner" | "services" | "autoruns" | "uninstall";

const TABS: { id: Tab; label: string }[] = [
  { id: "cleaner", label: "System Cleaner" },
  { id: "services", label: "Services" },
  { id: "autoruns", label: "Autoruns" },
  { id: "uninstall", label: "Uninstall" },
];

// ── Services: désactivation des services Windows inutiles ─────────────────────
const SERVICES_TWEAKS = [
  PREMIUM_TWEAKS.find(t => t.id === "disable-superfetch")!,
  PREMIUM_TWEAKS.find(t => t.id === "disable-tracking")!,
  PREMIUM_TWEAKS.find(t => t.id === "disable-xbox-services")!,
  PREMIUM_TWEAKS.find(t => t.id === "disable-other-services")!,
].filter(Boolean);

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
      <div style={{ fontSize: "12px", color: "#333" }}>{label} — à venir dans une prochaine mise à jour</div>
    </div>
  );
}

export default function DebloatPage({ isPremium, openLicenseModal }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("cleaner");

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          DEBLOAT <span className="gradient-text">WINDOWS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Nettoyage, services inutiles, démarrages et désinstallation
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

      {activeTab === "cleaner" && (
        <Cleaner isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}

      {activeTab === "services" && (
        <TweakSection
          title="SERVICES"
          subtitle="SysMain, DiagTrack, Xbox Services et services inutiles — arrêt et désactivation"
          tweaks={SERVICES_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "autoruns" && (
        <EmptyTab label="Gestion des programmes au démarrage" />
      )}

      {activeTab === "uninstall" && (
        <EmptyTab label="Désinstallation des applications Windows inutiles" />
      )}
    </div>
  );
}
