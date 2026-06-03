"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    name: "Mathis_FN",
    avatar: "M",
    color: "#FF6B00",
    game: "Fortnite",
    text: "Je suis passé de 80 à 144 FPS stables sur Fortnite avec seulement les tweaks FREE. Mode Tournoi c'est une autre dimension.",
    gain: "+80 FPS",
    stars: 5,
  },
  {
    name: "KaineZR",
    avatar: "K",
    color: "#3b82f6",
    game: "Warzone",
    text: "Mon ping EU est passé de 45ms à 18ms grâce aux tweaks réseau TCP. Je sens vraiment la différence dans les échanges.",
    gain: "-27ms ping",
    stars: 5,
  },
  {
    name: "SwiftApex",
    avatar: "S",
    color: "#22c55e",
    game: "Apex Legends",
    text: "Les microstutters ont complètement disparu sur Apex. J'avais essayé d'autres optimizers mais Kermouk est clairement le meilleur.",
    gain: "0 stutters",
    stars: 5,
  },
  {
    name: "ProGamerFR",
    avatar: "P",
    color: "#a855f7",
    game: "Valorant",
    text: "Compatible Vanguard sans aucun problème. Mon input lag est descendu sous les 10ms. Je vise mieux, clairement.",
    gain: "<10ms input lag",
    stars: 5,
  },
  {
    name: "TenshiCS2",
    avatar: "T",
    color: "#ef4444",
    game: "CS2",
    text: "Les launch options CS2 + les tweaks réseau, c'est game changing. 144 FPS stables sur ma GTX 1070 maintenant.",
    gain: "+60 FPS stables",
    stars: 5,
  },
  {
    name: "NovaClan_GG",
    avatar: "N",
    color: "#f59e0b",
    game: "Fortnite",
    text: "Mon squad utilise tous Kermouk avant les tournois. C'est devenu notre rituel pre-game. Résultats constants.",
    gain: "Top 5 placement x3",
    stars: 5,
  },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < stars ? "#FF6B00" : "#222"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => {
        const track = trackRef.current;
        if (!track) return p;
        const maxScroll = track.scrollWidth / 2;
        const next = p + 0.5;
        return next >= maxScroll ? 0 : next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <div className="inline-block badge-premium mb-4">Témoignages</div>
        <h2 className="font-orbitron font-black text-3xl md:text-4xl">
          CE QUE DISENT LES <span className="gradient-text">JOUEURS</span>
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
        <div ref={trackRef} className="flex gap-4" style={{ transform: `translateX(-${pos}px)`, width: "max-content" }}>
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 card-gaming p-5 flex flex-col gap-3"
              style={{ borderColor: `${t.color}22` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-black text-sm text-white flex-shrink-0"
                  style={{ background: `${t.color}22`, border: `1px solid ${t.color}44` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-rajdhani font-700 text-sm text-white">{t.name}</div>
                  <div className="text-xs text-gray-600">{t.game}</div>
                </div>
                <div className="ml-auto text-xs font-orbitron font-black" style={{ color: t.color }}>{t.gain}</div>
              </div>
              <StarRating stars={t.stars} />
              <p className="text-gray-400 text-sm leading-relaxed">&quot;{t.text}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
