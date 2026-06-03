import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Guides gaming, tweaks Windows et FPS Boost",
  description: "Guides et tutoriels pour booster tes FPS sur Fortnite, optimiser Windows pour le gaming et réduire l'input lag sur PC.",
  alternates: { canonical: "https://kermouk.gg/blog" },
};

const ARTICLES = [
  {
    slug: "booster-fps-fortnite",
    title: "Comment booster ses FPS sur Fortnite en 2025",
    excerpt: "Découvrez les meilleurs tweaks Windows, paramètres graphiques et optimisations réseau pour maximiser vos FPS sur Fortnite Chapter 5.",
    category: "Fortnite",
    readTime: "8 min",
    date: "3 juin 2025",
    color: "#FF6B00",
  },
  {
    slug: "tweaks-windows-gaming",
    title: "Les meilleurs tweaks Windows pour le gaming",
    excerpt: "TCP/IP, services Windows, priorité processus, HPET, Core Parking — le guide complet des tweaks Windows pour les joueurs PC.",
    category: "Windows",
    readTime: "12 min",
    date: "28 mai 2025",
    color: "#3b82f6",
  },
  {
    slug: "reduire-input-lag",
    title: "Comment réduire son input lag sur PC",
    excerpt: "Polling rate souris, fréquence moniteur, temps de réponse, ping réseau — tout ce que vous devez savoir pour minimiser votre input lag.",
    category: "Hardware",
    readTime: "10 min",
    date: "20 mai 2025",
    color: "#22c55e",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Blog</span>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            GUIDES <span className="gradient-text">GAMING</span>
          </h1>
          <p className="text-gray-400 text-lg">Tutoriels, tweaks et conseils pour dominer sur PC</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="card-gaming p-6 block hover:border-orange/40 transition-colors group">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-rajdhani font-700 px-2 py-0.5 rounded uppercase tracking-wider" style={{ color: article.color, background: `${article.color}15`, border: `1px solid ${article.color}25` }}>
                  {article.category}
                </span>
                <span className="text-xs text-gray-600">{article.readTime} de lecture</span>
              </div>
              <h2 className="font-orbitron font-black text-lg mb-3 group-hover:text-orange transition-colors leading-tight">{article.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{article.date}</span>
                <span className="text-orange text-sm font-rajdhani font-700">Lire →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
