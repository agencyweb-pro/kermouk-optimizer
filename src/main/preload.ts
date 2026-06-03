import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("kermouk", {
  // Window controls
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),

  // License
  loadLicense: () => ipcRenderer.invoke("license-load"),
  saveLicense: (key: string) => ipcRenderer.invoke("license-save", key),
  clearLicense: () => ipcRenderer.invoke("license-clear"),

  // System
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),

  // Tweaks
  applyTweaks: (batContent: string, tweakNames: string[]) =>
    ipcRenderer.invoke("apply-tweaks", batContent, tweakNames),
  createRestorePoint: () => ipcRenderer.invoke("create-restore-point"),

  // Utils
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),

  // BIOS
  getMotherboardInfo: () => ipcRenderer.invoke("get-motherboard-info"),
  rebootToBios: () => ipcRenderer.invoke("reboot-to-bios"),

  // Overclock / Monitor
  getHardwareMonitor: () => ipcRenderer.invoke("get-hardware-monitor"),
  applyCpuTweaks: () => ipcRenderer.invoke("apply-cpu-performance-tweaks"),
  applyGpuOverclock: (profile: string) => ipcRenderer.invoke("apply-gpu-overclock", profile),
  resetGpuOverclock: () => ipcRenderer.invoke("reset-gpu-overclock"),

  // Network ping
  pingServer: (host: string) => ipcRenderer.invoke("ping-server", host),

  // Fortnite advanced
  applyFortniteIni: () => ipcRenderer.invoke("apply-fortnite-ini"),
  cleanFortniteCache: () => ipcRenderer.invoke("clean-fortnite-cache"),

  // Cleaner
  scanJunk: () => ipcRenderer.invoke("scan-junk"),
  cleanJunk: (id: string) => ipcRenderer.invoke("clean-junk", id),

  // Driver info
  getDriverInfo: () => ipcRenderer.invoke("get-driver-info"),

  // Streaming mode
  applyStreamingMode: () => ipcRenderer.invoke("apply-streaming-mode"),

  // Notifications
  setNotificationsEnabled: (enabled: boolean) => ipcRenderer.invoke("set-notifications-enabled", enabled),

  // Auto-updater
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
  onUpdateStatus: (cb: (payload: Record<string, unknown>) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: Record<string, unknown>) => cb(payload);
    ipcRenderer.on("update-status", handler);
    return () => ipcRenderer.removeListener("update-status", handler);
  },
});
