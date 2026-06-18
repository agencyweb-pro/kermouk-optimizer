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
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /v "Application Name" /t REG_SZ /d "FortniteClient-Win64-Shipping.exe" /f',
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
    name: "TDR Delay GPU Optimise",
    description: "Configure TdrDelay=10, TdrDdiDelay=10 et TdrLevel=3 pour eviter les freezes GPU.",
    category: "premium",
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 10 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /t REG_DWORD /d 10 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrLevel /t REG_DWORD /d 3 /f',
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
    name: "Desactivation SysMain (deconseille 32GB)",
    description: "ATTENTION : sur 32 GB RAM, SysMain est benefique. A desactiver uniquement si RAM < 8 GB.",
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
    description: "Configure memoryusage=1 (optimal 32GB) et désactive 8dot3 et lastaccess.",
    category: "premium",
    commands: [
      "fsutil behavior set memoryusage 1",
      "fsutil behavior set disable8dot3 1",
      "fsutil behavior set disablelastaccess 1",
    ],
  },
  {
    id: "disable-memory-compression",
    name: "Desactivation Memory Compression",
    description: "Desactive la compression memoire Windows pour liberer des ressources CPU.",
    category: "premium",
    powershellCommands: ["Disable-MMAgent -mc"],
    commands: [],
  },
  // ── NOUVEAUX TWEAKS PREMIUM ──────────────────────────────────────────────────
  {
    id: "disable-mpo",
    name: "Desactivation MPO (Multi-Plane Overlay)",
    description: "Elimine les micro-freezes et stutters sur GPU NVIDIA laptops. Impact majeur sur GTX 1650 Ti.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm" /v "OverlayTestMode" /t REG_DWORD /d 5 /f',
    ],
  },
  {
    id: "bcdedit-dynamictick",
    name: "Desactivation Dynamic Tick (BCDEdit)",
    description: "Reduit les interruptions CPU inutiles pour une latence d'input plus stable.",
    category: "premium",
    commands: [
      "bcdedit /set disabledynamictick yes",
      "bcdedit /set useplatformclock false",
      "bcdedit /set tscsyncpolicy enhanced",
    ],
  },
  {
    id: "wifi-sleep-disable",
    name: "Desactivation Veille Adaptateur WiFi",
    description: "Empeche l'adaptateur WiFi de se mettre en veille, elimine les pics de ping.",
    category: "premium",
    commands: [
      'powershell -Command "Get-NetAdapter | Where-Object {$_.PhysicalMediaType -like \'*802.11*\'} | ForEach-Object { try { Set-NetAdapterPowerManagement -Name $_.Name -AllowComputerToTurnOffDevice Disabled } catch {} }"',
    ],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4D36E972-E325-11CE-BFC1-08002bE10318}\\0001" /v "PnPCapabilities" /t REG_DWORD /d 24 /f',
    ],
  },
  {
    id: "disable-power-throttling",
    name: "Desactivation PowerThrottling",
    description: "Desactive le throttling CPU de Windows pour les apps gaming. Crucial sur laptop.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v "PowerThrottlingOff" /t REG_DWORD /d 1 /f',
    ],
  },
  {
    id: "mft-zone",
    name: "Optimisation Zone MFT (NTFS)",
    description: "Agrandit la zone MFT pour eviter la fragmentation sur les gros fichiers Fortnite.",
    category: "premium",
    commands: ["fsutil behavior set mftzone 2"],
  },
  // ── TWEAKS D:\OPTI KERMOUK ───────────────────────────────────────────────────
  {
    id: "win32-priority-separation",
    name: "Win32PrioritySeparation Gaming (42)",
    description: "Configure Win32PrioritySeparation=42 pour maximiser la tranche CPU allouee aux programmes en avant-plan.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 42 /f',
    ],
  },
  {
    id: "mmcss-latency-sensitive",
    name: "MMCSS NoLazyMode + LatencySensitive",
    description: "Active NoLazyMode et AlwaysOn sur le profil MMCSS et marque toutes les taches comme Latency Sensitive pour reduire les micro-stutters.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NoLazyMode /t REG_DWORD /d 1 /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v AlwaysOn /t REG_DWORD /d 1 /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Latency Sensitive" /t REG_SZ /d True /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Low Latency" /v "Latency Sensitive" /t REG_SZ /d True /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Audio" /v "Latency Sensitive" /t REG_SZ /d True /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\DisplayPostProcessing" /v "Latency Sensitive" /t REG_SZ /d True /f',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Window Manager" /v "Latency Sensitive" /t REG_SZ /d True /f',
    ],
  },
  {
    id: "keyboard-mouse-queue",
    name: "Taille Buffer Clavier & Souris",
    description: "Augmente la file d'attente clavier (kbdclass) et souris (mouclass) a 32 entrees pour eviter les drops d'inputs.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters" /v KeyboardDataQueueSize /t REG_DWORD /d 32 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters" /v MouseDataQueueSize /t REG_DWORD /d 32 /f',
    ],
  },
  {
    id: "core-parking-disable",
    name: "Desactivation Core Parking",
    description: "Empeche Windows d'eteindre des coeurs CPU en jeu (Wake Up Cores). Reduit les pics de latence sur i5-10300H.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\943c8cb6-6f93-4227-ad87-e9a3feec08d1" /v Attributes /t REG_DWORD /d 2 /f',
    ],
  },
  {
    id: "usb-power-save-disable",
    name: "Desactivation Veille USB",
    description: "Empeche Windows de mettre en veille les peripheriques USB (souris, clavier, casque) pour eliminer les micro-freezes.",
    category: "premium",
    commands: [],
    powershellCommands: [
      'Get-PnpDevice | Where-Object { $_.InstanceId -like "*USB\\ROOT*" } | ForEach-Object { try { $obj = Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\\wmi | Where-Object { $_.InstanceName -like "*$($_.InstanceId)*" }; if ($obj) { Set-CimInstance -InputObject $obj -Property @{Enable=$false} } } catch {} }',
      'Get-NetAdapter -Physical | Get-NetAdapterPowerManagement | ForEach-Object { $_.AllowComputerToTurnOffDevice = "Disabled"; $_ | Set-NetAdapterPowerManagement }',
    ],
  },
  {
    id: "winsock-reset",
    name: "Reset Winsock & DNS Flush",
    description: "Reinitialise la pile reseau Windows et vide le cache DNS pour des connexions plus propres.",
    category: "premium",
    commands: [
      "netsh winsock reset",
      "netsh int ip reset",
      "ipconfig /flushdns",
    ],
  },
  {
    id: "delivery-optimization-disable",
    name: "Desactivation Delivery Optimization",
    description: "Desactive le partage de mises a jour Windows entre PCs (DownloadMode=0) pour liberer de la bande passante en jeu.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v DownloadMode /t REG_DWORD /d 0 /f',
    ],
  },
  {
    id: "energy-estimation-disable",
    name: "Desactivation EnergyEstimation",
    description: "Desactive le calcul d'estimation energetique Windows inutile sur un PC gaming branche.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v EnergyEstimationEnabled /t REG_DWORD /d 0 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v Latency /t REG_DWORD /d 0 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v LowLatency /t REG_DWORD /d 1 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power" /v HighestPerformance /t REG_DWORD /d 1 /f',
    ],
  },
  {
    id: "svhost-split-32gb",
    name: "SvcHostSplitThreshold 32 GB",
    description: "Configure SvcHostSplitThresholdInKB=3200000 pour 32 GB de RAM afin de reduire le nombre de processus svchost et liberer de la memoire.",
    category: "premium",
    commands: [],
    registryCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control" /v SvcHostSplitThresholdInKB /t REG_DWORD /d 3200000 /f',
    ],
  },
];

export function generateBatScript(tweaks: Tweak[]): string {
  const lines: string[] = [
    "@echo off",
    "echo ============================================",
    "echo   KERMOUK OPTIMIZER v2.5.0 - Application Tweaks",
    "echo ============================================",
    "echo.",
    "",
  ];

  for (const tweak of tweaks) {
    lines.push(`echo [*] Tweak: ${tweak.id}`);

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
