import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment réduire son input lag sur PC — Kermouk",
  description: "Guide complet pour réduire l'input lag sur PC gaming : polling rate souris, Hz moniteur, ping réseau, tweaks Windows. Calculez et optimisez votre latence totale.",
  alternates: { canonical: "https://kermouk.gg/blog/reduire-input-lag" },
  keywords: ["réduire input lag pc", "input lag gaming", "polling rate souris", "latence gaming pc"],
};

export default function ArticleInputLag() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-gray-500 text-sm hover:text-orange transition-colors">← Blog</Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-rajdhani font-700 px-2 py-0.5 rounded uppercase tracking-wider text-green-400 bg-green-400/10 border border-green-400/20">Hardware</span>
          <span className="text-xs text-gray-600">10 min de lecture · 20 mai 2025</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-6 leading-tight">
          Comment réduire son <span className="gradient-text">input lag</span> sur PC
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          L'input lag total est la somme de plusieurs délais : souris, GPU, écran, réseau. En dessous de 15ms, vous êtes en territoire pro. Voici comment optimiser chaque composante.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="font-orbitron font-black text-2xl mb-5 text-white">Qu'est-ce que l'input lag ?</h2>
            <p className="text-gray-400 mb-4">L'input lag est le délai entre votre action physique (clic souris, touche clavier) et l'affichage du résultat à l'écran. Il se compose de :</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { component: "Polling souris", typical: "1–8ms", optimal: "0.125ms (8000Hz)" },
                { component: "Rendu GPU", typical: "5–15ms", optimal: "1–5ms (140+ FPS)" },
                { component: "Écran (réponse)", typical: "1–8ms", optimal: "0.5ms GtG" },
                { component: "Réseau (ping/2)", typical: "15–50ms", optimal: "<10ms" },
              ].map(item => (
                <div key={item.component} className="card-gaming p-4">
                  <div className="font-rajdhani font-700 text-white mb-2">{item.component}</div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="text-gray-600">Typique</div>
                      <div className="text-orange font-orbitron font-black">{item.typical}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600">Optimal</div>
                      <div className="text-green-400 font-orbitron font-black">{item.optimal}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-5 text-white">1. Polling rate de la souris</h2>
            <p className="text-gray-400 mb-4">Le polling rate détermine combien de fois par seconde la souris envoie sa position au PC :</p>
            <div className="card-gaming p-4 mb-4">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 text-gray-500 font-rajdhani uppercase">Polling Rate</th>
                  <th className="text-left py-2 text-gray-500 font-rajdhani uppercase">Délai</th>
                  <th className="text-left py-2 text-gray-500 font-rajdhani uppercase">Recommandé</th>
                </tr></thead>
                <tbody className="text-gray-400">
                  {[
                    ["125 Hz", "8ms", "❌ Ancienne souris"],
                    ["500 Hz", "2ms", "⚠️ Minimum acceptable"],
                    ["1000 Hz", "1ms", "✓ Standard gaming"],
                    ["4000 Hz", "0.25ms", "✓✓ Compétitif"],
                    ["8000 Hz", "0.125ms", "✓✓✓ Pro esport"],
                  ].map(([rate, delay, rec]) => (
                    <tr key={rate} className="border-b border-border/50">
                      <td className="py-2 font-orbitron font-black text-orange">{rate}</td>
                      <td className="py-2">{delay}</td>
                      <td className="py-2">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-5 text-white">2. Moniteur : Hz et temps de réponse</h2>
            <p className="text-gray-400 mb-4">Plus le Hz est élevé, plus les frames sont affichées rapidement. Le temps de réponse (GtG) est le délai de changement d'un pixel :</p>
            <ul className="space-y-2">
              {[
                "60 Hz : 16.7ms par frame — frame time trop élevé pour le compétitif",
                "144 Hz : 6.9ms — minimum recommandé pour Fortnite compétitif",
                "240 Hz : 4.2ms — excellent, bonne valeur pour le prix",
                "360 Hz : 2.8ms — pour les pros, gain marginal vs 240",
              ].map(tip => (
                <li key={tip} className="card-gaming p-3 flex gap-2 text-sm text-gray-400">
                  <span className="text-green-400 flex-shrink-0">›</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-5 text-white">3. Tweaks Windows pour réduire l'input lag</h2>
            <div className="space-y-3">
              {[
                { title: "Désactiver V-Sync", desc: "Le V-Sync force la synchronisation sur le Hz de l'écran — il ajoute 1-3 frames de latence.", impact: "Critique" },
                { title: "FPS illimités in-game", desc: "Les FPS caps artificiels augmentent le frame pacing. Laissez le GPU rendre à sa vitesse maximale.", impact: "Élevé" },
                { title: "Mode plein écran exclusif", desc: "Le plein écran dédié bypass le compositeur Windows (DWM) — réduit la latence de 5-10ms.", impact: "Élevé" },
                { title: "NVIDIA Ultra Low Latency", desc: "Mode 'Ultra' dans le panneau NVIDIA = pre-rendu 1 frame seulement, moins de buffering.", impact: "Élevé" },
                { title: "Désactiver Nagle (TCPNoDelay)", desc: "Pour le réseau, l'algorithme Nagle regroupe les petits paquets — désactivez-le pour un ping réactif.", impact: "Réseau" },
              ].map(item => (
                <div key={item.title} className="card-gaming p-4 flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" className="flex-shrink-0 mt-0.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-rajdhani font-700 text-white">{item.title}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-orange/10 border border-orange/20 text-orange">{item.impact}</span>
                    </div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-orbitron font-black text-2xl mb-5 text-white">Input lag total : résumé</h2>
            <div className="card-gaming p-5 text-center border border-green-500/20 bg-green-500/5">
              <p className="text-gray-400 mb-4">Avec les optimisations correctes, un setup 144Hz peut atteindre :</p>
              <div className="font-orbitron font-black text-5xl text-green-400 mb-2">~12ms</div>
              <div className="text-gray-500">d'input lag total — niveau compétitif</div>
            </div>
          </section>

          <div className="card-gaming p-8 text-center border border-orange/30 bg-orange/5">
            <h2 className="font-orbitron font-black text-2xl mb-3">Calcule ton input lag exact</h2>
            <p className="text-gray-400 mb-6">Utilise le calculateur intégré dans Kermouk Optimizer pour mesurer et optimiser ton input lag total.</p>
            <Link href="/download" className="btn-orange">Télécharger Gratuitement</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
