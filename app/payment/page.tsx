"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const PayPalCheckout = dynamic(() => import("@/components/PayPalButton"), { ssr: false });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Kermouk Optimizer Premium",
  description:
    "Débloquez tous les tweaks avancés : réseau TCP/IP, GPU Hardware Scheduling, CPU Priority, services Windows, tweaks Fortnite.",
  brand: { "@type": "Brand", name: "Kermouk Optimizer" },
  offers: [
    {
      "@type": "Offer",
      name: "Premium Mensuel",
      price: "4.99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://kermouk.gg/payment",
    },
    {
      "@type": "Offer",
      name: "Premium À Vie",
      price: "29.99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://kermouk.gg/payment",
    },
  ],
};

export default function PaymentPage() {
  const [plan, setPlan] = useState<"monthly" | "lifetime">("monthly");
  const router = useRouter();

  const handleSuccess = useCallback(
    (licenseKey: string) => {
      router.push(`/confirmation?key=${licenseKey}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge-premium mb-4 inline-block">Paiement Sécurisé</span>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-3">
            PASSER <span className="gradient-text">PREMIUM</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Tous vos tweaks premium débloqués immédiatement après paiement.
          </p>
        </div>

        {/* Plan selector */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setPlan("monthly")}
            className={`flex-1 p-4 rounded-xl border transition-all text-left ${
              plan === "monthly"
                ? "border-orange bg-orange/10 text-white"
                : "border-border bg-card text-gray-400 hover:border-orange/50"
            }`}
          >
            <div className="font-rajdhani font-700 text-lg">Mensuel</div>
            <div className="font-orbitron font-900 text-2xl text-orange">4,99€</div>
            <div className="text-xs text-gray-500 mt-1">par mois — résiliable</div>
          </button>

          <button
            onClick={() => setPlan("lifetime")}
            className={`flex-1 p-4 rounded-xl border transition-all text-left relative ${
              plan === "lifetime"
                ? "border-orange bg-orange/10 text-white"
                : "border-border bg-card text-gray-400 hover:border-orange/50"
            }`}
          >
            <div className="absolute -top-2 left-4 badge-premium text-xs">Meilleur prix</div>
            <div className="font-rajdhani font-700 text-lg mt-1">À vie</div>
            <div className="font-orbitron font-900 text-2xl text-orange">29,99€</div>
            <div className="text-xs text-gray-500 mt-1">paiement unique — économisez 70%</div>
          </button>
        </div>

        {/* Order summary */}
        <div className="card-gaming p-5 mb-6">
          <div className="font-rajdhani font-700 uppercase tracking-wider text-xs text-gray-400 mb-3">
            Récapitulatif
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">KERMOUK OPTIMIZER Premium</span>
            <span className="font-rajdhani font-700 text-orange">
              {plan === "monthly" ? "4,99€/mois" : "29,99€"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Plan {plan === "monthly" ? "Mensuel" : "À vie"}</span>
            <span>TVA incluse</span>
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="font-700 font-rajdhani">Total</span>
            <span className="font-orbitron font-900 text-white">
              {plan === "monthly" ? "4,99€" : "29,99€"}
            </span>
          </div>
        </div>

        {/* Included features */}
        <div className="card-gaming p-5 mb-8">
          <div className="font-rajdhani font-700 uppercase tracking-wider text-xs text-gray-400 mb-3">
            Inclus dans Premium
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Tous les tweaks Réseau TCP/IP",
              "Optimisation GPU & Hardware Scheduling",
              "CPU Priority & Mémoire avancée",
              "Tweaks Fortnite dédiés",
              "Clé de licence UUID unique",
              "Mises à jour gratuites à vie",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B00">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* PayPal button */}
        <div className="mb-6">
          <div className="font-rajdhani font-700 uppercase tracking-wider text-xs text-gray-400 mb-3 text-center">
            Payer via PayPal
          </div>
          <PayPalCheckout plan={plan} onSuccess={handleSuccess} />
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Paiement 100% sécurisé via PayPal — Satisfait ou remboursé 7 jours
        </div>
      </div>
    </div>
  );
}
