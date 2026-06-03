export interface Tweak {
  id: string;
  name: string;
  description: string;
  category: "free" | "premium";
  commands: string[];
  registryCommands?: string[];
  powershellCommands?: string[];
  serviceCommands?: string[];
}

export const FREE_TWEAKS: Tweak[] = [
  {
    id: "disable-gamebar",
    name: "Désactivation Xbox Game Bar",
    description: "Désactive la Xbox Game Bar qui consomme des ressources inutiles en jeu.",
    category: "free",
    commands: [],
    registryCommands: [
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f',
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f',
    ],
  },
  {
    id: "high-performance",
    name: "Mode Haute Performance",
    description: "Active le mode d'alimentation Haute Performance pour des performances maximales.",
    category: "free",
    commands: ["powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"],
  },
  {
    id: "disable-notifications",
    name: "Désactivation Notifications",
    description: "Désactive les notifications Windows pendant les sessions de jeu.",
    category: "free",
    registryCommands: [
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled /t REG_DWORD /d 0 /f',
    ],
    commands: [],
  },
  {
    id: "clean-temp",
    name: "Nettoyage Fichiers Temporaires",
    description: "Supprime les fichiers temporaires pour libérer de l'espace et améliorer les temps de chargement.",
    category: "free",
    commands: [
      'del /q /f /s "%TEMP%\\*"',
      'del /q /f /s "C:\\Windows\\Temp\\*"',
    ],
  },
  {
    id: "disable-gamedvr",
    name: "Désactivation Game DVR",
    description: "Désactive l'enregistrement automatique Game DVR qui impacte les FPS.",
    category: "free",
    registryCommands: [
      'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f',
      'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f',
    ],
    commands: [],
  },
  {
    id: "timer-resolution",
    name: "Timer Resolution 0.5ms",
    description: "Active la résolution de timer haute précision pour réduire la latence gaming et les micro-stutters.",
    category: "free",
    commands: [
      "bcdedit /set useplatformtick yes",
      "bcdedit /set disabledynamictick yes",
    ],
  },
  {
    id: "disable-hyperv",
    name: "Désactivation Hyper-V",
    description: "Désactive Hyper-V pour éliminer la couche de virtualisation et réduire la latence CPU.",
    category: "free",
    commands: ["bcdedit /set hypervisorlaunchtype off"],
  },
  {
    id: "ssd-nvme-optimization",
    name: "Optimisation SSD/NVMe",
    description: "Désactive DisableLastAccess et EncryptPagingFile pour des temps d'accès SSD/NVMe optimaux.",
    category: "free",
    commands: [
      "fsutil behavior set DisableLastAccess 1",
      "fsutil behavior set EncryptPagingFile 0",
    ],
  },
  {
    id: "disable-defender-rt",
    name: "Désactivation Defender Temps Réel",
    description: "Désactive la protection temps réel Windows Defender pendant les sessions gaming pour libérer CPU.",
    category: "free",
    commands: [],
    powershellCommands: ["Set-MpPreference -DisableRealtimeMonitoring $true"],
  },
  {
    id: "mmcss-audio",
    name: "MMCSS Audio Tweaks",
    description: "Optimise le sous-système MMCSS (SystemResponsiveness=0, NetworkThrottlingIndex max) pour prioriser les jeux.",
    category: "free",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f',
    ],
  },
];

export const PREMIUM_TWEAKS: Tweak[] = [
  // ── RÉSEAU ──────────────────────────────────────────────────────────────────
  {
    id: "tcp-autotune",
    name: "TCP AutoTuning Désactivé",
    description: "Désactive l'autotuning TCP pour une latence plus stable.",
    category: "premium",
    commands: ["netsh int tcp set global autotuninglevel=disabled"],
  },
  {
    id: "tcp-rss",
    name: "RSS Réseau Activé",
    description: "Active Receive Side Scaling pour distribuer la charge réseau sur plusieurs cœurs.",
    category: "premium",
    commands: ["netsh int tcp set global rss=enabled"],
  },
  {
    id: "tcp-chimney",
    name: "TCP Chimney Désactivé",
    description: "Désactive TCP Chimney pour une meilleure compatibilité et stabilité.",
    category: "premium",
    commands: [
      "netsh int tcp set global chimney=disabled",
      "netsh int tcp set global dca=enabled",
      "netsh int tcp set global netdma=enabled",
    ],
  },
  {
    id: "dns-cloudflare",
    name: "DNS Cloudflare 1.1.1.1",
    description: "Configure le DNS Cloudflare ultra-rapide pour réduire la latence de résolution DNS.",
    category: "premium",
    commands: [
      'netsh interface ip set dns name="Ethernet" static 1.1.1.1 primary',
      'netsh interface ip add dns name="Ethernet" 1.0.0.1 index=2',
    ],
  },
  {
    id: "nagle-algorithm",
    name: "Désactivation Algorithme Nagle",
    description: "Désactive l'algorithme Nagle (TcpAckFrequency + TCPNoDelay) pour envoyer les paquets immédiatement sans délai.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v TcpAckFrequency /t REG_DWORD /d 1 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /v TCPNoDelay /t REG_DWORD /d 1 /f',
    ],
  },
  {
    id: "mtu-gaming",
    name: "MTU Optimisé Gaming (1472)",
    description: "Configure le MTU optimal pour Fortnite afin d'éviter la fragmentation des paquets réseau.",
    category: "premium",
    commands: ['netsh interface ipv4 set subinterface "Ethernet" mtu=1472 store=persistent'],
  },
  {
    id: "qos-fortnite",
    name: "QoS Fortnite (Priorité Paquets)",
    description: "Configure la qualité de service Windows (DSCP 46) pour prioriser les paquets de Fortnite.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /v Application /t REG_SZ /d "FortniteClient-Win64-Shipping.exe" /f',
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /v "DSCP Value" /t REG_SZ /d "46" /f',
    ],
  },
  {
    id: "interrupt-affinity",
    name: "Interrupt Affinity Réseau",
    description: "Désactive l'Interrupt Moderation sur l'adaptateur Ethernet pour réduire la latence réseau.",
    category: "premium",
    commands: [],
    powershellCommands: ['Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*InterruptModeration" -RegistryValue 0'],
  },
  // ── GPU ─────────────────────────────────────────────────────────────────────
  {
    id: "gpu-tdr",
    name: "TDR Delay GPU Optimisé",
    description: "Augmente TdrDelay et TdrDdiDelay pour éviter les freezes GPU en jeu.",
    category: "premium",
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 60 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /t REG_DWORD /d 60 /f',
    ],
    commands: [],
  },
  {
    id: "gpu-hwsched",
    name: "Hardware Scheduling GPU",
    description: "Active le Hardware Scheduling GPU (HwSchMode=2) pour de meilleures performances.",
    category: "premium",
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f',
    ],
    commands: [],
  },
  {
    id: "disable-hpet",
    name: "Désactivation HPET",
    description: "Désactive le High Precision Event Timer pour réduire la latence système.",
    category: "premium",
    commands: ["bcdedit /deletevalue useplatformclock", "bcdedit /set disabledynamictick yes"],
  },
  {
    id: "nvidia-ull",
    name: "Ultra Low Latency Mode NVIDIA",
    description: "Active le mode Ultra Low Latency NVIDIA pour minimiser l'Input Lag GPU via le registre.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "NvCplEnableNvidiaPcieGen1" /t REG_DWORD /d 0 /f',
    ],
  },
  {
    id: "nvidia-shader-cache",
    name: "Shader Cache NVIDIA Désactivé",
    description: "Désactive le cache de shaders NVIDIA pour éviter la surcharge disque lors des chargements.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKCU\\SOFTWARE\\NVIDIA Corporation\\Global\\NVTweak" /v "Shaders" /t REG_DWORD /d 0 /f',
    ],
  },
  {
    id: "nvidia-auto-boost",
    name: "Texture Filtering Haute Performance",
    description: "Désactive l'auto-boost NVIDIA pour des fréquences GPU stables et prévisibles.",
    category: "premium",
    commands: ["nvidia-smi --auto-boost-default=0"],
  },
  {
    id: "nvidia-power-management",
    name: "Power Management Maximum Performance",
    description: "Force le GPU NVIDIA en mode Performance Maximum permanente via PerfLevelSrc.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v "PerfLevelSrc" /t REG_DWORD /d 8738 /f',
    ],
  },
  // ── CPU ─────────────────────────────────────────────────────────────────────
  {
    id: "cpu-priority",
    name: "Priorité CPU Gaming",
    description: "Configure SchedulingCategory High et Priority 6 pour les jeux via le registre.",
    category: "premium",
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v Priority /t REG_DWORD /d 6 /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "SFIO Priority" /t REG_SZ /d High /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f',
    ],
    commands: [],
  },
  // ── SERVICES ─────────────────────────────────────────────────────────────────
  {
    id: "disable-superfetch",
    name: "Désactivation SysMain (Superfetch)",
    description: "Désactive Superfetch qui monopolise la RAM et le disque inutilement en jeu.",
    category: "premium",
    serviceCommands: ["sc stop SysMain", "sc config SysMain start=disabled"],
    commands: [],
  },
  {
    id: "disable-tracking",
    name: "Désactivation DiagTrack & Telemetry",
    description: "Désactive la télémétrie Windows qui consomme bande passante et CPU.",
    category: "premium",
    serviceCommands: [
      "sc stop DiagTrack",
      "sc config DiagTrack start=disabled",
      "sc stop dmwappushservice",
      "sc config dmwappushservice start=disabled",
    ],
    commands: [],
  },
  {
    id: "disable-xbox-services",
    name: "Désactivation Services Xbox",
    description: "Désactive XblAuthManager, XblGameSave, XboxGipSvc et XboxNetApiSvc.",
    category: "premium",
    serviceCommands: [
      "sc stop XblAuthManager",
      "sc config XblAuthManager start=disabled",
      "sc stop XblGameSave",
      "sc config XblGameSave start=disabled",
      "sc stop XboxGipSvc",
      "sc config XboxGipSvc start=disabled",
      "sc stop XboxNetApiSvc",
      "sc config XboxNetApiSvc start=disabled",
    ],
    commands: [],
  },
  {
    id: "disable-other-services",
    name: "Désactivation Services Inutiles",
    description: "Désactive MapsBroker, RetailDemo et WerSvc (rapport d'erreurs).",
    category: "premium",
    serviceCommands: [
      "sc stop MapsBroker",
      "sc config MapsBroker start=disabled",
      "sc stop RetailDemo",
      "sc config RetailDemo start=disabled",
      "sc stop WerSvc",
      "sc config WerSvc start=disabled",
    ],
    commands: [],
  },
  // ── MÉMOIRE ──────────────────────────────────────────────────────────────────
  {
    id: "memory-usage",
    name: "Optimisation Mémoire fsutil",
    description: "Configure memoryusage=2 et désactive 8dot3 et lastaccess pour de meilleures performances.",
    category: "premium",
    commands: [
      "fsutil behavior set memoryusage 2",
      "fsutil behavior set disable8dot3 1",
      "fsutil behavior set disablelastaccess 1",
    ],
  },
  {
    id: "disable-memory-compression",
    name: "Désactivation Memory Compression",
    description: "Désactive la compression mémoire Windows pour libérer des ressources CPU.",
    category: "premium",
    powershellCommands: ["Disable-MMAgent -mc"],
    commands: [],
  },
];

export function generateBatScript(tweaks: Tweak[]): string {
  const lines: string[] = [
    "@echo off",
    "chcp 65001 > nul",
    "echo ============================================",
    "echo   KERMOUK OPTIMIZER v2.2.0 - Application Tweaks",
    "echo ============================================",
    "echo.",
    "",
  ];

  for (const tweak of tweaks) {
    lines.push(`echo [*] Application: ${tweak.name}`);

    if (tweak.commands?.length) {
      for (const cmd of tweak.commands) {
        lines.push(cmd);
      }
    }

    if (tweak.registryCommands?.length) {
      for (const cmd of tweak.registryCommands) {
        lines.push(cmd);
      }
    }

    if (tweak.serviceCommands?.length) {
      for (const cmd of tweak.serviceCommands) {
        lines.push(cmd);
      }
    }

    if (tweak.powershellCommands?.length) {
      for (const cmd of tweak.powershellCommands) {
        lines.push(`powershell -Command "${cmd}"`);
      }
    }

    lines.push("");
  }

  lines.push(
    "echo.",
    "echo ============================================",
    `echo   ${tweaks.length} tweak(s) applique(s) avec succes !`,
    "echo   Redemarrez Windows pour appliquer tous les changements.",
    "echo ============================================",
    "echo.",
    "pause"
  );

  return lines.join("\r\n");
}
