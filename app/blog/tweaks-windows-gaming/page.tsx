import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Les meilleurs tweaks Windows pour le gaming — Kermouk",
  description: "Guide complet des tweaks Windows pour le gaming : TCP/IP, services, HPET, Core Parking, MMCSS, GPU scheduling. Améliorez vos FPS et réduisez votre latence.",
  alternates: { canonical: "https://kermouk.gg/blog/tweaks-windows-gaming" },
  keywords: ["tweaks windows gaming", "optimisation windows fps", "registre gaming windows", "services windows gaming"],
};

const TWEAKS = [
  {
    category: "CPU & Performance",
    color: "#FF6B00",
    items: [
      { name: "Ultimate Performance Plan", reg: "powercfg -duplicatescheme e9a42b02...", impact: "Élevé", desc: "Active le plan d'alimentation haute performance caché de Windows." },
      { name: "Désactiver Core Parking", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power...", impact: "Élevé", desc: "Empêche Windows de réduire le nombre de cœurs CPU actifs." },
      { name: "Win32PrioritySeparation = 38", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl", impact: "Moyen", desc: "Donne la priorité au processus de premier plan (votre jeu)." },
      { name: "Désactiver HPET", reg: "bcdedit /set useplatformtick yes", impact: "Variable", desc: "Réduit la latence du timer sur Intel récent." },
    ],
  },
  {
    category: "Réseau TCP/IP",
    color: "#3b82f6",
    items: [
      { name: "TCPNoDelay = 1", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", impact: "Élevé", desc: "Désactive l'algorithme Nagle — réduit la latence de 5-20ms." },
      { name: "TcpAckFrequency = 1", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", impact: "Élevé", desc: "Acquittement TCP immédiat — améliore la réactivité réseau." },
      { name: "DefaultTTL = 64", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", impact: "Faible", desc: "Time-to-live optimal pour le routage Internet." },
      { name: "DisableTaskOffload = 1", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters", impact: "Moyen", desc: "Désactive le TCP Chimney Offload — réduit la latence sur certaines cartes." },
    ],
  },
  {
    category: "GPU (NVIDIA)",
    color: "#22c55e",
    items: [
      { name: "Ultra Low Latency Mode", reg: "NVCP : Faible Latence Mode = Ultra", impact: "Élevé", desc: "Réduit le pré-rendu des images à 1 frame — diminue l'input lag." },
      { name: "Power Management = Max", reg: "NVCP : Gestion alimentation = Performances max", impact: "Élevé", desc: "Empêche le GPU de réduire ses fréquences pendant le jeu." },
      { name: "TDR Delay = 60", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", impact: "Stabilité", desc: "Évite les freezes GPU de 2-3 secondes en jeu." },
      { name: "GPU Scheduling (Win11)", reg: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", impact: "Moyen", desc: "Hardware GPU Scheduling — réduit la latence CPU-GPU." },
    ],
  },
];

export default function ArticleWindowsTweaks() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-gray-500 text-sm hover:text-orange transition-colors">← Blog</Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-rajdhani font-700 px-2 py-0.5 rounded uppercase tracking-wider text-blue-400 bg-blue-400/10 border border-blue-400/20">Windows</span>
          <span className="text-xs text-gray-600">12 min de lecture · 28 mai 2025</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-6 leading-tight">
          Les meilleurs tweaks <span className="gradient-text">Windows</span> pour le gaming
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Windows n'est pas optimisé par défaut pour le gaming. Ces tweaks registre et configuration suppriment les goulots d'étranglement logiciels responsables des microbégaiements et de la latence.
        </p>

        <div className="space-y-10">
          <section className="card-gaming p-5 border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex gap-3">
              <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
              <div>
                <div className="font-rajdhani font-700 text-yellow-400 mb-1">Avant de commencer</div>
                <div className="text-gray-400 text-sm">Créez un point de restauration Windows avant de modifier le registre. Kermouk Optimizer le fait automatiquement pour vous.</div>
              </div>
            </div>
          </section>

          {TWEAKS.map(section => (
            <section key={section.category}>
              <h2 className="font-orbitron font-black text-2xl mb-5 flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ background: section.color }} />
                <span style={{ color: section.color }}>{section.category}</span>
              </h2>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div key={item.name} className="card-gaming p-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="font-rajdhani font-700 text-white">{item.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${item.impact === "Élevé" ? "text-green-400 bg-green-400/10 border border-green-400/20" : item.impact === "Moyen" ? "text-orange bg-orange/10 border border-orange/20" : "text-gray-500 bg-gray-500/10 border border-gray-500/20"}`}>
                        Impact : {item.impact}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                    <code className="text-xs text-gray-600 bg-darker px-2 py-1 rounded font-mono block">{item.reg}</code>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="card-gaming p-8 text-center border border-orange/30 bg-orange/5">
            <h2 className="font-orbitron font-black text-2xl mb-3">Applique tout en 1 clic</h2>
            <p className="text-gray-400 mb-6">Kermouk Optimizer applique automatiquement tous ces tweaks en toute sécurité — point de restauration inclus.</p>
            <Link href="/download" className="btn-orange">Télécharger Gratuitement</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
