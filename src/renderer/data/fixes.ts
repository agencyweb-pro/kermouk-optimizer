export type FixCategory = "Reseau" | "Audio" | "Peripheriques" | "Systeme";

export interface Fix {
  id: string;
  title: string;
  description: string;
  category: FixCategory;
  warning?: string;
  bat: string;
}

function bat(...lines: string[]): string {
  return ["@echo off", ...lines].join("\r\n");
}

export const FIXES: Fix[] = [
  // ─── Système ─────────────────────────────────────────────────────────────────
  {
    id: "windows-update",
    title: "Windows Update bloque",
    description: "Remet a zero les services Windows Update (wuauserv, bits, cryptsvc) et supprime le cache SoftwareDistribution bloque.",
    category: "Systeme",
    bat: bat(
      // Arret des services WU
      "net stop wuauserv",
      "net stop bits",
      "net stop cryptsvc",
      "net stop msiserver",
      // Suppression du cache (les erreurs sont normales si dossiers deja supprimés)
      "rd /s /q %systemroot%\\SoftwareDistribution",
      "rd /s /q %systemroot%\\system32\\catroot2",
      // Redémarrage dans l'ordre
      "net start cryptsvc",
      "net start bits",
      "net start msiserver",
      "net start wuauserv",
    ),
  },
  {
    id: "eac-fortnite",
    title: "Fortnite / Easy Anti-Cheat",
    description: "Redemarre le service EasyAntiCheat_EOS. A executer si Fortnite refuse de se lancer avec une erreur EAC.",
    category: "Systeme",
    bat: bat(
      // Arret puis relance du service EAC — ne jamais le desactiver
      "sc stop EasyAntiCheat_EOS",
      "net start EasyAntiCheat_EOS",
    ),
  },
  {
    id: "clipboard-history",
    title: "Historique presse-papier",
    description: "Active l'historique du presse-papier Windows (Win+V) — pratique pour les pseudos, configs, etc.",
    category: "Systeme",
    // HKCU ne necessite pas d'elevation mais applyTweaks demandera UAC quand meme
    bat: bat(
      'reg add "HKCU\\Software\\Microsoft\\Clipboard" /v EnableClipboardHistory /t REG_DWORD /d 1 /f',
    ),
  },
  {
    id: "diagnostics-wer",
    title: "Diagnostics / Rapports d'erreur",
    description: "Redemarre le service WerSvc (rapport d'erreurs) en mode Manuel — evite qu'il consomme des ressources en arriere-plan.",
    category: "Systeme",
    bat: bat(
      "net stop WerSvc",
      // Remise en demarrage manuel (demand) seulement
      "sc config WerSvc start=demand",
      "net start WerSvc",
    ),
  },
  {
    id: "gpu-tdr-fix",
    title: "Plantage GPU / Ecran noir (TDR)",
    description: "Augmente le delai TDR a 8s pour eviter le crash GPU au milieu d'une partie. Corrige le symptome, pas la cause — mettez vos drivers a jour.",
    category: "Systeme",
    warning: "Ne corrige pas le pilote defaillant — maintenez vos drivers GPU a jour.",
    // TdrDelay=8 est plus conservateur que le tweak gpu-tdr (10) — utilisé ici comme fix de secours
    bat: bat(
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDelay /t REG_DWORD /d 8 /f',
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v TdrDdiDelay /t REG_DWORD /d 8 /f',
    ),
  },
  // ─── Réseau ──────────────────────────────────────────────────────────────────
  {
    id: "network-latency",
    title: "Vitesse internet / Ping eleve",
    description: "Desactive les heuristiques TCP, reinitialise Winsock et vide le cache DNS. Utile apres un changement de reseau ou des pics de ping inexpliques.",
    category: "Reseau",
    warning: "Un redemarrage est necessaire pour finaliser la reinitialisation Winsock.",
    bat: bat(
      // Heuristiques TCP — celles-ci peuvent aggraver les pics de ping
      "netsh int tcp set heuristics disabled",
      // Winsock reset
      "netsh winsock reset",
      // Flush DNS
      "ipconfig /flushdns",
    ),
  },
  // ─── Audio ───────────────────────────────────────────────────────────────────
  {
    id: "audio-fix",
    title: "Audio & Microphone",
    description: "Redemarre les services audio Windows (audiosrv + AudioEndpointBuilder). Corrige le crackling, les coupures ou l'absence de son en jeu.",
    category: "Audio",
    bat: bat(
      "net stop audiosrv",
      "net stop AudioEndpointBuilder",
      // AudioEndpointBuilder doit demarrer en premier
      "net start AudioEndpointBuilder",
      "net start audiosrv",
    ),
  },
  // ─── Peripheriques ───────────────────────────────────────────────────────────
  {
    id: "bluetooth-fix",
    title: "Bluetooth",
    description: "Redemarre le service Bluetooth (bthserv). Resout les problemes de deconnexion ou de peripheriques Bluetooth non detectes.",
    category: "Peripheriques",
    bat: bat(
      "net stop bthserv",
      "net start bthserv",
    ),
  },
  {
    id: "hid-gamepad",
    title: "Manette / Peripherique non detecte",
    description: "Redemarre le service HidServ (Human Interface Device). Resout les problemes de manette, clavier ou souris non reconnus apres un branchement.",
    category: "Peripheriques",
    bat: bat(
      "net stop HidServ",
      "net start HidServ",
    ),
  },
];
