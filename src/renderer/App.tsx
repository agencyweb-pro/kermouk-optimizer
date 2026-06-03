import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import LicenseModal from "./components/LicenseModal";
import SplashScreen from "./components/SplashScreen";
import StatusBar from "./components/StatusBar";
import Dashboard from "./pages/Dashboard";
import NetworkTweaks from "./pages/NetworkTweaks";
import SystemTweaks from "./pages/SystemTweaks";
import GpuTweaks from "./pages/GpuTweaks";
import FortniteTweaks from "./pages/FortniteTweaks";
import FortniteAdvanced from "./pages/FortniteAdvanced";
import BiosTweaks from "./pages/BiosTweaks";
import OverclockTweaks from "./pages/OverclockTweaks";
import About from "./pages/About";
import InputLagCalculator from "./pages/InputLagCalculator";
import Benchmark from "./pages/Benchmark";
import GameProfiles from "./pages/GameProfiles";
import Cleaner from "./pages/Cleaner";

export type Page =
  | "dashboard"
  | "network"
  | "system"
  | "gpu"
  | "fortnite"
  | "fortnite-advanced"
  | "bios"
  | "overclock"
  | "inputlag"
  | "benchmark"
  | "gameprofiles"
  | "cleaner"
  | "about";

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
      pingServer: (host: string) => Promise<{ ok: boolean; ms: number }>;
      applyFortniteIni: () => Promise<{ ok: boolean; error?: string }>;
      cleanFortniteCache: () => Promise<{ ok: boolean; deletedCount?: number; error?: string }>;
      scanJunk: () => Promise<Record<string, number>>;
      cleanJunk: (id: string) => Promise<{ ok: boolean; error?: string }>;
      runBenchmark: () => Promise<{ cpuScore: number; ramScore: number }>;
      getDriverInfo: () => Promise<{ gpu: string; gpuVersion: string; isNvidia: boolean; isAmd: boolean }>;
      applyStreamingMode: () => Promise<{ ok: boolean; error?: string }>;
      setNotificationsEnabled: (enabled: boolean) => Promise<void>;
      checkForUpdates: () => Promise<void>;
      installUpdate: () => Promise<void>;
      onUpdateStatus: (cb: (payload: Record<string, unknown>) => void) => () => void;
    };
  }
}

export type Theme = "orange" | "blue" | "red" | "green";

const THEME_COLORS: Record<Theme, string> = {
  orange: "#FF6B00",
  blue:   "#3B82F6",
  red:    "#EF4444",
  green:  "#22c55e",
};

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme === "orange" ? "" : theme);
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [theme, setTheme] = useState<Theme>("orange");
  const [appliedTweaksCount, setAppliedTweaksCount] = useState(0);

  const [state, setState] = useState<AppState>({
    isPremium: false,
    licenseKey: null,
    currentPage: "dashboard",
    showLicenseModal: false,
  });

  // Load license and preferences on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("kermouk_theme") as Theme) || "orange";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const count = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
    setAppliedTweaksCount(count);

    window.kermouk?.loadLicense().then((key) => {
      if (key) setState((s) => ({ ...s, isPremium: true, licenseKey: key }));
    });

    // Show splash for 2 seconds then fade out
    const fadeTimer = setTimeout(() => setSplashFading(true), 1800);
    const hideTimer = setTimeout(() => setShowSplash(false), 2250);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  // Refresh applied tweaks count on page change
  useEffect(() => {
    const count = parseInt(localStorage.getItem("kermouk_tweaks_count") || "0");
    setAppliedTweaksCount(count);
  }, [state.currentPage]);

  const changeTheme = useCallback((t: Theme) => {
    setTheme(t);
    applyTheme(t);
    localStorage.setItem("kermouk_theme", t);
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
    const key = state.currentPage;
    let content: React.ReactNode;
    switch (key) {
      case "dashboard":          content = <Dashboard {...pageProps} />; break;
      case "network":            content = <NetworkTweaks {...pageProps} />; break;
      case "system":             content = <SystemTweaks {...pageProps} />; break;
      case "gpu":                content = <GpuTweaks {...pageProps} />; break;
      case "fortnite":           content = <FortniteTweaks {...pageProps} />; break;
      case "fortnite-advanced":  content = <FortniteAdvanced {...pageProps} />; break;
      case "bios":               content = <BiosTweaks {...pageProps} />; break;
      case "overclock":          content = <OverclockTweaks {...pageProps} />; break;
      case "inputlag":           content = <InputLagCalculator {...pageProps} />; break;
      case "benchmark":          content = <Benchmark {...pageProps} />; break;
      case "gameprofiles":       content = <GameProfiles {...pageProps} />; break;
      case "cleaner":            content = <Cleaner {...pageProps} />; break;
      case "about":
        content = (
          <About
            isPremium={state.isPremium}
            licenseKey={state.licenseKey}
            onLicenseRemoved={onLicenseRemoved}
            openLicenseModal={openLicenseModal}
            theme={theme}
            onThemeChange={changeTheme}
          />
        );
        break;
      default: content = <Dashboard {...pageProps} />;
    }
    return (
      <div key={key} className="page-transition" style={{ height: "100%" }}>
        {content}
      </div>
    );
  };

  return (
    <>
      {showSplash && <SplashScreen fading={splashFading} />}

      <div className="app-layout">
        <TitleBar />
        <Sidebar
          currentPage={state.currentPage}
          isPremium={state.isPremium}
          onNavigate={navigate}
          onUnlockPremium={openLicenseModal}
        />
        <div className="content">{renderPage()}</div>
        <StatusBar isPremium={state.isPremium} appliedTweaksCount={appliedTweaksCount} />

        {state.showLicenseModal && (
          <LicenseModal onClose={closeLicenseModal} onSuccess={onLicenseActivated} />
        )}
      </div>
    </>
  );
}
