# Changelog — KERMOUK OPTIMIZER

## [3.0.0] - 2026-06-18

### Nouveautés

#### Navigation & Architecture
- Restructuration complète de la navigation en 2 groupes : TOOLS (Home, Backups, Fixes) et OPTIMIZE (General, Hardware, Debloat, Network, Pre-Launch Fortnite, Advanced)
- Architecture professionnelle à panneaux latéraux avec icônes dédiées par section

#### Système Backup / Restore natif
- Sauvegarde complète du registre Windows (40+ clés) et état des services avant chaque application de tweaks
- Restore en un clic depuis la page Backups
- Garde-fou SysMain : le service n'est jamais restauré à l'état "désactivé" même si le backup le contient
- Backup nommé automatiquement avant les presets (ex : "Avant preset Basic Services")

#### Catalogue Fixes (9 correctifs)
- EasyAntiCheat — réparation et vérification intégrité
- Audio — réinstallation pilotes et réinitialisation stack
- Bluetooth — redémarrage pile Bluetooth
- Réseau — réinitialisation TCP/IP, Winsock, cache DNS
- GPU TDR — ajustement délai timeout pilote graphique
- DirectX — réenregistrement composants DirectX/VC++
- Windows Update — réparation composants et cache
- Corruption système — scan SFC + DISM Health
- Performances globales — nettoyage temporaires + recalibrage indexation

#### Tweaks Hardware — GPU
- Désactivation HDCP (réduction latence encodage)
- Désactivation DMA Remapping (GPU)
- Activation mémoire GPU contiguë

#### Tweaks Hardware — CPU
- Désactivation C-States processeur
- Désactivation Core Parking
- Désactivation Power Throttling

#### Tweaks Hardware — RAM
- Configuration Page File en taille fixe
- Désactivation Memory Compression
- Désactivation Prefetcher

#### Tweaks Hardware — Périphériques
- Souris en mode 1:1 raw input (désactivation EnhancePointerPrecision)
- Désactivation accélération souris
- Désactivation Sticky Keys / Filter Keys / Toggle Keys

#### Tweaks Hardware — Stockage
- Désactivation DIPM/HIPM SSD (latence accès disque)
- Désactivation mise en veille SSD

#### Tweaks General — Core
- Game Mode Windows
- Xbox Game Bar désactivation
- Hung App timeout réduit
- Win32 Priority Separation optimisé

#### Tweaks General — Privacy (14 tweaks)
- Activity Feed, Advertising ID, Campagne CEIP
- Diagnostic Data (Warning — réduction collecte)
- DiagTrack service (Warning)
- Compatibility Telemetry (Warning)
- Error Reporting, Feedback Hub, Help Experience
- Inventory Collector, Location Tracking (Warning)
- Remote Assistance, Timeline/Activity History

#### Tweaks General — QOL (16 tweaks)
- Raccourci Panneau de configuration sur le Bureau
- Boîte de dialogue Alt+F4 classique sur le Bureau
- Icônes systray classiques (horloge, réseau, volume)
- Désactivation Snap Layouts
- Suppression suggestions dans le menu Démarrer
- Transparence de la barre des tâches
- Désactivation tips et astuces Windows
- Qualité JPEG des fonds d'écran à 100%
- NumLock activé au démarrage
- Désactivation actions suggérées du presse-papiers
- Affichage des extensions de fichiers
- Affichage des fichiers cachés
- Win11 uniquement : menu contextuel classique (clic droit)
- Win11 uniquement : suppression Teams Chat de la taskbar
- Win11 uniquement : suppression widget Météo/Actualités

#### Section Network complète (4 sous-onglets)
- **Tweaks TCP** : Nagle, NCSI, NetBIOS, autotune TCP, RSS, TCP Chimney, WiFi sleep, Winsock, Delivery Optimization, DNS, QoS, interrupt affinity, heuristiques TCP, LSO désactivation
- **Adapter Tuner WiFi/Ethernet** : détection automatique des adaptateurs actifs, preset optimisé (U-APSD, EEE, Roaming Aggressiveness, Wake-on-LAN, Interrupt Moderation, Packet Coalescing, LSO v2), Ethernet ajoute Flow Control + Jumbo Packet, backup JSON restaurable
- **Bufferbloat** : preset Normal (autotune=normal, cubic) et preset Ultra Low Gaming (autotune=highlyrestricted, heuristiques désactivées, CTCP) avec indicateurs visuels ●●●●●
- **QoS Fortnite** : création/suppression règles NetQosPolicy DSCP 46 EF, détection automatique chemin exécutable Fortnite, tableau des règles actives avec suppression à la demande

#### Débloat — Services preset Basic
- 11 services mis en démarrage Manuel ou Désactivé : DiagTrack, dmwappushservice, SensorService, lfsvc, MicrosoftEdgeElevationService, edgeupdate, edgeupdatem, WMPNetworkSvc, RemoteRegistry, MapsBroker, RetailDemo
- Backup automatique nommé avant application
- Tweaks services individuels conservés en dessous

### Corrections

- **Priorité processus Fortnite repassée à Normal** (était incorrectement définie à High — susceptible de causer des freezes sur certains systèmes)
- **Chemins backup avec espaces** dans le nom d'utilisateur Windows — les scripts PowerShell utilisent maintenant des chemins entre guillemets partout
- **Auto-updater** : guard `app.isPackaged` + try/catch complet pour éviter les crashes au lancement en mode développement
- **Commandes réseau corrigées** : `netsh int tcp set heuristics` (subcommande séparée, pas `set global heuristics`) et `netsh int tcp set supplemental template=internet congestionprovider=*` (pas `set global congestionprovider`)

---

## [2.2.0] - 2025-01-15

- GPO & Politique Système (12 tweaks, scan status, QoS DSCP46, VBS, Power Throttling)
- Auto-updater depuis GitHub Releases
- Input Lag Calculator, Benchmark, Game Profiles, Cleaner, Streaming Mode
- Smart Notifications, Driver Detection, Anti-Cheat badges

## [2.1.0] - 2024-12-10

- Guide BIOS et Overclocking GPU/CPU

## [2.0.0] - 2024-11-20

- Release initiale publique
