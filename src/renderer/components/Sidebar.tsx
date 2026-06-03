import type { Page } from "../App";

interface SidebarProps {
  currentPage: Page;
  isPremium: boolean;
  onNavigate: (page: Page) => void;
  onUnlockPremium: () => void;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ReactNode;
  premiumRequired?: boolean;
  isNew?: boolean;
}[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "Tweaks Système",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    isNew: true,
  },
  {
    id: "network",
    label: "Tweaks Réseau",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "gpu",
    label: "Tweaks GPU",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M8 12v1M16 12v1" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "fortnite",
    label: "Tweaks Fortnite",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    premiumRequired: true,
  },
  {
    id: "fortnite-advanced",
    label: "Fortnite Avancé",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        <circle cx="19" cy="5" r="3" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "bios",
    label: "Guide BIOS",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M8 4v16M12 4v16M16 4v16M2 10h20M2 14h20" />
      </svg>
    ),
    premiumRequired: true,
  },
  {
    id: "overclock",
    label: "Overclocking",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        <circle cx="18" cy="6" r="3" />
      </svg>
    ),
    premiumRequired: true,
  },
  {
    id: "gpo",
    label: "GPO & Système",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "inputlag",
    label: "Input Lag Calc",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    isNew: true,
  },
  {
    id: "benchmark",
    label: "Benchmark",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "gameprofiles",
    label: "Profils Jeux",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="10" x2="16" y2="14"/>
      </svg>
    ),
    premiumRequired: true,
    isNew: true,
  },
  {
    id: "cleaner",
    label: "Nettoyeur",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    ),
    isNew: true,
  },
  {
    id: "about",
    label: "À propos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentPage, isPremium, onNavigate, onUnlockPremium }: SidebarProps) {
  return (
    <aside className="sidebar flex flex-col">
      {/* Nav items */}
      <div className="flex-1">
        <div style={{ fontSize: "9px", color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 12px 8px", fontWeight: 700 }}>
          Navigation
        </div>

        {navItems.map((item) => {
          const locked = item.premiumRequired && !isPremium;
          return (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""} ${locked ? "opacity-60" : ""}`}
              onClick={() => onNavigate(item.id)}
              title={locked ? "Fonctionnalité Premium" : undefined}
            >
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.isNew && (
                <span className="badge badge-new">NEW</span>
              )}
              {locked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )}
              {item.premiumRequired && isPremium && !item.isNew && (
                <span className="badge badge-premium" style={{ fontSize: "8px" }}>PRO</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Premium CTA */}
      {!isPremium && (
        <div
          onClick={onUnlockPremium}
          style={{
            margin: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: "var(--primary-dim)",
            border: "1px solid var(--primary-border)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
            Passer Premium
          </div>
          <div style={{ fontSize: "10px", color: "#666", lineHeight: 1.4 }}>
            Déverrouillez tous les tweaks avancés
          </div>
          <div style={{ marginTop: "8px", padding: "6px 10px", background: "var(--primary)", borderRadius: "6px", textAlign: "center", fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>
            Entrer ma clé
          </div>
        </div>
      )}

      {isPremium && (
        <div
          style={{
            margin: "8px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Premium Actif
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
