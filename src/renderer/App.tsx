import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import LicenseModal from "./components/LicenseModal";
import Dashboard from "./pages/Dashboard";
import NetworkTweaks from "./pages/NetworkTweaks";
import SystemTweaks from "./pages/SystemTweaks";
import GpuTweaks from "./pages/GpuTweaks";
import FortniteTweaks from "./pages/FortniteTweaks";
import BiosTweaks from "./pages/BiosTweaks";
import OverclockTweaks from "./pages/OverclockTweaks";
import About from "./pages/About";

export type Page = "dashboard" | "network" | "system" | "gpu" | "fortnite" | "bios" | "overclock" | "about";

export interface AppState {
  isPremium: boolean;
  licenseKey: string | null;
  currentPage: Page;
  showLicenseModal: boolean;
}

declare global {
  interface Window {
    kermouk: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      loadLicense: () => Promise<string | null>;
      saveLicense: (key: string) => Promise<{ ok: boolean; message?: string }>;
      clearLicense: () => Promise<{ ok: boolean }>;
      getSystemInfo: () => Promise<Record<string, string>>;
      applyTweaks: (bat: string, names: string[]) => Promise<{ ok: boolean; applied?: string[]; message?: string; error?: string }>;
      createRestorePoint: () => Promise<{ ok: boolean; error?: string }>;
      openExternal: (url: string) => Promise<void>;
      getMotherboardInfo: () => Promise<{ manufacturer: string; product: string }>;
      rebootToBios: () => Promise<{ ok: boolean; error?: string }>;
      getHardwareMonitor: () => Promise<Record<string, unknown>>;
      applyCpuTweaks: () => Promise<{ ok: boolean; error?: string }>;
      applyGpuOverclock: (profile: string) => Promise<{ ok: boolean; error?: string }>;
      resetGpuOverclock: () => Promise<{ ok: boolean; error?: string }>;
    };
  }
}

export default function App() {
  const [state, setState] = useState<AppState>({
    isPremium: false,
    licenseKey: null,
    currentPage: "dashboard",
    showLicenseModal: false,
  });

  useEffect(() => {
    window.kermouk?.loadLicense().then((key) => {
      if (key) {
        setState((s) => ({ ...s, isPremium: true, licenseKey: key }));
      }
    });
  }, []);

  const navigate = useCallback((page: Page) => {
    setState((s) => ({ ...s, currentPage: page }));
  }, []);

  const openLicenseModal = useCallback(() => {
    setState((s) => ({ ...s, showLicenseModal: true }));
  }, []);

  const closeLicenseModal = useCallback(() => {
    setState((s) => ({ ...s, showLicenseModal: false }));
  }, []);

  const onLicenseActivated = useCallback((key: string) => {
    setState((s) => ({ ...s, isPremium: true, licenseKey: key, showLicenseModal: false }));
  }, []);

  const onLicenseRemoved = useCallback(() => {
    setState((s) => ({ ...s, isPremium: false, licenseKey: null }));
  }, []);

  const pageProps = { isPremium: state.isPremium, openLicenseModal };

  const renderPage = () => {
    switch (state.currentPage) {
      case "dashboard": return <Dashboard {...pageProps} />;
      case "network": return <NetworkTweaks {...pageProps} />;
      case "system": return <SystemTweaks {...pageProps} />;
      case "gpu": return <GpuTweaks {...pageProps} />;
      case "fortnite": return <FortniteTweaks {...pageProps} />;
      case "bios": return <BiosTweaks {...pageProps} />;
      case "overclock": return <OverclockTweaks {...pageProps} />;
      case "about": return <About isPremium={state.isPremium} licenseKey={state.licenseKey} onLicenseRemoved={onLicenseRemoved} openLicenseModal={openLicenseModal} />;
      default: return <Dashboard {...pageProps} />;
    }
  };

  return (
    <div className="app-layout">
      <TitleBar />
      <Sidebar
        currentPage={state.currentPage}
        isPremium={state.isPremium}
        onNavigate={navigate}
        onUnlockPremium={openLicenseModal}
      />
      <div className="content">{renderPage()}</div>

      {state.showLicenseModal && (
        <LicenseModal onClose={closeLicenseModal} onSuccess={onLicenseActivated} />
      )}
    </div>
  );
}
