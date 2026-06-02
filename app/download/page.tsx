import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Télécharger Kermouk Optimizer — Gratuit & Premium",
  description:
    "Télécharge Kermouk Optimizer gratuitement pour booster tes FPS sur Fortnite. Version Free et Premium disponibles. Compatible Windows 10 et 11.",
  alternates: { canonical: "https://kermouk.gg/download" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kermouk Optimizer",
  applicationCategory: "GameApplication",
  operatingSystem: "Windows 10, Windows 11",
  downloadUrl: "https://kermouk.gg/download",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <Script
        id="schema-download"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Téléchargement</span>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            CHOISISSEZ VOTRE <span className="gradient-text">VERSION</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            KERMOUK OPTIMIZER fonctionne sur Windows 10 et Windows 11.
            Créez toujours un point de restauration avant d&apos;appliquer des tweaks.
          </p>
        </div>

        {/* Download cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FREE */}
          <div className="card-gaming p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-orbitron font-black text-2xl mb-1">FREE</div>
                <div className="text-gray-400 text-sm">Tweaks de base — Gratuit</div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </div>
            </div>

            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              {[
                "Désactivation Xbox Game Bar",
                "Mode haute performance",
                "Désactivation notifications",
                "Nettoyage fichiers temp",
                "Désactivation Game DVR",
                "Interface complète incluse",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <a
                href="https://github.com/tranoliviermatteopro-bot/kermouk-optimizer/releases/download/v2.0.0/KERMOUK.OPTIMIZER.Setup.2.0.0.exe"
                download
                className="btn-ghost block text-center w-full"
              >
                Télécharger v2.0 FREE (.exe)
              </a>
              <p className="text-xs text-center text-gray-600">
                Windows 10/11 — 64-bit — ~45 MB
              </p>
            </div>
          </div>

          {/* PREMIUM */}
          <div
            className="p-8 rounded-xl flex flex-col"
            style={{ border: "1px solid rgba(255,107,0,0.5)", background: "linear-gradient(135deg, rgba(255,107,0,0.06) 0%, #111 60%)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-orbitron font-black text-2xl mb-1 gradient-text">PREMIUM</div>
                <div className="text-gray-400 text-sm">Tous les tweaks débloqués</div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-orange/10 border border-orange/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>

            <ul className="space-y-2 mb-8 text-sm text-gray-300 flex-1">
              {[
                "Tout FREE inclus",
                "Optimisation TCP/IP avancée",
                "DNS Cloudflare 1.1.1.1",
                "Hardware Scheduling GPU",
                "CPU Priority SchedulingCategory High",
                "Désactivation 10+ services Windows",
                "Tweaks mémoire fsutil",
                "Tweaks Fortnite dédiés",
                "Priorité processus Fortnite",
                "Clé de licence unique (UUID)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B00">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Link href="/payment" className="btn-orange block text-center w-full">
                Acheter Premium — 4,99€/mois
              </Link>
              <p className="text-xs text-center text-gray-500">
                Déjà Premium ?{" "}
                <Link href="/confirmation" className="text-orange hover:underline">
                  Accéder au téléchargement
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="mt-10 card-gaming p-6 flex items-start gap-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <h3 className="font-rajdhani font-700 text-orange mb-1">Sécurité & Fiabilité</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              KERMOUK OPTIMIZER crée automatiquement un point de restauration Windows avant
              chaque session d&apos;optimisation. Tous les tweaks sont réversibles via le bouton
              &quot;Restaurer les paramètres d&apos;origine&quot;. Nécessite des droits Administrateur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
