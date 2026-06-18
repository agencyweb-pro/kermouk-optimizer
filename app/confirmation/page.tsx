"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function ConfirmationContent() {
  const params = useSearchParams();
  const keyFromUrl = params.get("key");
  const [copied, setCopied] = useState(false);

  const storedRaw =
    typeof window !== "undefined" ? localStorage.getItem("kermouk_license") : null;
  const stored = storedRaw ? JSON.parse(storedRaw) : null;
  const licenseKey = keyFromUrl || stored?.key || null;
  const plan = stored?.plan || "premium";
  const email = stored?.email || "";

  const copyKey = async () => {
    if (!licenseKey) return;
    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!licenseKey) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron font-black text-3xl mb-4">
            Aucun paiement <span className="gradient-text">détecté</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Vous n&apos;avez pas encore effectué de paiement.
          </p>
          <Link href="/payment" className="btn-orange">
            Passer Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-lg mx-auto px-6">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="badge-premium mb-4 inline-block">Paiement validé</span>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-3">
            BIENVENUE DANS <span className="gradient-text">PREMIUM</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Votre licence a été générée.{" "}
            {email && (
              <span>Un email de confirmation a été envoyé à <strong className="text-white">{email}</strong>.</span>
            )}
          </p>
        </div>

        {/* License key */}
        <div
          className="p-6 rounded-xl mb-8"
          style={{ border: "1px solid rgba(255,107,0,0.4)", background: "rgba(255,107,0,0.05)" }}
        >
          <div className="font-rajdhani font-700 uppercase tracking-wider text-xs text-orange mb-3">
            Votre clé de licence
          </div>
          <div className="font-orbitron text-sm text-white break-all bg-darker p-4 rounded-lg border border-border mb-3 select-all">
            {licenseKey}
          </div>
          <button
            onClick={copyKey}
            className={`w-full py-2 rounded-lg border text-sm font-rajdhani font-700 uppercase tracking-wider transition-all ${
              copied
                ? "border-green-500 text-green-400 bg-green-500/10"
                : "border-orange/50 text-orange hover:bg-orange/10"
            }`}
          >
            {copied ? "✓ Copié !" : "Copier la clé"}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Conservez cette clé précieusement. Elle permet de déverrouiller l&apos;application.
          </p>
        </div>

        {/* Plan info */}
        <div className="card-gaming p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Plan souscrit</span>
            <span className="font-rajdhani font-700 text-orange uppercase">
              {plan === "lifetime" ? "À Vie" : "Mensuel"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Date d&apos;achat</span>
            <span className="text-sm text-white">
              {stored?.purchaseDate
                ? new Date(stored.purchaseDate).toLocaleDateString("fr-FR")
                : new Date().toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="card-gaming p-5 mb-8">
          <div className="font-rajdhani font-700 uppercase tracking-wider text-xs text-gray-400 mb-4">
            Comment activer votre licence
          </div>
          <ol className="space-y-3 text-sm text-gray-300">
            {[
              "Téléchargez KERMOUK OPTIMIZER ci-dessous",
              "Lancez l'application en tant qu'Administrateur",
              "Cliquez sur \"Entrer ma clé de licence\"",
              "Collez votre UUID ci-dessus",
              "Tous les tweaks Premium sont maintenant débloqués !",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-orbitron">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Download button */}
        <a
          href="https://github.com/tranoliviermatteopro-bot/kermouk-optimizer/releases/download/v3.0.1/KERMOUK.OPTIMIZER.Setup.3.0.1.exe"
          download
          className="btn-orange block text-center w-full mb-4 animate-glow-pulse"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Télécharger KERMOUK OPTIMIZER Premium
          </span>
        </a>

        <Link href="/" className="btn-ghost block text-center w-full">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 flex items-center justify-center">
          <div className="text-orange font-orbitron animate-pulse">Chargement...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
