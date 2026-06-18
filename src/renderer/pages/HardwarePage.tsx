import { useState } from "react";
import TweakSection from "../components/TweakSection";
import GpuTweaks from "./GpuTweaks";
import { FREE_TWEAKS, PREMIUM_TWEAKS } from "../utils/tweakEngine";

interface Props {
  isPremium: boolean;
  openLicenseModal: () => void;
}

type Tab = "gpu" | "cpu" | "ram" | "peripherals" | "storage";

const TABS: { id: Tab; label: string }[] = [
  { id: "gpu", label: "GPU" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "RAM" },
  { id: "peripherals", label: "Peripherals" },
  { id: "storage", label: "Storage" },
];

// ── CPU: priorité, scheduling, core parking ───────────────────────────────────
const CPU_TWEAKS = [
  PREMIUM_TWEAKS.find(t => t.id === "cpu-priority")!,
  PREMIUM_TWEAKS.find(t => t.id === "win32-priority-separation")!,
  PREMIUM_TWEAKS.find(t => t.id === "bcdedit-dynamictick")!,
  PREMIUM_TWEAKS.find(t => t.id === "core-parking-disable")!,
].filter(Boolean);

// ── RAM: mémoire et pagination ────────────────────────────────────────────────
const RAM_TWEAKS = [
  PREMIUM_TWEAKS.find(t => t.id === "memory-usage")!,
  PREMIUM_TWEAKS.find(t => t.id === "svhost-split-32gb")!,
  PREMIUM_TWEAKS.find(t => t.id === "disable-memory-compression")!,
].filter(Boolean);

// ── Peripherals: clavier, souris, USB ─────────────────────────────────────────
const PERIPHERALS_TWEAKS = [
  PREMIUM_TWEAKS.find(t => t.id === "keyboard-mouse-queue")!,
  PREMIUM_TWEAKS.find(t => t.id === "usb-power-save-disable")!,
].filter(Boolean);

// ── Storage: SSD/NVMe et NTFS ─────────────────────────────────────────────────
const STORAGE_TWEAKS = [
  FREE_TWEAKS.find(t => t.id === "ssd-nvme-optimization")!,
  PREMIUM_TWEAKS.find(t => t.id === "mft-zone")!,
].filter(Boolean);

export default function HardwarePage({ isPremium, openLicenseModal }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("gpu");

  return (
    <div>
      <div className="section-header">
        <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "20px", fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>
          HARDWARE <span className="gradient-text">TWEAKS</span>
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
          Optimisations matérielles — GPU, CPU, RAM, Périphériques & Stockage
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

      {activeTab === "gpu" && (
        <GpuTweaks isPremium={isPremium} openLicenseModal={openLicenseModal} />
      )}

      {activeTab === "cpu" && (
        <TweakSection
          title="CPU"
          subtitle="Priorité processus, Win32PrioritySeparation, BCDEdit et Core Parking"
          tweaks={CPU_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "ram" && (
        <TweakSection
          title="RAM"
          subtitle="Optimisation mémoire fsutil, SvcHostSplit et compression mémoire"
          tweaks={RAM_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "peripherals" && (
        <TweakSection
          title="PÉRIPHÉRIQUES"
          subtitle="Buffers clavier/souris et désactivation veille USB"
          tweaks={PERIPHERALS_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}

      {activeTab === "storage" && (
        <TweakSection
          title="STOCKAGE"
          subtitle="SSD/NVMe et zone MFT NTFS — réduction des temps d'accès"
          tweaks={STORAGE_TWEAKS}
          isPremium={isPremium}
          openLicenseModal={openLicenseModal}
        />
      )}
    </div>
  );
}
