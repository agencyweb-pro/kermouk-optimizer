import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-darker py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded bg-orange flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
              </div>
              <span className="font-orbitron font-black text-xs tracking-widest">
                KERMOUK<span className="text-orange"> OPTIMIZER</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              L&apos;optimizer gaming ultime pour Fortnite. Tweaks Windows avancés,
              optimisation réseau et GPU.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-rajdhani font-700 uppercase tracking-wider text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><Link href="/" className="hover:text-orange transition-colors">Accueil</Link></li>
              <li><Link href="/#features" className="hover:text-orange transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/download" className="hover:text-orange transition-colors">Télécharger</Link></li>
              <li><Link href="/payment" className="hover:text-orange transition-colors">Premium</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-rajdhani font-700 uppercase tracking-wider text-sm mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><span className="hover:text-orange transition-colors cursor-pointer">Mentions légales</span></li>
              <li><span className="hover:text-orange transition-colors cursor-pointer">Politique de confidentialité</span></li>
              <li><span className="hover:text-orange transition-colors cursor-pointer">CGU</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 KERMOUK OPTIMIZER. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs">
            Non affilié à Epic Games ou Fortnite™
          </p>
        </div>
      </div>
    </footer>
  );
}
