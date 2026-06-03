import { app, BrowserWindow, ipcMain, shell, Notification } from "electron";
import { autoUpdater } from "electron-updater";
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

  const win = createWindow();
  startMonitoring(win);
  initAutoUpdater(win);

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
$ramTotalGb = [math]::Round($ramObj.TotalVisibleMemorySize / 1048576, 1)
$ramUsedGb  = [math]::Round(($ramObj.TotalVisibleMemorySize - $ramObj.FreePhysicalMemory) / 1048576, 1)
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
  cpuUsage   = $cpu
  cpuTemp    = $cpuTemp
  cpuFreq    = $freq
  gpuTemp    = $gpuTemp
  gpuUsage   = $gpuUsage
  ramUsage   = $ramUsed
  ramTotalGb = $ramTotalGb
  ramUsedGb  = $ramUsedGb
  gpuName    = $gpuName
  gpuIsNvidia = [bool]$gpuIsNvidia
  cpuName    = $cpuName
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

// ─── IPC: Ping server ───────────────────────────────────────────────────────
ipcMain.handle("ping-server", async (_e, host: string) => {
  try {
    const { stdout } = await execAsync(`ping -n 2 -w 2000 ${host}`, { timeout: 8000 });
    const match = stdout.match(/[Tt]emps[=<](\d+)\s*ms|[Tt]ime[=<](\d+)\s*ms/);
    const ms = match ? parseInt(match[1] || match[2] || "-1") : -1;
    return { ok: ms >= 0, ms };
  } catch {
    return { ok: false, ms: -1 };
  }
});

// ─── IPC: Apply Fortnite GameUserSettings.ini ────────────────────────────────
ipcMain.handle("apply-fortnite-ini", async () => {
  try {
    const localApp = process.env.LOCALAPPDATA || join(os.homedir(), "AppData", "Local");
    const iniPath = join(localApp, "FortniteGame", "Saved", "Config", "WindowsClient", "GameUserSettings.ini");

    if (!fs.existsSync(iniPath)) {
      return { ok: false, error: "Fichier GameUserSettings.ini introuvable. Lancez Fortnite au moins une fois." };
    }

    let content = fs.readFileSync(iniPath, "utf-8");

    const settings: Record<string, string> = {
      bShowFPS: "True",
      FrameRateLimit: "0.000000",
      ResolutionSizeX: "1920",
      ResolutionSizeY: "1080",
      FullscreenMode: "1",
      "sg.ShadowQuality": "0",
      "sg.GlobalIlluminationQuality": "0",
      "sg.ReflectionQuality": "0",
      "sg.AntiAliasingQuality": "0",
      "sg.TextureQuality": "2",
      "sg.EffectsQuality": "0",
      "sg.PostProcessQuality": "0",
      bUseVSync: "False",
    };

    for (const [key, value] of Object.entries(settings)) {
      const escapedKey = key.replace(/\./g, "\\.");
      const regex = new RegExp(`^${escapedKey}=.*$`, "gm");
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${value}`);
      } else {
        content += `\n${key}=${value}`;
      }
    }

    fs.writeFileSync(iniPath, content, "utf-8");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: Clean Fortnite cache ───────────────────────────────────────────────
ipcMain.handle("clean-fortnite-cache", async () => {
  try {
    const localApp = process.env.LOCALAPPDATA || join(os.homedir(), "AppData", "Local");
    const cachePaths = [
      join(localApp, "EpicGamesLauncher", "Saved", "webcache"),
      join(localApp, "FortniteGame", "Saved", "webcache"),
      join(localApp, "FortniteGame", "Saved", "PipelineCaches"),
    ];

    let deletedCount = 0;
    for (const p of cachePaths) {
      if (fs.existsSync(p)) {
        try {
          await execAsync(`rd /s /q "${p}"`, { timeout: 30000 });
          deletedCount++;
        } catch { /* ignore individual failures */ }
      }
    }

    return { ok: true, deletedCount };
  } catch (e: unknown) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: GPO — scan status ──────────────────────────────────────────────────
ipcMain.handle("scan-gpo-status", async () => {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
function Get-Reg($path, $name) {
  try { return (Get-ItemProperty -LiteralPath "Registry::$path" -Name $name -ErrorAction Stop).$name } catch { return $null }
}
$gpedit = Test-Path "$env:SystemRoot\\System32\\gpedit.msc"

# VBS status
$vbs = $false
try {
  $dg = Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root/Microsoft/Windows/DeviceGuard -ErrorAction Stop
  $vbs = ($dg.VirtualizationBasedSecurityStatus -eq 2)
} catch {}

# Tweak checks
$bandwidth    = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Psched" "NonBestEffortLimit") -eq 0
$qos          = (Test-Path "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\QoS\Fortnite")
$delivOpt     = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" "DODownloadMode") -eq 0
$powerThrot   = (Get-Reg "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling" "PowerThrottlingOff") -eq 1
$hags         = (Get-Reg "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" "HwSchMode") -eq 2
$fastStartup  = (Get-Reg "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Power" "HiberbootEnabled") -eq 0
$vbsDisabled  = (Get-Reg "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\DeviceGuard" "EnableVirtualizationBasedSecurity") -eq 0
$telemetry    = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection" "AllowTelemetry") -eq 0
$cortana      = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search" "AllowCortana") -eq 0
$onedrive     = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\OneDrive" "DisableFileSyncNGSC") -eq 1
$winupdate    = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" "NoAutoUpdate") -eq 1
$appCompat    = (Get-Reg "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\AppCompat" "AITEnable") -eq 0

function s($b) { if ($b) { 'active' } else { 'inactive' } }
@{
  gpeditAvailable = [bool]$gpedit
  vbsActive = [bool]$vbs
  tweaks = @{
    bandwidth    = s $bandwidth
    qos_fortnite = s $qos
    delivery_opt = s $delivOpt
    power_throttling = s $powerThrot
    hags         = s $hags
    fast_startup = s $fastStartup
    vbs          = s $vbsDisabled
    telemetry    = s $telemetry
    cortana      = s $cortana
    onedrive     = s $onedrive
    windows_update = s $winupdate
    app_compat   = s $appCompat
  }
} | ConvertTo-Json -Depth 3
`;
  try {
    const out = await runPs1(script, false, 12000);
    return JSON.parse(out);
  } catch {
    return { gpeditAvailable: false, vbsActive: false, tweaks: {} };
  }
});

// ─── IPC: GPO — install gpedit on Windows Home ───────────────────────────────
ipcMain.handle("install-gpedit", async () => {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
$packages = Get-ChildItem "$env:SystemRoot\\servicing\\Packages" -Filter "Microsoft-Windows-GroupPolicy-ClientExtensions-Package~3*.mum" | Select-Object -ExpandProperty FullName
foreach ($pkg in $packages) {
  dism /Online /NoRestart /Add-Package:$pkg | Out-Null
}
$packages2 = Get-ChildItem "$env:SystemRoot\\servicing\\Packages" -Filter "Microsoft-Windows-GroupPolicy-ClientTools-Package~3*.mum" | Select-Object -ExpandProperty FullName
foreach ($pkg in $packages2) {
  dism /Online /NoRestart /Add-Package:$pkg | Out-Null
}
Write-Host "DONE"
`;
  try {
    await runPs1(script, true, 120000);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: GPO — apply tweaks ─────────────────────────────────────────────────
ipcMain.handle("apply-gpo-tweaks", async (_e, ids: string[]) => {
  const lines: string[] = ["@echo off"];

  if (ids.includes("bandwidth"))
    lines.push(`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f >nul`);

  if (ids.includes("qos_fortnite")) {
    const base = `HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite`;
    lines.push(
      `reg add "${base}" /v "Application" /t REG_SZ /d "FortniteClient-Win64-Shipping.exe" /f >nul`,
      `reg add "${base}" /v "DSCP Value" /t REG_SZ /d "46" /f >nul`,
      `reg add "${base}" /v "Local Port" /t REG_SZ /d "*" /f >nul`,
      `reg add "${base}" /v "Protocol" /t REG_SZ /d "*" /f >nul`,
      `reg add "${base}" /v "Throttle Rate" /t REG_SZ /d "-1" /f >nul`,
    );
  }

  if (ids.includes("delivery_opt"))
    lines.push(`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f >nul`);

  if (ids.includes("power_throttling"))
    lines.push(`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f >nul`);

  if (ids.includes("hags"))
    lines.push(`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f >nul`);

  if (ids.includes("fast_startup"))
    lines.push(`reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f >nul`);

  if (ids.includes("vbs")) {
    lines.push(
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v EnableVirtualizationBasedSecurity /t REG_DWORD /d 0 /f >nul`,
      `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity" /v Enabled /t REG_DWORD /d 0 /f >nul`,
    );
  }

  if (ids.includes("telemetry")) {
    lines.push(
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f >nul`,
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v MaxTelemetryAllowed /t REG_DWORD /d 0 /f >nul`,
    );
  }

  if (ids.includes("app_compat")) {
    lines.push(
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v AITEnable /t REG_DWORD /d 0 /f >nul`,
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableInventory /t REG_DWORD /d 1 /f >nul`,
    );
  }

  if (ids.includes("cortana")) {
    lines.push(
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f >nul`,
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v DisableWebSearch /t REG_DWORD /d 1 /f >nul`,
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v ConnectedSearchUseWeb /t REG_DWORD /d 0 /f >nul`,
    );
  }

  if (ids.includes("onedrive"))
    lines.push(`reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" /v DisableFileSyncNGSC /t REG_DWORD /d 1 /f >nul`);

  if (ids.includes("windows_update")) {
    lines.push(
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f >nul`,
      `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v AUOptions /t REG_DWORD /d 2 /f >nul`,
    );
  }

  lines.push("echo OK");
  const batContent = lines.join("\r\n");
  const batPath = join(SCRIPTS_DIR, `gpo_${Date.now()}.bat`);

  try {
    fs.writeFileSync(batPath, batContent, "utf-8");
    const cmd = `powershell -Command "Start-Process cmd.exe -ArgumentList '/c \\"${batPath.replace(/\\/g, "\\\\")}\\""' -Verb RunAs -Wait"`;
    await execAsync(cmd, { timeout: 60000 });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    if (fs.existsSync(batPath)) fs.unlinkSync(batPath);
  }
});

// ─── IPC: GPO — restore defaults ─────────────────────────────────────────────
ipcMain.handle("restore-gpo-defaults", async () => {
  const batContent = `@echo off
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /f >nul 2>&1
reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /f >nul 2>&1
reg add    "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 1 /f >nul
reg add    "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f >nul
reg add    "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v EnableVirtualizationBasedSecurity /t REG_DWORD /d 1 /f >nul
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v MaxTelemetryAllowed /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v AITEnable /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableInventory /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v DisableWebSearch /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v ConnectedSearchUseWeb /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive" /v DisableFileSyncNGSC /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v AUOptions /f >nul 2>&1
echo OK
`;
  const batPath = join(SCRIPTS_DIR, `gpo_restore_${Date.now()}.bat`);
  try {
    fs.writeFileSync(batPath, batContent, "utf-8");
    const cmd = `powershell -Command "Start-Process cmd.exe -ArgumentList '/c \\"${batPath.replace(/\\/g, "\\\\")}\\""' -Verb RunAs -Wait"`;
    await execAsync(cmd, { timeout: 30000 });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    if (fs.existsSync(batPath)) fs.unlinkSync(batPath);
  }
});

// ─── IPC: Scan junk files ────────────────────────────────────────────────────
ipcMain.handle("scan-junk", async () => {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
function Get-FolderSize($path) {
  if (-not (Test-Path $path)) { return 0 }
  (Get-ChildItem $path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
}
$env_temp = $env:TEMP
$win_temp = "C:\\Windows\\Temp"
$prefetch = "C:\\Windows\\Prefetch"
$win_logs = "C:\\Windows\\System32\\winevt\\Logs"
$epic = "$env:LOCALAPPDATA\\EpicGamesLauncher\\Saved\\webcache"
$chrome = "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Cache"
$edge = "$env:LOCALAPPDATA\\Microsoft\\Edge\\User Data\\Default\\Cache"
$ff = "$env:APPDATA\\Mozilla\\Firefox\\Profiles"
@{
  temp_user   = [int](Get-FolderSize $env_temp)
  temp_win    = [int](Get-FolderSize $win_temp)
  prefetch    = [int](Get-FolderSize $prefetch)
  win_logs    = [int](Get-FolderSize $win_logs)
  epic_cache  = [int](Get-FolderSize $epic)
  chrome_cache = [int](Get-FolderSize $chrome)
  edge_cache  = [int](Get-FolderSize $edge)
  firefox_cache = [int](Get-FolderSize $ff)
  dns_cache   = 0
} | ConvertTo-Json
`;
  try {
    const out = await runPs1(script, false, 20000);
    return JSON.parse(out);
  } catch {
    return {};
  }
});

// ─── IPC: Clean junk ─────────────────────────────────────────────────────────
ipcMain.handle("clean-junk", async (_e, targetId: string) => {
  const localApp = process.env.LOCALAPPDATA || join(os.homedir(), "AppData", "Local");
  const appData = process.env.APPDATA || join(os.homedir(), "AppData", "Roaming");
  const temp = process.env.TEMP || join(os.homedir(), "AppData", "Local", "Temp");

  const targets: Record<string, string[]> = {
    temp_user: [temp],
    temp_win: ["C:\\Windows\\Temp"],
    prefetch: ["C:\\Windows\\Prefetch"],
    win_logs: ["C:\\Windows\\System32\\winevt\\Logs"],
    epic_cache: [join(localApp, "EpicGamesLauncher", "Saved", "webcache")],
    chrome_cache: [join(localApp, "Google", "Chrome", "User Data", "Default", "Cache")],
    edge_cache: [join(localApp, "Microsoft", "Edge", "User Data", "Default", "Cache")],
    firefox_cache: [join(appData, "Mozilla", "Firefox", "Profiles")],
    dns_cache: [],
  };

  try {
    if (targetId === "dns_cache") {
      await execAsync("ipconfig /flushdns", { timeout: 5000 });
      return { ok: true };
    }

    const paths = targets[targetId] || [];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        await execAsync(`rd /s /q "${p}" 2>nul`, { timeout: 15000 }).catch(() => {});
        fs.mkdirSync(p, { recursive: true });
      }
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
});

// ─── IPC: Driver info ─────────────────────────────────────────────────────────
ipcMain.handle("get-driver-info", async () => {
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
$gpu = Get-WmiObject Win32_VideoController | Where-Object { $_.Name -notlike '*Microsoft*' } | Select-Object -First 1
$gpuName = if ($gpu) { $gpu.Name } else { 'Inconnu' }
$gpuDriver = if ($gpu) { $gpu.DriverVersion } else { 'N/A' }
$isNvidia = ($gpuName -match 'NVIDIA')
$isAmd = ($gpuName -match 'AMD|Radeon')
@{
  gpu = $gpuName
  gpuVersion = $gpuDriver
  isNvidia = [bool]$isNvidia
  isAmd = [bool]$isAmd
} | ConvertTo-Json
`;
  try {
    const out = await runPs1(script, false, 8000);
    return JSON.parse(out);
  } catch {
    return { gpu: "Inconnu", gpuVersion: "N/A", isNvidia: false, isAmd: false };
  }
});

// ─── IPC: Apply streaming mode ────────────────────────────────────────────────
ipcMain.handle("apply-streaming-mode", async () => {
  const batContent = `@echo off
:: Priorité processus streaming
wmic process where name="obs64.exe" CALL setpriority "Above Normal" >nul 2>&1
wmic process where name="FortniteClient-Win64-Shipping.exe" CALL setpriority "High Priority" >nul 2>&1

:: Désactiver notifications Windows
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f >nul

:: Optimiser bande passante upload (QoS)
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v "NonBestEffortLimit" /t REG_DWORD /d 0 /f >nul

:: OBS encoder settings via registry hint
reg add "HKCU\\Software\\obs-studio" /v "KermoukStreamOptimized" /t REG_SZ /d "1" /f >nul 2>&1

:: CPU affinity hints (commentaire de référence pour user)
:: Fortnite: cores 0-5, OBS: cores 6-11 (configurer manuellement dans Task Manager)

echo STREAMING_MODE_OK
`;
  const batPath = join(SCRIPTS_DIR, `streaming_${Date.now()}.bat`);
  try {
    fs.writeFileSync(batPath, batContent, "utf-8");
    const cmd = `powershell -Command "Start-Process cmd.exe -ArgumentList '/c \\"${batPath.replace(/\\/g, "\\\\")}\\""' -Verb RunAs -Wait"`;
    await execAsync(cmd, { timeout: 30000 });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  } finally {
    if (fs.existsSync(batPath)) fs.unlinkSync(batPath);
  }
});

// ─── IPC: Notifications toggle ────────────────────────────────────────────────
let notificationsEnabled = true;
ipcMain.handle("set-notifications-enabled", (_e, enabled: boolean) => {
  notificationsEnabled = enabled;
});

// ─── Auto-updater ─────────────────────────────────────────────────────────────
function initAutoUpdater(win: BrowserWindow) {
  // Ne s'exécute que dans l'app packagée — évite les crashes en dev
  if (!app.isPackaged) return;

  try {
    autoUpdater.logger = null; // désactive les logs internes qui peuvent crasher
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowDowngrade = false;
  } catch {
    return;
  }

  const send = (type: string, payload?: Record<string, unknown>) => {
    try {
      if (!win.isDestroyed()) win.webContents.send("update-status", { type, ...payload });
    } catch { /* ignorer si la fenêtre est fermée */ }
  };

  autoUpdater.on("checking-for-update", () => send("checking"));

  autoUpdater.on("update-available", (info) => {
    send("available", { version: info.version });
    try {
      new Notification({
        title: "KERMOUK — Mise à jour disponible",
        body: `Version ${info.version} disponible — téléchargement en cours...`,
        icon: join(__dirname, "../../resources/icon.png"),
      }).show();
    } catch { /* notification optionnelle */ }
  });

  autoUpdater.on("update-not-available", () => send("up-to-date"));

  autoUpdater.on("download-progress", (p) => {
    try {
      send("downloading", { percent: Math.round(p.percent), bytesPerSecond: Math.round(p.bytesPerSecond) });
    } catch { /* ignorer */ }
  });

  autoUpdater.on("update-downloaded", (info) => send("downloaded", { version: info.version }));

  // Erreur silencieuse — ne doit jamais crasher l'app
  autoUpdater.on("error", () => { /* silencieux */ });

  // Vérification 10s après le lancement — toujours dans un try/catch
  setTimeout(() => {
    try {
      autoUpdater.checkForUpdates().catch(() => { /* pas de connexion — silencieux */ });
    } catch { /* silencieux */ }
  }, 10000);
}

// ─── IPC: Update controls ─────────────────────────────────────────────────────
ipcMain.handle("check-for-updates", async () => {
  if (!app.isPackaged) {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      win.webContents.send("update-status", { type: "up-to-date" });
    }
    return;
  }
  try {
    await autoUpdater.checkForUpdates();
  } catch {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      win.webContents.send("update-status", { type: "error", message: "Impossible de vérifier les mises à jour" });
    }
  }
});

ipcMain.handle("install-update", () => {
  if (!app.isPackaged) return;
  try {
    autoUpdater.quitAndInstall(false, true);
  } catch { /* silencieux */ }
});

// ─── Background: Smart monitoring every 30s ──────────────────────────────────
function startMonitoring(win: BrowserWindow) {
  setInterval(async () => {
    if (!notificationsEnabled) return;
    try {
      const script = `
$ErrorActionPreference = 'SilentlyContinue'
$cpu = [int]((Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average)
$ram = Get-WmiObject Win32_OperatingSystem
$ramPct = [int][math]::Round(($ram.TotalVisibleMemorySize - $ram.FreePhysicalMemory) / $ram.TotalVisibleMemorySize * 100)
$disk = Get-PSDrive C | Select-Object -ExpandProperty Used
$diskTotal = (Get-PSDrive C).Used + (Get-PSDrive C).Free
$diskPct = [int][math]::Round($disk / $diskTotal * 100)
$cpuTemp = -1
try {
  $tz = Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace root/wmi | Select-Object -First 1
  if ($tz) { $cpuTemp = [int][math]::Round(($tz.CurrentTemperature / 10) - 273.15) }
} catch {}
@{ cpu=$cpu; ram=$ramPct; disk=$diskPct; cpuTemp=$cpuTemp } | ConvertTo-Json
`;
      const out = await runPs1(script, false, 6000);
      const data = JSON.parse(out);

      if (data.ram > 85) {
        new Notification({
          title: "KERMOUK — RAM saturée",
          body: `RAM à ${data.ram}% — Utilise le Nettoyeur pour libérer de la mémoire !`,
          icon: join(__dirname, "../../resources/icon.png"),
        }).show();
      } else if (data.cpuTemp > 85 && data.cpuTemp < 120) {
        new Notification({
          title: "KERMOUK — CPU chaud",
          body: `Température CPU : ${data.cpuTemp}°C — Applique les tweaks de throttling ?`,
          icon: join(__dirname, "../../resources/icon.png"),
        }).show();
      } else if (data.disk > 90) {
        new Notification({
          title: "KERMOUK — Disque plein",
          body: `Disque C: à ${data.disk}% — Lance le Nettoyeur pour récupérer de l'espace.`,
          icon: join(__dirname, "../../resources/icon.png"),
        }).show();
      }

      win.webContents.send("hw-alert", data);
    } catch { /* ignore monitoring errors */ }
  }, 30000);
}

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
