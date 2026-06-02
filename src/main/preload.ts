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
});
