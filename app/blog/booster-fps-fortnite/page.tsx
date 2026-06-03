import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment booster ses FPS sur Fortnite en 2025 — Kermouk Optimizer",
  description: "Guide complet pour booster ses FPS sur Fortnite en 2025 : paramètres graphiques optimaux, tweaks Windows, réseau TCP/IP et optimisations GPU.",
  alternates: { canonical: "https://kermouk.gg/blog/booster-fps-fortnite" },
  keywords: ["booster fps fortnite", "fps fortnite 2025", "optimisation fortnite pc", "tweaks fortnite windows"],
};

export default function ArticleFortniteFps() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-gray-500 text-sm hover:text-orange transition-colors">← Blog</Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-rajdhani font-700 px-2 py-0.5 rounded uppercase tracking-wider text-orange bg-orange/10 border border-orange/20">Fortnite</span>
          <span className="text-xs text-gray-600">8 min de lecture · 3 juin 2025</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-6 leading-tight">
          Comment booster ses FPS sur <span className="gradient-text">Fortnite</span> en 2025
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Les FPS sur Fortnite dépendent de beaucoup plus que de ton GPU. Dans ce guide, on couvre les paramètres graphiques optimaux, les tweaks Windows indispensables et les optimisations réseau pour atteindre les 144+ FPS stables.
        </p>

        <div className="prose-gaming space-y-10">
          <section>
            <h2 className="font-orbitron font-black text-2xl mb-4 text-white">1. Paramètres graphiques optimaux</h2>
            <p className="text-gray-400 mb-4">Le premier levier de FPS est la configuration graphique in-game. Voici les paramètres recommandés pour maximiser les performances :</p>
            <div className="card-gaming p-4 mb-4">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 text-gray-500 font-rajdhani uppercase tracking-wider">Paramètre</th>
                  <th className="text-left py-2 text-orange font-rajdhani uppercase tracking-wider">Valeur recommandée</th>
                </tr></thead>
                <tbody className="text-gray-400">
                  {[
                    ["Résolution", "1920x1080 (Plein écran)"],
                    ["FPS Max", "Illimité"],
                    ["V-Sync", "Désactivé"],
                    ["Qualité 3D", "80-100%"],
                    ["Ombres", "Désactivées"],
                    ["Illumination globale", "Désactivée"],
                    ["Réflexions", "Désactivées"],
                    ["Anti-aliasing", "Désactivé"],
                    ["Textures", "Moyen"],
                    ["Effets", "Bas"],
                    ["Post-traitement", "Bas"],
                  ].map(([param, val]) => (
                    <tr key={param} className="border-b border-border/50">
                      <td className="py-2">{param}</td>
                      <td className="py-2 text-green-400 font-rajdhani font-700">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-4 text-white">2. Tweaks Windows essentiels</h2>
            <p className="text-gray-400 mb-4">Windows n'est pas optimisé par défaut pour le gaming. Ces tweaks suppriment les goulots d'étranglement :</p>
            <ul className="space-y-3">
              {[
                { title: "Désactiver Game Bar & Game DVR", desc: "Libère des ressources CPU/GPU utilisées inutilement par l'overlay Xbox." },
                { title: "Plan d'alimentation Ultimate Performance", desc: "Active le plan caché d'Windows pour éviter le throttling CPU." },
                { title: "Désactiver Core Parking", desc: "Empêche Windows de «garer» des cœurs CPU pendant le jeu." },
                { title: "Désactiver HPET", desc: "Le High Precision Event Timer peut introduire de la latence sur certains systèmes." },
                { title: "Priorité MMCSS Games", desc: "Booste la priorité du processus Fortnite dans le planificateur Windows." },
              ].map(item => (
                <li key={item.title} className="card-gaming p-4 flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B00" className="flex-shrink-0 mt-0.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-rajdhani font-700 text-white mb-1">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-4 text-white">3. Optimisation réseau pour Fortnite</h2>
            <p className="text-gray-400 mb-4">Le ping affecte directement le gameplay. Ces tweaks TCP/IP réduisent la latence réseau :</p>
            <div className="card-gaming p-4 bg-blue-500/5 border border-blue-500/20">
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  "TCP ACK Frequency : force l'acquittement immédiat des paquets",
                  "TCPNoDelay : désactive l'algorithme Nagle (principal responsable de la latence)",
                  "MTU 1472 : taille optimale des paquets pour éviter la fragmentation",
                  "DNS 1.1.1.1 Cloudflare : résolution DNS 3x plus rapide que les DNS opérateurs",
                  "QoS DSCP 46 : prioritise les paquets Fortnite sur ton réseau",
                ].map(tip => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-blue-400 flex-shrink-0">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-4 text-white">4. Résultats attendus</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { metric: "+40%", label: "FPS moyens", color: "#22c55e" },
                { metric: "-30ms", label: "Ping réduit", color: "#FF6B00" },
                { metric: "+60%", label: "FPS 1% Low", color: "#a855f7" },
              ].map(item => (
                <div key={item.label} className="card-gaming p-4 text-center">
                  <div className="font-orbitron font-black text-3xl mb-1" style={{ color: item.color }}>{item.metric}</div>
                  <div className="text-gray-500 text-sm font-rajdhani uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="card-gaming p-8 text-center border border-orange/30 bg-orange/5">
            <h2 className="font-orbitron font-black text-2xl mb-3">Applique tout ça en 1 clic</h2>
            <p className="text-gray-400 mb-6">Kermouk Optimizer applique automatiquement tous ces tweaks — plus besoin de modifier le registre manuellement.</p>
            <Link href="/download" className="btn-orange">Télécharger Gratuitement</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
