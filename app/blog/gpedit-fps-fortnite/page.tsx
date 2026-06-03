import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment utiliser gpedit.msc pour booster ses FPS Fortnite — Kermouk",
  description: "Guide complet pour utiliser les stratégies de groupe (gpedit.msc) afin d'optimiser Windows pour Fortnite : bande passante, VBS, Power Throttling, QoS DSCP 46.",
  alternates: { canonical: "https://kermouk.gg/blog/gpedit-fps-fortnite" },
  keywords: ["gpedit fps fortnite", "group policy gaming", "gpedit.msc optimisation", "stratégie groupe windows gaming", "VBS désactiver fps"],
};

const TWEAKS = [
  {
    title: "1. Récupérer 20% de bande passante (NonBestEffortLimit)",
    color: "#3b82f6",
    why: "Windows réserve par défaut 20% de ta bande passante pour les services système QoS. Ce paramètre était utile en 2001 sur des modems 56k — en 2025, il ne sert à rien sur Fibre/câble.",
    path: "Computer Configuration > Windows Settings > Policy-based QoS",
    reg: `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Psched" /v NonBestEffortLimit /t REG_DWORD /d 0 /f`,
    gain: "+20% bande passante disponible",
    reboot: false,
  },
  {
    title: "2. QoS DSCP 46 pour Fortnite",
    color: "#3b82f6",
    why: "Le marquage DSCP 46 signale aux routeurs que les paquets de Fortnite sont prioritaires. Sur les routeurs QoS-aware (Freebox, Livebox récente), cela réduit le ping de 10-20ms.",
    path: "Computer Configuration > Windows Settings > Policy-based QoS",
    reg: `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /v "Application" /t REG_SZ /d "FortniteClient-Win64-Shipping.exe" /f\nreg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\QoS\\Fortnite" /v "DSCP Value" /t REG_SZ /d "46" /f`,
    gain: "-15 à -20ms ping",
    reboot: false,
  },
  {
    title: "3. Désactiver Power Throttling CPU",
    color: "#FF6B00",
    why: "Windows 10/11 bride automatiquement les processus qu'il juge \"peu prioritaires\" pour économiser l'énergie. Fortnite en arrière-plan lors d'un alt-tab, ou même en jeu sur certains CPU, peut être affecté.",
    path: "Computer Configuration > System > Power Management > Power Throttling Settings",
    reg: `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f`,
    gain: "+10-15% FPS (CPU throttlé)",
    reboot: true,
  },
  {
    title: "4. Désactiver VBS / Memory Integrity",
    color: "#ef4444",
    why: "Virtualization-Based Security (VBS) isole une partie du kernel Windows dans une machine virtuelle pour le protéger. Très utile en entreprise, mais sur un PC gaming dédié, ça coûte 5 à 15% de FPS selon le CPU.",
    path: "Computer Configuration > System > Device Guard > Turn On Virtualization Based Security = Disabled",
    reg: `reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v EnableVirtualizationBasedSecurity /t REG_DWORD /d 0 /f`,
    gain: "+5-15% FPS",
    reboot: true,
    warning: "Ne désactivez pas VBS sur un PC de travail ou partagé — uniquement sur un PC gaming dédié.",
  },
  {
    title: "5. Désactiver Delivery Optimization (P2P Updates)",
    color: "#22c55e",
    why: "Par défaut, votre PC partage des morceaux de mises à jour Windows avec d'autres PC sur Internet en upload. Cela consomme de la bande passante montante pendant que vous jouez.",
    path: "Computer Configuration > Windows Components > Delivery Optimization",
    reg: `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f`,
    gain: "+Upload disponible",
    reboot: false,
  },
  {
    title: "6. Télémétrie zéro",
    color: "#22c55e",
    why: "Windows envoie continuellement des données diagnostiques à Microsoft. Même au niveau minimum, cela génère des connexions réseau et du CPU background. AllowTelemetry=0 coupe tout.",
    path: "Computer Configuration > Windows Components > Data Collection",
    reg: `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f`,
    gain: "-CPU/réseau background",
    reboot: false,
  },
];

export default function ArticleGpeditFps() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-gray-500 text-sm hover:text-orange transition-colors">← Blog</Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-rajdhani font-700 px-2 py-0.5 rounded uppercase tracking-wider text-orange bg-orange/10 border border-orange/20">GPO</span>
          <span className="text-xs text-gray-600">11 min de lecture · 3 juin 2026</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-6 leading-tight">
          Comment utiliser <span className="gradient-text">gpedit.msc</span> pour booster ses FPS Fortnite
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Les stratégies de groupe Windows (Group Policy) contiennent des optimisations gaming que 99% des joueurs ignorent.
          Voici les 6 tweaks GPO qui font vraiment la différence sur Fortnite en 2025/2026.
        </p>

        <div className="card-gaming p-5 mb-10 border border-blue-500/20 bg-blue-500/5">
          <div className="font-rajdhani font-700 text-blue-400 mb-2 uppercase tracking-wider text-sm">Windows Home — pas de gpedit ?</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Windows Home n'inclut pas gpedit.msc par défaut, mais les packages sont présents dans les fichiers système.
            Kermouk Optimizer peut l'installer automatiquement via DISM. Sinon, les tweaks s'appliquent directement via le registre — même effet, sans ouvrir gpedit.
          </p>
        </div>

        <div className="space-y-10">
          {TWEAKS.map((tweak, i) => (
            <section key={i}>
              <h2 className="font-orbitron font-black text-xl mb-4 flex items-center gap-3">
                <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: tweak.color }} />
                <span className="text-white">{tweak.title}</span>
              </h2>

              <div className="space-y-3">
                <div className="card-gaming p-4">
                  <div className="font-rajdhani font-700 text-xs uppercase tracking-wider text-gray-500 mb-2">Pourquoi ça marche</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{tweak.why}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="card-gaming p-4">
                    <div className="font-rajdhani font-700 text-xs uppercase tracking-wider text-gray-600 mb-1">Chemin gpedit</div>
                    <code className="text-xs text-gray-500 leading-relaxed block">{tweak.path}</code>
                  </div>
                  <div className="card-gaming p-4 flex flex-col justify-between">
                    <div>
                      <div className="font-rajdhani font-700 text-xs uppercase tracking-wider text-gray-600 mb-1">Gain</div>
                      <div className="font-orbitron font-black text-sm" style={{ color: tweak.color }}>{tweak.gain}</div>
                    </div>
                    {tweak.reboot && (
                      <div className="mt-3 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1">
                        Redémarrage requis
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-rajdhani font-700 text-xs uppercase tracking-wider text-gray-600 mb-2">Équivalent registre</div>
                  <pre className="bg-darker border border-border rounded-lg p-4 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap">{tweak.reg}</pre>
                </div>

                {tweak.warning && (
                  <div className="card-gaming p-4 border-red-500/20 bg-red-500/5">
                    <div className="flex gap-2 text-sm text-red-400">
                      <span className="flex-shrink-0">⚠</span>
                      {tweak.warning}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-4 text-white">Résultats cumulés attendus</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { metric: "Bande passante", gain: "+20%", color: "#3b82f6" },
                { metric: "FPS (VBS off)", gain: "+15%", color: "#FF6B00" },
                { metric: "Ping réseau", gain: "-20ms", color: "#22c55e" },
                { metric: "Input lag", gain: "-21%", color: "#22c55e" },
                { metric: "CPU usage jeu", gain: "-44%", color: "#a855f7" },
                { metric: "FPS (Throttling)", gain: "+10%", color: "#FF6B00" },
              ].map(item => (
                <div key={item.metric} className="card-gaming p-4 text-center">
                  <div className="font-orbitron font-black text-2xl mb-1" style={{ color: item.color }}>{item.gain}</div>
                  <div className="text-gray-500 text-xs font-rajdhani uppercase tracking-wider">{item.metric}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="card-gaming p-8 text-center border border-orange/30 bg-orange/5">
            <h2 className="font-orbitron font-black text-2xl mb-3">Applique tous ces tweaks en 1 clic</h2>
            <p className="text-gray-400 mb-6">
              Kermouk Optimizer v2.4.0 applique tous ces tweaks GPO automatiquement — scan de l'état actuel, point de restauration, et application en 1 clic.
            </p>
            <Link href="/download" className="btn-orange">Télécharger Kermouk Optimizer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
