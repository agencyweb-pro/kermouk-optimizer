import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jeux Compatibles — Kermouk Optimizer",
  description: "Liste complète des jeux optimisés par Kermouk Optimizer : Fortnite, Warzone, Apex Legends, Valorant, CS2, Minecraft et plus.",
  alternates: { canonical: "https://kermouk.gg/compatible" },
};

const GAMES = [
  {
    name: "Fortnite",
    icon: "⚡",
    developer: "Epic Games",
    anticheat: "Easy Anti-Cheat",
    tweaks: ["GameUserSettings.ini automatique", "Priorité processus HIGH", "Cache Epic launcher", "Pipeline caches", "GPU priority 8"],
    gain: "+40% FPS",
    badge: "Optimisation maximale",
    color: "#FF6B00",
  },
  {
    name: "Warzone",
    icon: "🎯",
    developer: "Activision",
    anticheat: "Ricochet Anti-Cheat",
    tweaks: ["TCP ACK Frequency", "TCPNoDelay", "Priorité Battle.net", "Réseau Activision"],
    gain: "+25% FPS",
    badge: "Optimisé",
    color: "#22c55e",
  },
  {
    name: "Apex Legends",
    icon: "🔵",
    developer: "EA / Respawn",
    anticheat: "Easy Anti-Cheat",
    tweaks: ["Launch options +fps_max 0", "Priorité r5apex.exe", "TCP gaming", "Origin/EA App"],
    gain: "+30% FPS",
    badge: "Optimisé",
    color: "#3b82f6",
  },
  {
    name: "Valorant",
    icon: "🔴",
    developer: "Riot Games",
    anticheat: "Vanguard",
    tweaks: ["GPU Priority 8", "Priorité Vanguard safe", "Profil gaming Windows"],
    gain: "+20% FPS",
    badge: "Vanguard compatible",
    color: "#ef4444",
  },
  {
    name: "CS2",
    icon: "🔫",
    developer: "Valve",
    anticheat: "VAC",
    tweaks: ["Launch options -high -novid", "TCP gaming", "Tickrate 128", "Priorité cs2.exe"],
    gain: "+15% FPS",
    badge: "Optimisé",
    color: "#f59e0b",
  },
  {
    name: "Minecraft",
    icon: "🟩",
    developer: "Mojang",
    anticheat: "Aucun",
    tweaks: ["JVM G1GC args", "Xms2G Xmx6G", "ParallelRefProc", "UnlockExperimentalVM"],
    gain: "+50% FPS",
    badge: "Optimisé",
    color: "#22c55e",
  },
];

const ANTI_CHEATS = [
  { name: "Easy Anti-Cheat", games: "Fortnite, Apex", status: "Compatible", color: "#22c55e" },
  { name: "Vanguard (Riot)", games: "Valorant", status: "Compatible", color: "#22c55e" },
  { name: "Ricochet", games: "Warzone", status: "Compatible", color: "#22c55e" },
  { name: "VAC (Valve)", games: "CS2, DOTA 2", status: "Compatible", color: "#22c55e" },
  { name: "BattlEye", games: "PUBG, R6", status: "Compatible", color: "#22c55e" },
];

export default function CompatiblePage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Compatibilité</span>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            JEUX <span className="gradient-text">COMPATIBLES</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Kermouk Optimizer modifie <strong className="text-white">uniquement les paramètres Windows</strong> — jamais les fichiers du jeu. 100% compatible avec tous les anti-cheat.
          </p>
        </div>

        {/* Anti-cheat badges */}
        <div className="card-gaming p-6 mb-10 border border-green-500/20 bg-green-500/5">
          <h2 className="font-rajdhani font-700 text-green-400 uppercase tracking-wider mb-4">Compatibilité Anti-Cheat</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ANTI_CHEATS.map(ac => (
              <div key={ac.name} className="text-center p-3 bg-darker rounded-lg border border-border">
                <div className="text-green-400 font-bold text-sm mb-1">✓ {ac.status}</div>
                <div className="text-white text-sm font-rajdhani font-700">{ac.name}</div>
                <div className="text-gray-600 text-xs mt-1">{ac.games}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {GAMES.map(game => (
            <div key={game.name} className="card-gaming p-6" style={{ borderColor: `${game.color}22` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{game.icon}</span>
                <div>
                  <div className="font-rajdhani font-700 text-xl">{game.name}</div>
                  <div className="text-gray-500 text-xs">{game.developer}</div>
                </div>
                <div className="ml-auto font-orbitron font-black text-sm" style={{ color: game.color }}>{game.gain}</div>
              </div>

              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: `${game.color}11`, border: `1px solid ${game.color}22` }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={game.color} strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-xs" style={{ color: game.color }}>Anti-cheat : {game.anticheat}</span>
              </div>

              <ul className="space-y-1.5">
                {game.tweaks.map(t => (
                  <li key={t} className="flex items-center gap-2 text-xs text-gray-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={game.color}>
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Why it's safe */}
        <div className="card-gaming p-8 text-center">
          <h2 className="font-orbitron font-black text-2xl mb-4">Pourquoi c'est <span className="text-green-400">100% légal</span> ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Kermouk Optimizer ne touche jamais aux fichiers des jeux. Il optimise Windows : registre, services, réseau TCP/IP, priorités processus. C'est exactement ce que font les joueurs pro manuellement — nous l'automatisons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "✓", title: "Fichiers jeux intacts", desc: "Nous ne modifions aucun .exe, .dll ou fichier du jeu" },
              { icon: "✓", title: "Windows uniquement", desc: "Registre, services, config réseau — 100% Windows natif" },
              { icon: "✓", title: "Point de restauration", desc: "Backup automatique avant chaque optimisation" },
            ].map(item => (
              <div key={item.title} className="p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
                <div className="text-green-400 text-xl font-black mb-2">{item.icon}</div>
                <div className="font-rajdhani font-700 text-sm uppercase tracking-wider mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/download" className="btn-orange">Télécharger Kermouk Optimizer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
