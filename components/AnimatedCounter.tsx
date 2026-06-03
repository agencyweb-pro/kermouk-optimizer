"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

const STATS = [
  { value: 2341, suffix: "+", label: "Utilisateurs optimisés", prefix: "" },
  { value: 40, suffix: "%", label: "FPS moyens gagnés", prefix: "+" },
  { value: 30, suffix: "ms", label: "Latence réduite", prefix: "-" },
  { value: 49, suffix: "/5", label: "Note utilisateurs", prefix: "4." },
];

export default function AnimatedCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const vals = STATS.map(s => useCountUp(s.value, 2000, started));

  return (
    <section ref={ref} className="py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="reveal">
              <div className="stat-number">
                {stat.prefix}{vals[i]}{stat.suffix}
              </div>
              <div className="text-gray-400 text-sm mt-2 font-rajdhani uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
