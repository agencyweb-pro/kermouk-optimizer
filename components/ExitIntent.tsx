"use client";

import { useEffect, useState } from "react";

export default function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("kermouk_exit_shown")) return;

    let triggered = false;
    const onMouseLeave = (e: MouseEvent) => {
      if (triggered || e.clientY > 10) return;
      triggered = true;
      setVisible(true);
      localStorage.setItem("kermouk_exit_shown", "1");
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    localStorage.setItem("kermouk_exit_email", email);
    setTimeout(() => setVisible(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) setVisible(false); }}
    >
      <div
        className="relative max-w-md w-full card-gaming p-8 text-center"
        style={{ border: "1px solid rgba(255,107,0,0.4)", background: "linear-gradient(135deg, rgba(255,107,0,0.06) 0%, #111 100%)" }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="text-3xl mb-4">⚡</div>
            <div className="inline-block badge-premium mb-4">Offre exclusive</div>
            <h2 className="font-orbitron font-black text-2xl mb-3">
              ATTENDS !<br />
              <span className="gradient-text">1 mois Premium gratuit</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Entre ton email et reçois un code pour <strong className="text-orange">1 mois Premium offert</strong>.
              30+ tweaks avancés, Mode Tournoi, benchmark avant/après.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="ton.email@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-darker border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange"
              />
              <button type="submit" className="btn-orange w-full">
                Recevoir mon mois gratuit
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-3">Pas de spam. Désabonnement en 1 clic.</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="font-orbitron font-black text-2xl mb-3 text-green-400">Merci !</h2>
            <p className="text-gray-400">Check tes emails — ton code Premium arrive dans quelques minutes.</p>
          </>
        )}
      </div>
    </div>
  );
}
