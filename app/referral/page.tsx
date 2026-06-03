"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";

function generateReferralCode(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KRM-";
  const seed = Math.abs(hash);
  for (let i = 0; i < 6; i++) {
    code += chars[(seed >> (i * 4)) & 31];
  }
  return code;
}

export default function ReferralPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("kermouk_referral_count");
    setCount(saved ? parseInt(saved) : 0);
    const savedCode = localStorage.getItem("kermouk_referral_code");
    if (savedCode) setCode(savedCode);
  }, []);

  const handleGenerate = () => {
    if (!email.includes("@")) return;
    const c = generateReferralCode(email);
    setCode(c);
    localStorage.setItem("kermouk_referral_code", c);
    localStorage.setItem("kermouk_referral_email", email);
  };

  const referralLink = code ? `https://kermouk.gg/download?ref=${code}` : "";

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const REWARDS = [
    { goal: 1, label: "1 tweak premium", reached: count >= 1 },
    { goal: 2, label: "2 tweaks premium", reached: count >= 2 },
    { goal: 3, label: "3 tweaks premium", reached: count >= 3 },
    { goal: 4, label: "4 tweaks premium", reached: count >= 4 },
    { goal: 5, label: "5 tweaks premium + badge", reached: count >= 5 },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="badge-premium mb-4 inline-block">Programme Parrainage</span>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-4">
            INVITE TES AMIS,<br />
            <span className="gradient-text">GAGNE DES TWEAKS</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Partage ton lien de parrainage — chaque ami qui télécharge Kermouk te débloque <strong className="text-orange">1 tweak Premium gratuit</strong>.
          </p>
        </div>

        {/* Génération du code */}
        {!code ? (
          <div className="card-gaming p-8 mb-8">
            <h2 className="font-rajdhani font-700 text-xl mb-6 uppercase tracking-wider">Obtiens ton code</h2>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="ton.email@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-darker border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange"
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
              />
              <button onClick={handleGenerate} className="btn-orange px-6">
                Générer
              </button>
            </div>
          </div>
        ) : (
          <div className="card-gaming p-8 mb-8 border border-orange/30 bg-gradient-to-br from-orange/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-rajdhani font-700 text-xl uppercase tracking-wider">Ton code de parrainage</h2>
              <span className="font-orbitron font-black text-2xl text-orange tracking-widest">{code}</span>
            </div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-darker border border-border rounded-lg px-4 py-3 text-gray-400 text-sm font-mono"
              />
              <button onClick={copyLink} className={`px-6 rounded-lg font-rajdhani font-700 text-sm transition-all ${copied ? "bg-green-500/20 border border-green-500/40 text-green-400" : "btn-orange"}`}>
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
            <p className="text-xs text-gray-600">Partage ce lien sur Discord, Twitter, avec tes friends squad.</p>
          </div>
        )}

        {/* Progression */}
        <div className="card-gaming p-8 mb-8">
          <h2 className="font-rajdhani font-700 text-xl uppercase tracking-wider mb-2">Tes récompenses</h2>
          <p className="text-gray-500 text-sm mb-6">{count} ami{count !== 1 ? "s" : ""} invité{count !== 1 ? "s" : ""} — max 5 tweaks bonus</p>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-orange transition-all duration-700"
              style={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
            />
            <div className="relative flex justify-between">
              {REWARDS.map(r => (
                <div key={r.goal} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all ${r.reached ? "bg-orange border-orange" : "bg-darker border-border"}`}>
                    {r.reached ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-orbitron font-black text-sm text-gray-600">{r.goal}</span>
                    )}
                  </div>
                  <span className="text-xs text-center text-gray-500 max-w-16 leading-tight">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Génère ton lien", desc: "Entre ton email et obtiens un code unique" },
            { step: "2", title: "Partage", desc: "Envoie le lien à tes amis gamers" },
            { step: "3", title: "Gagne", desc: "Chaque téléchargement = 1 tweak Premium débloqué" },
          ].map(s => (
            <div key={s.step} className="card-gaming p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-orange/10 border border-orange/30 flex items-center justify-center mx-auto mb-3 font-orbitron font-black text-orange">{s.step}</div>
              <div className="font-rajdhani font-700 text-sm uppercase tracking-wider mb-2">{s.title}</div>
              <div className="text-gray-500 text-sm">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
