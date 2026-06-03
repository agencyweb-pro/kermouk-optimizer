import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Kermouk Optimizer est-il légal et sûr ?",
  description: "Questions fréquentes sur Kermouk Optimizer : légalité, anti-cheat, performances, remboursement, compatibilité Windows.",
  alternates: { canonical: "https://kermouk.gg/faq" },
};

const FAQS = [
  {
    category: "Légalité & Sécurité",
    color: "#22c55e",
    items: [
      {
        q: "Kermouk Optimizer est-il légal ?",
        a: "Oui, totalement. Kermouk Optimizer modifie uniquement les paramètres Windows (registre, services, configuration réseau). Il ne touche jamais aux fichiers des jeux. C'est exactement ce que les joueurs professionnels font manuellement — nous l'automatisons.",
      },
      {
        q: "Suis-je risqué de ban avec Kermouk Optimizer ?",
        a: "Non. Les tweaks appliqués par Kermouk sont au niveau système Windows, pas au niveau du jeu. Easy Anti-Cheat, Vanguard, Ricochet et VAC analysent les processus et fichiers du jeu — pas les paramètres Windows. Des milliers de joueurs utilisent Kermouk sans aucun problème.",
      },
      {
        q: "Est-ce que Kermouk peut endommager mon PC ?",
        a: "Non. Avant chaque session d'optimisation, Kermouk crée automatiquement un point de restauration Windows. Si quelque chose ne te convient pas, tu peux annuler tous les changements en un clic depuis les Paramètres Windows > Restauration du système.",
      },
      {
        q: "Kermouk fonctionne-t-il sur Windows 11 ?",
        a: "Oui, Kermouk Optimizer est entièrement compatible Windows 10 (20H2+) et Windows 11. Il nécessite des droits Administrateur pour appliquer les tweaks.",
      },
    ],
  },
  {
    category: "Performances",
    color: "#FF6B00",
    items: [
      {
        q: "Combien de FPS vais-je gagner sur Fortnite ?",
        a: "Les résultats varient selon ta configuration. En moyenne, nos utilisateurs rapportent +40% de FPS et -30ms de ping sur Fortnite. Sur des PC moins puissants (i5, GTX 1660), les gains peuvent être encore plus importants.",
      },
      {
        q: "Dois-je redémarrer Windows après les tweaks ?",
        a: "Oui, un redémarrage est recommandé après l'application des tweaks pour que tous les changements (services, registre, pilotes) prennent pleinement effet.",
      },
      {
        q: "Les tweaks sont-ils permanents ?",
        a: "Oui, les tweaks persistent après redémarrage. Mais tu peux les annuler à tout moment via le point de restauration Windows créé automatiquement, ou en réinstallant Windows.",
      },
      {
        q: "Kermouk Optimizer remplace-t-il un bon GPU ?",
        a: "Non. Kermouk optimise ce que tu as déjà — il supprime les goulots d'étranglement logiciels Windows. Si ton matériel est très ancien, les gains seront limités.",
      },
    ],
  },
  {
    category: "Premium & Paiement",
    color: "#a855f7",
    items: [
      {
        q: "Quelle est la différence entre FREE et Premium ?",
        a: "La version FREE inclut 10 tweaks de base (CPU, GameBar, haute performance). Premium débloque 30+ tweaks avancés : réseau TCP/IP, GPU NVIDIA, tweaks Fortnite avancés, profils par jeu, benchmark avant/après, et le Mode Tournoi.",
      },
      {
        q: "Comment fonctionne le paiement ?",
        a: "Le paiement est sécurisé via PayPal. Tu reçois une clé de licence UUID par email. Tu la saisis dans l'application pour activer Premium. Aucune inscription de compte nécessaire.",
      },
      {
        q: "Y a-t-il un remboursement ?",
        a: "Oui, politique satisfait ou remboursé sous 7 jours. Contacte-nous à support@kermouk.gg avec ta preuve d'achat.",
      },
      {
        q: "La licence Premium est-elle liée à mon PC ?",
        a: "La licence est liée à ta clé UUID. Tu peux l'utiliser sur 2 PC simultanément.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">FAQ</span>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            QUESTIONS <span className="gradient-text">FRÉQUENTES</span>
          </h1>
          <p className="text-gray-400 text-lg">Tout ce qu'il faut savoir sur Kermouk Optimizer</p>
        </div>

        {FAQS.map(cat => (
          <div key={cat.category} className="mb-10">
            <h2 className="font-orbitron font-black text-xl mb-4 flex items-center gap-3">
              <div className="w-1 h-6 rounded-full" style={{ background: cat.color }} />
              <span style={{ color: cat.color }}>{cat.category}</span>
            </h2>
            <div className="space-y-3">
              {cat.items.map(item => (
                <details key={item.q} className="card-gaming group" style={{ cursor: "pointer" }}>
                  <summary className="p-5 flex items-center justify-between font-rajdhani font-700 text-base list-none" style={{ cursor: "pointer" }}>
                    <span>{item.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 ml-4 text-gray-500 group-open:rotate-180 transition-transform">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-border pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="card-gaming p-8 text-center border border-orange/30 bg-orange/5 mt-10">
          <h2 className="font-orbitron font-black text-2xl mb-3">Tu as d'autres questions ?</h2>
          <p className="text-gray-400 mb-6">Notre équipe répond sous 24h.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/download" className="btn-orange">Télécharger gratuitement</Link>
            <a href="mailto:support@kermouk.gg" className="btn-ghost">Contacter le support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
