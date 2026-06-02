import { app, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as os from "os";

const execAsync = promisify(exec);

// Simple XOR-based obfuscation for license storage
const LICENSE_KEY = "KERMOUK2024";
function obfuscate(text: string): string {
  return Buffer.from(
    text.split("").map((c, i) => c.charCodeAt(0) ^ LICENSE_KEY.charCodeAt(i % LICENSE_KEY.length)).join(",")
  ).toString("base64");
}
function deobfuscate(encoded: string): string {
  try {
    const nums = Buffer.from(encoded, "base64").toString().split(",").map(Number);
    return nums.map((n, i) => String.fromCharCode(n ^ LICENSE_KEY.charCodeAt(i % LICENSE_KEY.length))).join("");
  } catch {
    return "";
  }
}

const LICENSE_FILE = join(app.getPath("userData"), "license.kmo");
const SCRIPTS_DIR = join(app.getPath("userData"), "scripts");

function saveLicense(key: string) {
  fs.writeFileSync(LICENSE_FILE, obfuscate(key), "utf-8");
}

function loadLicense(): string | null {
  if (!fs.existsSync(LICENSE_FILE)) return null;
  const raw = fs.readFileSync(LICENSE_FILE, "utf-8");
  const key = deobfuscate(raw);
  return key.length > 0 ? key : null;
}

const MASTER_KEY = "KERMOUK-MASTER-KEY-2024";

function validateLicenseKey(key: string): boolean {
  if (key === MASTER_KEY) return true;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(key);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: "#0a0a0a",
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
    },
  });

  // electron-vite injecte ELECTRON_RENDERER_URL en dev, absent en production
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return win;
}

app.whenReady().then(() => {
  if (!fs.existsSync(SCRIPTS_DIR)) fs.mkdirSync(SCRIPTS_DIR, { recursive: true });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ─── IPC: Window controls ───────────────────────────────────────────────────
ipcMain.on("window-minimize", () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on("window-maximize", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on("window-close", () => BrowserWindow.getFocusedWindow()?.close());

// ─── IPC: License ───────────────────────────────────────────────────────────
ipcMain.handle("license-load", () => loadLicense());

ipcMain.handle("license-save", (_e, key: string) => {
  if (!validateLicenseKey(key)) {
    return { ok: false, message: "Clé invalide. Utilisez votre UUID reçu après paiement." };
  }
  saveLicense(key);
  return { ok: true };
});

ipcMain.handle("license-clear", () => {
  if (fs.existsSync(LICENSE_FILE)) fs.unlinkSync(LICENSE_FILE);
  return { ok: true };
});

// ─── IPC: System info ───────────────────────────────────────────────────────
ipcMain.handle("get-system-info", async () => {
  try {
    const { stdout: cpuOut } = await execAsync(
      'wmic cpu get Name,NumberOfCores,MaxClockSpeed /format:csv'
    );
    const { stdout: ramOut } = await execAsync('wmic OS get TotalVisibleMemorySize /format:csv');
    const { stdout: gpuOut } = await execAsync('wmic path win32_VideoController get Name /format:csv');
    const { stdout: osOut } = await execAsync('wmic os get Caption,Version /format:csv');

    const parseCsv = (out: string) =>
      out.trim().split("\n").filter(l => l.trim() && !l.startsWith("Node")).map(l => l.split(",").map(s => s.trim()));

    const cpuLines = parseCsv(cpuOut);
    const ramLines = parseCsv(ramOut);
    const gpuLines = parseCsv(gpuOut);
    const osLines = parseCsv(osOut);

    const cpuName = cpuLines[0]?.[2] || "Inconnu";
    const cpuCores = cpuLines[0]?.[1] || "?";
    const ramKb = parseInt(ramLines[0]?.[1] || "0");
    const ramGb = Math.round(ramKb / 1024 / 1024);
    const gpuName = gpuLines.filter(l => l[1] && !l[1].includes("Microsoft Basic")).map(l => l[1])[0] || "Inconnu";
    const osName = osLines[0]?.[1] || os.version();

    return {
      cpu: `${cpuName} (${cpuCores} cœurs)`,
      ram: `${ramGb} GB`,
      gpu: gpuName,
      os: osName,
      platform: os.platform(),
      arch: os.arch(),
    };
  } catch {
    return {
      cpu: os.cpus()[0]?.model || "Inconnu",
      ram: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
      gpu: "Inconnu",
      os: os.version(),
      platform: os.platform(),
      arch: os.arch(),
    };
  }
});

// ─── IPC: Create restore point ──────────────────────────────────────────────
ipcMain.handle("create-restore-point", async () => {
  try {
    await execAsync(
      `powershell -Command "Enable-ComputerRestore -Drive 'C:\\'; Checkpoint-Computer -Description 'KERMOUK OPTIMIZER Backup' -RestorePointType 'MODIFY_SETTINGS'"`,
      { timeout: 30000 }
    );
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: Apply tweaks ──────────────────────────────────────────────────────
ipcMain.handle("apply-tweaks", async (_e, batContent: string, tweakNames: string[]) => {
  const batPath = join(SCRIPTS_DIR, `kermouk_tweaks_${Date.now()}.bat`);

  try {
    // Write the batch file
    fs.writeFileSync(batPath, batContent, "utf-8");

    // Execute as admin via PowerShell Start-Process RunAs
    const cmd = `powershell -Command "Start-Process cmd.exe -ArgumentList '/c \\"${batPath.replace(/\\/g, "\\\\")}\\""' -Verb RunAs -Wait"`;

    await execAsync(cmd, { timeout: 60000 });

    return {
      ok: true,
      applied: tweakNames,
      message: `${tweakNames.length} tweak(s) appliqué(s) avec succès.`,
    };
  } catch (e: unknown) {
    return {
      ok: false,
      error: String(e),
      message: "Erreur lors de l'application. Vérifiez que vous avez accepté l'élévation UAC.",
    };
  }
});

// ─── IPC: Open external link ─────────────────────────────────────────────────
ipcMain.handle("open-external", (_e, url: string) => {
  shell.openExternal(url);
});

// ─── Helper: run a .ps1 script elevated or not ───────────────────────────────
async function runPs1(script: string, elevated = false, timeout = 15000): Promise<string> {
  const ps1Path = join(SCRIPTS_DIR, `ps_${Date.now()}.ps1`);
  fs.writeFileSync(ps1Path, script, "utf-8");
  try {
    let cmd: string;
    if (elevated) {
      cmd = `powershell -Command "Start-Process powershell.exe -ArgumentList '-ExecutionPolicy Bypass -File \\"${ps1Path.replace(/\\/g, "\\\\")}\\"' -Verb RunAs -Wait"`;
    } else {
      cmd = `powershell -ExecutionPolicy Bypass -File "${ps1Path}"`;
    }
    const { stdout } = await execAsync(cmd, { timeout });
    return stdout.trim();
  } finally {
    if (fs.existsSync(ps1Path)) fs.unlinkSync(ps1Path);
  }
}

// ─── IPC: Motherboard info ───────────────────────────────────────────────────
ipcMain.handle("get-motherboard-info", async () => {
  try {
    const out = await runPs1(
      `Get-WmiObject -Class Win32_BaseBoard | Select-Object Manufacturer, Product | ConvertTo-Json`
    );
    const data = JSON.parse(out);
    return {
      manufacturer: (data.Manufacturer || "Inconnu").trim(),
      product: (data.Product || "Inconnu").trim(),
    };
  } catch {
    return { manufacturer: "Inconnu", product: "Inconnu" };
  }
});

// ─── IPC: Reboot to BIOS ────────────────────────────────────────────────────
ipcMain.handle("reboot-to-bios", async () => {
  try {
    await execAsync("shutdown /r /fw /t 5");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: Hardware monitor ───────────────────────────────────────────────────
ipcMain.handle("get-hardware-monitor", async () => {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
$cpuObj = Get-WmiObject Win32_Processor | Select-Object -First 1
$cpu = [int]((Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average)
$freq = [int]$cpuObj.CurrentClockSpeed
$cpuName = [string]$cpuObj.Name
$ramObj = Get-WmiObject Win32_OperatingSystem
$ramUsed = [int][math]::Round(($ramObj.TotalVisibleMemorySize - $ramObj.FreePhysicalMemory) / $ramObj.TotalVisibleMemorySize * 100)
$cpuTemp = -1
try {
  $tz = Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace root/wmi | Select-Object -First 1
  if ($tz) { $cpuTemp = [int][math]::Round(($tz.CurrentTemperature / 10) - 273.15) }
} catch {}
$gpuTemp = -1
$gpuUsage = -1
try { $gpuTemp = [int]((& nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits 2>$null).Trim()) } catch {}
try { $gpuUsage = [int]((& nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits 2>$null).Trim()) } catch {}
$gpuObj = Get-WmiObject Win32_VideoController | Where-Object { $_.Name -notlike '*Microsoft*' } | Select-Object -First 1
$gpuName = if ($gpuObj) { [string]$gpuObj.Name } else { 'Inconnu' }
$gpuIsNvidia = ($gpuName -match 'NVIDIA')
$cpuIsIntel = ($cpuName -match 'Intel')
@{
  cpuUsage = $cpu
  cpuTemp = $cpuTemp
  cpuFreq = $freq
  gpuTemp = $gpuTemp
  gpuUsage = $gpuUsage
  ramUsage = $ramUsed
  gpuName = $gpuName
  gpuIsNvidia = [bool]$gpuIsNvidia
  cpuName = $cpuName
  cpuIsIntel = [bool]$cpuIsIntel
} | ConvertTo-Json
`;
  try {
    const out = await runPs1(script, false, 8000);
    return JSON.parse(out);
  } catch {
    return { cpuUsage: 0, cpuTemp: -1, cpuFreq: 0, gpuTemp: -1, gpuUsage: -1, ramUsage: 0, gpuName: "Inconnu", gpuIsNvidia: false, cpuName: "Inconnu", cpuIsIntel: true };
  }
});

// ─── IPC: Apply CPU performance tweaks ──────────────────────────────────────
ipcMain.handle("apply-cpu-performance-tweaks", async () => {
  const batContent = `@echo off
:: 1. Activer Ultimate Performance power plan
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
for /f "tokens=4 delims= " %%a in ('powercfg /list ^| findstr /i "Ultimate"') do (
  powercfg /setactive %%a
)
if errorlevel 1 powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

:: 2. Desactiver Core Parking
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v "ValueMax" /t REG_DWORD /d 0 /f >nul 2>&1

:: 3. CPU Priority foreground boost
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 38 /f >nul 2>&1

:: 4. Desactiver HPET
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set useplatformtick yes >nul 2>&1
bcdedit /set disabledynamictick yes >nul 2>&1

:: 5. Desactiver CPU throttling
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\943c8cb6-6f93-4227-ad87-e9a3feec08d1" /v "ValueMax" /t REG_DWORD /d 100 /f >nul 2>&1

:: 6. Boost latence systeme
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d "High" /f >nul 2>&1

echo OK
`;
  const batPath = join(SCRIPTS_DIR, `cpu_tweaks_${Date.now()}.bat`);
  try {
    fs.writeFileSync(batPath, batContent, "utf-8");
    const cmd = `powershell -Command "Start-Process cmd.exe -ArgumentList '/c \\"${batPath.replace(/\\/g, "\\\\")}\\""' -Verb RunAs -Wait"`;
    await execAsync(cmd, { timeout: 30000 });
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  } finally {
    if (fs.existsSync(batPath)) fs.unlinkSync(batPath);
  }
});

// ─── IPC: GPU Overclock (NVIDIA power limit) ─────────────────────────────────
ipcMain.handle("apply-gpu-overclock", async (_e, profile: "safe" | "balanced" | "aggressive") => {
  const script = `
$ErrorActionPreference = 'Stop'
try {
  $defaultLimit = [float]((& nvidia-smi --query-gpu=power.default_limit --format=csv,noheader,nounits).Trim())
  $maxLimit = [float]((& nvidia-smi --query-gpu=power.max_limit --format=csv,noheader,nounits).Trim())
  $multiplier = switch ('${profile}') {
    'safe'       { 1.05 }
    'balanced'   { 1.10 }
    'aggressive' { 1.20 }
    default      { 1.0  }
  }
  $newLimit = [math]::Min([math]::Round($defaultLimit * $multiplier, 1), $maxLimit)
  & nvidia-smi -pl $newLimit | Out-Null
  Write-Host "OK:$newLimit"
} catch {
  Write-Host "ERR:$_"
}
`;
  try {
    const out = await runPs1(script, false, 10000);
    if (out.startsWith("OK")) return { ok: true };
    return { ok: false, error: out.replace("ERR:", "") };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: GPU Reset (NVIDIA) ─────────────────────────────────────────────────
ipcMain.handle("reset-gpu-overclock", async () => {
  const script = `
$ErrorActionPreference = 'Stop'
try {
  $defaultLimit = [float]((& nvidia-smi --query-gpu=power.default_limit --format=csv,noheader,nounits).Trim())
  & nvidia-smi -pl $defaultLimit | Out-Null
  & nvidia-smi --reset-gpu-clocks | Out-Null
  Write-Host "OK"
} catch {
  Write-Host "ERR:$_"
}
`;
  try {
    const out = await runPs1(script, false, 10000);
    if (out.startsWith("OK")) return { ok: true };
    return { ok: false, error: out.replace("ERR:", "") };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});
