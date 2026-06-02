"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Tweaks Réseau TCP/IP",
    description:
      "Optimise autotuninglevel, RSS, DCA et DNS Cloudflare 1.1.1.1 pour réduire votre ping jusqu'à -30ms en jeu.",
    badge: "Premium",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Optimisation GPU",
    description:
      "Hardware Scheduling, désactivation HPET, tweaks registre TdrDelay pour une fluidité optimale et des FPS stables.",
    badge: "Premium",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
      </svg>
    ),
    title: "Priorité CPU & Mémoire",
    description:
      "SchedulingCategory High, GPU Priority 8, désactivation Memory Compression et optimisation fsutil pour le gaming.",
    badge: "Premium",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Tweaks Fortnite",
    description:
      "Priorité processus EpicGamesLauncher et FortniteClient en High, désactivation GameDVR et tweaks pagefile automatique.",
    badge: "Premium",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Services Windows",
    description:
      "Désactivation SysMain, DiagTrack, Xbox Services et autres services inutiles qui consomment CPU et RAM en arrière-plan.",
    badge: "Premium",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
    title: "Tweaks FREE Inclus",
    description:
      "Mode haute performance, désactivation Xbox Game Bar, Game DVR, notifications Windows et nettoyage fichiers temp. 100% gratuit.",
    badge: "Gratuit",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-28 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Fonctionnalités</span>
          <h2 className="font-orbitron font-black text-4xl md:text-5xl mb-4 section-title inline-block">
            TOUT CE DONT VOUS
            <br />
            <span className="gradient-text">AVEZ BESOIN</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6">
            Des tweaks testés et validés sur des centaines de configurations Windows 10/11
            pour extraire chaque FPS supplémentaire.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-gaming p-6 reveal group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
                  {f.icon}
                </div>
                <span
                  className={`text-xs font-rajdhani font-700 uppercase tracking-wider px-3 py-1 rounded-full ${
                    f.badge === "Gratuit"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-orange/10 text-orange border border-orange/20"
                  }`}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="font-rajdhani font-700 text-xl mb-2 group-hover:text-orange transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
