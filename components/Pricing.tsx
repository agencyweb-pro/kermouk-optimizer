"use client";

import Link from "next/link";

const freeTweaks = [
  "Désactivation Xbox Game Bar",
  "Mode haute performance Windows",
  "Désactivation notifications",
  "Nettoyage fichiers temporaires",
  "Désactivation Game DVR",
];

const premiumTweaks = [
  "Tout le contenu FREE inclus",
  "Optimisation TCP/IP complète",
  "DNS Cloudflare 1.1.1.1",
  "Hardware Scheduling GPU",
  "Désactivation HPET",
  "CPU Priority Gaming",
  "Désactivation 10+ services inutiles",
  "Optimisation mémoire avancée",
  "Tweaks Fortnite dédiés",
  "Priorité processus Fortnite",
  "Support prioritaire",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 relative">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,107,0,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Tarifs</span>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            CHOISISSEZ VOTRE <span className="gradient-text">PLAN</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mt-4">
            Commencez gratuitement, passez Premium quand vous êtes prêt à dominer.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free */}
          <div className="card-gaming p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-gray-400 font-rajdhani uppercase tracking-widest text-sm mb-2">Plan</div>
              <div className="font-orbitron font-black text-3xl">FREE</div>
              <div className="mt-4">
                <span className="font-orbitron font-900 text-5xl">0€</span>
                <span className="text-gray-400 ml-2">pour toujours</span>
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {freeTweaks.map((tweak) => (
                <li key={tweak} className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tweak}
                </li>
              ))}
            </ul>

            <Link href="/download?plan=free" className="btn-ghost text-center block">
              Télécharger Gratuitement
            </Link>
          </div>

          {/* Premium */}
          <div className="relative p-8 flex flex-col rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,107,0,0.5)" }}>
            {/* Glow background */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(10,10,10,1) 60%)",
              }}
            />

            {/* Popular badge */}
            <div className="absolute top-4 right-4 badge-premium text-xs">Le plus populaire</div>

            <div className="mb-6">
              <div className="text-orange font-rajdhani uppercase tracking-widest text-sm mb-2">Plan</div>
              <div className="font-orbitron font-black text-3xl gradient-text">PREMIUM</div>

              {/* Pricing toggle */}
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-orbitron font-900 text-5xl">4,99€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
                <div className="text-gray-500 text-sm">
                  ou{" "}
                  <span className="text-orange font-600">29,99€ à vie</span>{" "}
                  (économisez 70%)
                </div>
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {premiumTweaks.map((tweak, i) => (
                <li key={tweak} className={`flex items-center gap-3 text-sm ${i === 0 ? "text-orange font-600" : "text-gray-300"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B00">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tweak}
                </li>
              ))}
            </ul>

            <Link href="/payment" className="btn-orange text-center block animate-glow-pulse">
              Obtenir Premium
            </Link>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-10 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Paiement sécurisé PayPal — Satisfait ou remboursé 7 jours
        </div>
      </div>
    </section>
  );
}
