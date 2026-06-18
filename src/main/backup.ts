import { join } from "path";
import * as fs from "fs";
import * as os from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { app } from "electron";

const execAsync = promisify(exec);

function getBackupsDir(): string {
  return join(app.getPath("userData"), "Backups");
}

// Registry keys managed by the app — export these on backup
const REGISTRY_KEYS = [
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR",
  "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR",
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications",
  "HKCU\\System\\GameConfigStore",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Low Latency",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Audio",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\DisplayPostProcessing",
  "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Window Manager",
  "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters",
  "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS",
  "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers",
  "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak",
  "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling",
  "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl",
  "HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm",
  "HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters",
  "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters",
  "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config",
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects",
  "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power",
];

// Services managed by the app — track their state on backup
const MANAGED_SERVICES = [
  "SysMain",
  "DiagTrack",
  "dmwappushservice",
  "XblAuthManager",
  "XblGameSave",
  "XboxGipSvc",
  "XboxNetApiSvc",
  "MapsBroker",
  "RetailDemo",
  "WerSvc",
];

export interface BackupEntry {
  id: string;
  name: string;
  date: string;
  type: "manual" | "automatic";
}

interface ServiceState {
  name: string;
  startType: string;
  running: boolean;
  existedAtBackup: boolean;
}

interface BackupManifest {
  id: string;
  name: string;
  date: string;
  type: "manual" | "automatic";
  regFiles: string[];
  missingKeys: string[];
  services: ServiceState[];
}

function keyToFilename(key: string): string {
  return key.replace(/[\\/:*?"<>|]/g, "_").slice(0, 80) + ".reg";
}

async function getServiceState(name: string): Promise<ServiceState> {
  try {
    const [qcOut, queryOut] = await Promise.all([
      execAsync(`sc qc "${name}"`, { timeout: 5000 }).then(r => r.stdout).catch(() => ""),
      execAsync(`sc query "${name}"`, { timeout: 5000 }).then(r => r.stdout).catch(() => ""),
    ]);

    if (!qcOut) return { name, startType: "demand", running: false, existedAtBackup: false };

    const startMatch = qcOut.match(/START_TYPE\s*:\s*\d+\s+(\S+)/i);
    const startTypeRaw = startMatch ? startMatch[1].toLowerCase() : "demand";
    // Normalize: "auto_start" -> "auto", "demand_start" -> "demand", "disabled" -> "disabled"
    const startType = startTypeRaw.includes("auto") ? "auto"
      : startTypeRaw.includes("demand") ? "demand"
      : startTypeRaw.includes("disabled") ? "disabled"
      : "demand";

    const running = /STATE\s*:\s*\d+\s+RUNNING/i.test(queryOut);

    return { name, startType, running, existedAtBackup: true };
  } catch {
    return { name, startType: "demand", running: false, existedAtBackup: false };
  }
}

export async function createBackup(name: string, type: "manual" | "automatic"): Promise<string> {
  const backupsDir = getBackupsDir();
  fs.mkdirSync(backupsDir, { recursive: true });

  const timestamp = Date.now();
  const safeName = name.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
  const id = `${timestamp}_${safeName}`;
  const backupDir = join(backupsDir, id);
  fs.mkdirSync(backupDir, { recursive: true });

  const regFiles: string[] = [];
  const missingKeys: string[] = [];

  for (const key of REGISTRY_KEYS) {
    const filename = keyToFilename(key);
    const regPath = join(backupDir, filename);
    try {
      await execAsync(`reg export "${key}" "${regPath}" /y`, { timeout: 10000 });
      regFiles.push(filename);
    } catch {
      missingKeys.push(key);
    }
  }

  const services: ServiceState[] = [];
  for (const svc of MANAGED_SERVICES) {
    services.push(await getServiceState(svc));
  }

  const manifest: BackupManifest = {
    id, name, date: new Date().toISOString(), type,
    regFiles, missingKeys, services,
  };

  fs.writeFileSync(join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");
  return id;
}

export function listBackups(): BackupEntry[] {
  const backupsDir = getBackupsDir();
  try {
    fs.mkdirSync(backupsDir, { recursive: true });
    return fs.readdirSync(backupsDir)
      .filter(d => {
        try { return fs.statSync(join(backupsDir, d)).isDirectory(); }
        catch { return false; }
      })
      .map(d => {
        try {
          const m: BackupManifest = JSON.parse(
            fs.readFileSync(join(backupsDir, d, "manifest.json"), "utf-8")
          );
          return { id: m.id, name: m.name, date: m.date, type: m.type };
        } catch { return null; }
      })
      .filter((e): e is BackupEntry => e !== null)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch { return []; }
}

export async function restoreBackup(id: string): Promise<{ success: boolean; errors: string[] }> {
  const backupsDir = getBackupsDir();
  const backupDir = join(backupsDir, id);
  const manifestPath = join(backupDir, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    return { success: false, errors: ["Dossier de backup introuvable."] };
  }

  const manifest: BackupManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const errors: string[] = [];

  // Build PowerShell script for elevated restore
  const regImportLines = manifest.regFiles.map(f => {
    const p = join(backupDir, f).replace(/\\/g, "\\\\");
    return `try { & reg.exe import "${p}" 2>$null } catch { Write-Host "FAIL reg $('${f}')" }`;
  }).join("\n");

  // Keys that didn't exist at backup time — delete them on restore
  const regDeleteLines = manifest.missingKeys.map(key => {
    return `try { & reg.exe delete "${key}" /f 2>$null } catch {}`;
  }).join("\n");

  // Service restore with SysMain guard
  const svcLines = manifest.services
    .filter(s => s.existedAtBackup)
    .map(s => {
      // GUARD: never disable SysMain regardless of what was saved
      if (s.name === "SysMain" && s.startType === "disabled") return "";
      const stopOrStart = s.running
        ? `try { & sc.exe start "${s.name}" 2>$null } catch {}`
        : `try { & sc.exe stop "${s.name}" 2>$null } catch {}`;
      return `& sc.exe config "${s.name}" start= ${s.startType}\n${stopOrStart}`;
    })
    .filter(Boolean)
    .join("\n");

  const ps1 = [
    "$ErrorActionPreference = 'SilentlyContinue'",
    "# Restore registry",
    regImportLines,
    "# Remove keys absent at backup time",
    regDeleteLines,
    "# Restore services",
    svcLines,
  ].join("\n");

  const ps1Path = join(os.tmpdir(), `kermouk_restore_${Date.now()}.ps1`);
  fs.writeFileSync(ps1Path, ps1, "utf-8");

  try {
    const escaped = ps1Path.replace(/\\/g, "\\\\");
    const cmd = `powershell -Command "Start-Process powershell.exe -ArgumentList '-ExecutionPolicy Bypass -File \\"${escaped}\\"' -Verb RunAs -Wait"`;
    await execAsync(cmd, { timeout: 120000 });
    return { success: true, errors };
  } catch (e) {
    errors.push(String(e));
    return { success: false, errors };
  } finally {
    if (fs.existsSync(ps1Path)) fs.unlinkSync(ps1Path);
  }
}

export function deleteBackup(id: string): void {
  const backupDir = join(getBackupsDir(), id);
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
}

export function hasAutoBackupToday(): boolean {
  const today = new Date().toDateString();
  return listBackups().some(b => b.type === "automatic" && new Date(b.date).toDateString() === today);
}
