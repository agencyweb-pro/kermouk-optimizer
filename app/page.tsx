import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import AnimatedCounter from "@/components/AnimatedCounter";
import ExitIntent from "@/components/ExitIntent";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Kermouk Optimizer — Tweaks Fortnite & Windows #1",
  description:
    "Kermouk Optimizer, les meilleurs tweaks pour booster ton FPS sur Fortnite. Optimisation Windows, réseau, GPU. Version gratuite et premium disponibles.",
  alternates: { canonical: "https://kermouk.gg/" },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kermouk Optimizer",
  applicationCategory: "GameApplication",
  operatingSystem: "Windows 10, Windows 11",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      name: "Version Gratuite",
    },
    {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "EUR",
      name: "Premium Mensuel",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      price: "29.99",
      priceCurrency: "EUR",
      name: "Premium À Vie",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "50000",
    bestRating: "5",
    worstRating: "1",
  },
  description:
    "Kermouk Optimizer est le meilleur optimizer gaming pour Fortnite. Tweaks réseau TCP/IP, GPU, CPU, services Windows et optimisations spécifiques Fortnite pour maximiser les FPS et réduire la latence.",
  url: "https://kermouk.gg",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kermouk Optimizer",
  url: "https://kermouk.gg",
  description: "Optimizer gaming #1 pour Fortnite sur Windows.",
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que Kermouk Optimizer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kermouk Optimizer est un logiciel gratuit qui applique des tweaks Windows pour booster les FPS et réduire le ping sur Fortnite. Il optimise le réseau TCP/IP, le GPU, le CPU et les services Windows.",
      },
    },
    {
      "@type": "Question",
      name: "Kermouk Optimizer est-il sûr ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Kermouk Optimizer crée un point de restauration Windows avant chaque optimisation. Tous les tweaks sont réversibles avec le bouton 'Restaurer les paramètres d'origine'.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte Kermouk Optimizer Premium ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kermouk Optimizer Premium coûte 4,99€ par mois ou 29,99€ en licence à vie. La version de base est entièrement gratuite.",
      },
    },
    {
      "@type": "Question",
      name: "Kermouk Optimizer booste-t-il vraiment les FPS Fortnite ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Les tweaks Kermouk apportent en moyenne +40% de FPS et -30ms de latence sur Fortnite selon les retours de plus de 50 000 joueurs.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <ExitIntent />
      <Hero />
      <Features />
      <AnimatedCounter />
      <Testimonials />
      <Pricing />

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-block badge-premium mb-4">Commencez maintenant</div>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-6">
            PRÊT À DOMINER <span className="gradient-text">FORTNITE</span> ?
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-inter">
            Rejoignez des milliers de joueurs qui ont déjà boosté leurs performances avec
            KERMOUK OPTIMIZER. Version gratuite disponible immédiatement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/download" className="btn-orange text-center">
              Télécharger Gratuitement
            </a>
            <a href="/payment" className="btn-ghost text-center">
              Passer Premium — 4,99€/mois
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
